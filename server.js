// Project Control Room — zero-dependency Node server (Node 16+).
// Serves the UI from public/, project config from projects.json, the curated
// per-project analysis from analysis/<id>.json, live GitHub data (cached), and
// the state of local clones found next to this folder.

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = Number(process.env.PORT) || 5555;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const ANALYSIS = path.join(ROOT, 'analysis');
const SCAN_DIRS = (process.env.SCAN_DIRS || path.dirname(ROOT)).split(path.delimiter);
const GH_TTL = 10 * 60 * 1000;

// ---------- helpers ----------

const readJSON = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

const loadProjects = () => readJSON(path.join(ROOT, 'projects.json'), []).map((p) => {
  const m = p.repo.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  return { ...p, owner: m && m[1], name: p.name || (m && m[2]), slug: m && `${m[1]}/${m[2]}` };
});

const git = (cwd, args) => new Promise((resolve) => {
  execFile('git', ['-C', cwd, ...args], { timeout: 8000, maxBuffer: 4 * 1024 * 1024 }, (err, out) => {
    // trimEnd only: `status --porcelain` lines start with a meaningful space.
    resolve(err ? null : out.replace(/\s+$/, ''));
  });
});

const normRemote = (url) => {
  const m = url && url.match(/github\.com[/:]([^/]+)\/(.+?)(\.git)?$/i);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
};

// ---------- GitHub token (optional) ----------

let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;
if (!token) {
  execFile('gh', ['auth', 'token'], { timeout: 4000 }, (err, out) => {
    if (!err && out.trim()) token = out.trim();
  });
}

// ---------- GitHub API with ETag cache ----------

const ghCache = new Map(); // url -> { etag, body, at, status }
let rateLimit = null;

function ghGet(apiPath, { useToken = true } = {}) {
  const url = `https://api.github.com${apiPath}`;
  const cached = ghCache.get(url);
  if (cached && Date.now() - cached.at < GH_TTL) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const headers = {
      'User-Agent': 'project-control-room',
      Accept: 'application/vnd.github+json',
    };
    if (useToken && token) headers.Authorization = `Bearer ${token}`;
    if (cached && cached.etag) headers['If-None-Match'] = cached.etag;
    const req = https.get(url, { headers, timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        if (res.headers['x-ratelimit-remaining']) {
          rateLimit = {
            remaining: Number(res.headers['x-ratelimit-remaining']),
            limit: Number(res.headers['x-ratelimit-limit']),
            reset: Number(res.headers['x-ratelimit-reset']) * 1000,
            authenticated: Boolean(headers.Authorization),
          };
        }
        // Bad token: retry once without it.
        if (res.statusCode === 401 && headers.Authorization) {
          token = null;
          resolve(ghGet(apiPath, { useToken: false }));
          return;
        }
        if (res.statusCode === 304 && cached) {
          cached.at = Date.now();
          resolve(cached);
          return;
        }
        let body = null;
        try { body = JSON.parse(data); } catch { /* ignore */ }
        const entry = { status: res.statusCode, etag: res.headers.etag, body, at: Date.now() };
        if (res.statusCode === 200) ghCache.set(url, entry);
        // On errors (rate limit etc.) keep serving stale data if we have it.
        resolve(res.statusCode === 200 ? entry : (cached || entry));
      });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (e) => resolve(cached || { status: 0, body: null, error: e.message }));
  });
}

async function githubInfo(p) {
  if (!p.slug) return { ok: false, error: 'Not a GitHub URL' };
  const [repo, commits, langs, issues] = await Promise.all([
    ghGet(`/repos/${p.slug}`),
    ghGet(`/repos/${p.slug}/commits?per_page=15`),
    ghGet(`/repos/${p.slug}/languages`),
    ghGet(`/repos/${p.slug}/issues?state=open&per_page=30`),
  ]);
  if (repo.status !== 200) {
    const msg = repo.body && repo.body.message;
    return { ok: false, error: msg || (repo.error ? `Network: ${repo.error}` : `HTTP ${repo.status}`) };
  }
  const r = repo.body;
  const issueList = Array.isArray(issues.body) ? issues.body : [];
  return {
    ok: true,
    fetchedAt: repo.at,
    description: r.description,
    homepage: r.homepage,
    private: r.private,
    defaultBranch: r.default_branch,
    stars: r.stargazers_count,
    forks: r.forks_count,
    size: r.size,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    topics: r.topics || [],
    empty: r.size === 0 || commits.status === 409,
    languages: langs.status === 200 ? langs.body : {},
    openIssues: issueList.filter((i) => !i.pull_request).map((i) => ({
      number: i.number, title: i.title, url: i.html_url, createdAt: i.created_at,
      labels: (i.labels || []).map((l) => l.name),
    })),
    openPulls: issueList.filter((i) => i.pull_request).map((i) => ({
      number: i.number, title: i.title, url: i.html_url, createdAt: i.created_at,
    })),
    commits: Array.isArray(commits.body) ? commits.body.map((c) => ({
      sha: c.sha,
      message: c.commit.message.split('\n')[0],
      author: (c.commit.author && c.commit.author.name) || (c.author && c.author.login),
      date: c.commit.author && c.commit.author.date,
      url: c.html_url,
    })) : [],
  };
}

// ---------- local clones ----------

let localIndex = null; // slug(lowercase) -> [abs paths]
let localIndexAt = 0;

async function buildLocalIndex() {
  if (localIndex && Date.now() - localIndexAt < 60 * 1000) return localIndex;
  const index = {};
  const candidates = [ROOT];
  for (const dir of SCAN_DIRS) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith('.')) candidates.push(path.join(dir, e.name));
    }
  }
  await Promise.all([...new Set(candidates)].map(async (dir) => {
    if (!fs.existsSync(path.join(dir, '.git'))) return;
    const url = await git(dir, ['remote', 'get-url', 'origin']);
    const slug = normRemote(url);
    if (slug) (index[slug] = index[slug] || []).push(dir);
  }));
  localIndex = index;
  localIndexAt = Date.now();
  return index;
}

async function localInfo(p) {
  const index = await buildLocalIndex();
  const dirs = (p.localPath ? [path.resolve(ROOT, p.localPath)] : index[(p.slug || '').toLowerCase()]) || [];
  return Promise.all(dirs.map(async (dir) => {
    const [branch, status, counts, log, upstream] = await Promise.all([
      git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']),
      git(dir, ['status', '--porcelain']),
      git(dir, ['rev-list', '--left-right', '--count', '@{u}...HEAD']),
      git(dir, ['log', '-15', '--format=%H%x1f%an%x1f%aI%x1f%s']),
      git(dir, ['rev-parse', '--abbrev-ref', '@{u}']),
    ]);
    const changes = status ? status.split('\n').filter(Boolean).map((l) => ({ code: l.slice(0, 2).trim(), file: l.slice(3) })) : [];
    const [behind, ahead] = counts ? counts.split(/\s+/).map(Number) : [null, null];
    return {
      path: dir,
      branch,
      upstream,
      ahead,
      behind,
      changes,
      commits: log ? log.split('\n').map((l) => {
        const [sha, author, date, message] = l.split('\x1f');
        return { sha, author, date, message };
      }) : [],
    };
  }));
}

// ---------- analysis ----------

function loadAnalysis(id) {
  const a = readJSON(path.join(ANALYSIS, `${id}.json`), null);
  if (!a) return null;
  const rows = a.matrix || [];
  a.parity = rows.length ? Math.round((rows.reduce((s, r) => s + (r.us || 0), 0) / rows.length) * 100) : null;
  a.gapCount = rows.filter((r) => (r.us || 0) < 1).length;
  return a;
}

// ---------- HTTP ----------

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.png': 'image/png', '.ico': 'image/x-icon',
};

const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

async function api(req, res, url) {
  const projects = loadProjects();
  const parts = url.pathname.split('/').filter(Boolean); // ['api', ...]

  if (parts[1] === 'projects' && parts.length === 2) {
    const list = await Promise.all(projects.map(async (p) => {
      const [gh, local] = await Promise.all([githubInfo(p), localInfo(p)]);
      const a = loadAnalysis(p.id);
      return {
        ...p,
        analysis: a && {
          tagline: a.tagline, stage: a.stage, platform: a.platform, stack: a.stack,
          parity: a.parity, gapCount: a.gapCount, analyzedAt: a.analyzedAt,
          topNext: (a.nextSteps || [])[0] || null,
        },
        github: gh.ok ? {
          ok: true, pushedAt: gh.pushedAt, lastCommit: gh.commits[0] || null,
          openIssues: gh.openIssues.length, openPulls: gh.openPulls.length, empty: gh.empty,
        } : gh,
        local: local.map((l) => ({ path: l.path, branch: l.branch, ahead: l.ahead, behind: l.behind, changes: l.changes.length })),
      };
    }));
    return send(res, 200, { projects: list, rateLimit });
  }

  if (parts[1] === 'projects' && parts[2]) {
    const p = projects.find((x) => x.id === parts[2]);
    if (!p) return send(res, 404, { error: 'Unknown project' });
    const [gh, local] = await Promise.all([githubInfo(p), localInfo(p)]);
    return send(res, 200, { ...p, analysis: loadAnalysis(p.id), github: gh, local, rateLimit });
  }

  if (parts[1] === 'refresh' && req.method === 'POST') {
    const id = parts[2];
    const p = projects.find((x) => x.id === id);
    for (const key of ghCache.keys()) {
      if (!p || key.includes(`/repos/${p.slug}`)) ghCache.get(key).at = 0; // keep ETag, force revalidate
    }
    localIndex = null;
    return send(res, 200, { ok: true });
  }

  return send(res, 404, { error: 'Not found' });
}

function serveStatic(res, pathname) {
  const rel = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC)) return send(res, 403, 'Forbidden', 'text/plain');
  fs.readFile(file, (err, buf) => {
    if (err) {
      // SPA fallback
      return fs.readFile(path.join(PUBLIC, 'index.html'), (e2, html) => (
        e2 ? send(res, 404, 'Not found', 'text/plain') : send(res, 200, html, MIME['.html'])
      ));
    }
    send(res, 200, buf, MIME[path.extname(file)] || 'application/octet-stream');
  });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    return serveStatic(res, url.pathname);
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: e.message });
  }
}).listen(PORT, () => {
  console.log(`Project Control Room → http://localhost:${PORT}`);
});

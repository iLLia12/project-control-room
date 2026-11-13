'use strict';

// ---------- icons (Lucide-style, 24×24 stroke) ----------
const ICONS = {
  gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  chess: '<path d="M5 21h14"/><path d="M7 21v-2.5h10V21"/><path d="M8.5 18.5c0-3.2 3-4.6 3.5-7.6l-3.4 1.7a1.6 1.6 0 0 1-2-.5l-.7-1a1.6 1.6 0 0 1 .3-2.1L11 5V2.5l1.8 1.8C16.6 4.8 18 8.4 18 12v6.5"/><circle cx="12.2" cy="7.6" r=".5" fill="currentColor"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  radar: '<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  branch: '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  sync: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  dot: '<circle cx="12" cy="12" r="1"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
};
const icon = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.dot}</svg>`;

// ---------- utils ----------
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function ago(date) {
  if (!date) return '—';
  const s = (Date.now() - new Date(date).getTime()) / 1000;
  if (s < 60) return 'just now';
  const units = [['y', 31536000], ['mo', 2592000], ['w', 604800], ['d', 86400], ['h', 3600], ['m', 60]];
  for (const [u, n] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return 'just now';
}
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—');
const home = (p) => p.replace(/^\/Users\/[^/]+/, '~');
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Swift: '#F05138', GDScript: '#355570', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#663399', Shell: '#89e051', Dockerfile: '#384d54', 'Objective-C': '#438eff',
  C: '#555555', 'C++': '#f34b7d', Go: '#00ADD8', Ruby: '#701516', 'GLSL': '#5686a5',
};
const langColor = (l, i) => LANG_COLORS[l] || ['#8b949e', '#a371f7', '#3fb950', '#d29922', '#db61a2'][i % 5];

async function getJSON(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// ---------- state ----------
const state = {
  list: [],
  rateLimit: null,
  details: {},      // id -> full project
  route: { view: 'overview' },
  gapsOnly: false,
  sidebar: true,
  loadedAt: null,
};
try {
  state.gapsOnly = localStorage.getItem('pcr.gapsOnly') === '1';
  state.sidebar = localStorage.getItem('pcr.sidebar') !== '0';
} catch { /* storage unavailable */ }
const save = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

function parseRoute() {
  const m = location.hash.match(/^#\/p\/([\w.-]+)/);
  state.route = m ? { view: 'project', id: m[1] } : { view: 'overview' };
}

// ---------- tooltip ----------
const tip = $('#tooltip');
let tipTimer = null;
function showTip(el) {
  clearTimeout(tipTimer);
  tipTimer = setTimeout(() => {
    tip.innerHTML = el.dataset.tip;
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    tip.style.left = `${r.right + 8}px`;
    tip.style.top = `${Math.max(4, r.top + r.height / 2 - t.height / 2)}px`;
  }, 120);
}
function hideTip() { clearTimeout(tipTimer); tip.hidden = true; }
document.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
document.addEventListener('mouseout', (e) => { const el = e.target.closest('[data-tip]'); if (el && !el.contains(e.relatedTarget)) hideTip(); });
document.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
document.addEventListener('focusout', hideTip);
document.addEventListener('click', hideTip);

// ---------- derived ----------
function localSummary(local) {
  if (!local || !local.length) return null;
  const l = local[0];
  return { ...l, changes: Array.isArray(l.changes) ? l.changes.length : l.changes };
}
function isStale(p) {
  const at = p.analysis && p.analysis.analyzedAt;
  const last = p.github && p.github.ok && (p.github.lastCommit ? p.github.lastCommit.date : (p.github.commits && p.github.commits[0] && p.github.commits[0].date));
  if (!at || !last) return false;
  return new Date(last) > new Date(`${at}T23:59:59`);
}

// ---------- activity bar ----------
function renderActivityBar() {
  const route = state.route;
  $('#ab-top').innerHTML = `
    <button class="ab-item ${route.view === 'overview' ? 'active' : ''}" data-go="#/" data-tip="Overview" aria-label="Overview">${icon('grid')}</button>`;
  $('#ab-projects').innerHTML = state.list.map((p, i) => {
    const ls = localSummary(p.local);
    const dirty = ls ? (ls.changes || 0) + (ls.ahead || 0) : 0;
    const active = route.view === 'project' && route.id === p.id;
    return `<button class="ab-item ${active ? 'active' : ''}" data-go="#/p/${esc(p.id)}"
      data-tip="${esc(p.name)}${i < 9 ? ` <span class='tt-sub'>⌃${i + 1}</span>` : ''}" aria-label="${esc(p.name)}">
      ${icon(p.icon)}
      <span class="dot" style="background:${esc(p.color || '#888')}"></span>
      ${dirty ? `<span class="badge">${dirty > 99 ? '99+' : dirty}</span>` : ''}
    </button>`;
  }).join('');
  $('#ab-bottom').innerHTML = `
    <button class="ab-item" id="refresh-btn" data-tip="Refresh <span class='tt-sub'>R</span>" aria-label="Refresh">${icon('refresh')}</button>`;
}

document.getElementById('activitybar').addEventListener('click', (e) => {
  const b = e.target.closest('.ab-item');
  if (!b) return;
  if (b.id === 'refresh-btn') return refresh();
  const target = b.dataset.go;
  const current = location.hash || '#/';
  if (target === current || (target === '#/' && current === '')) {
    // VS Code behavior: clicking the active view toggles the sidebar
    state.sidebar = !state.sidebar;
    save('pcr.sidebar', state.sidebar ? '1' : '0');
    applySidebar();
  } else {
    if (!state.sidebar) { state.sidebar = true; save('pcr.sidebar', '1'); applySidebar(); }
    location.hash = target;
  }
});
function applySidebar() {
  document.querySelector('.workbench').classList.toggle('sidebar-hidden', !state.sidebar);
}

// ---------- sidebar ----------
const SECTIONS = [
  ['summary', 'Summary', 'list'],
  ['implemented', 'Implemented', 'check'],
  ['progress', 'In progress', 'branch'],
  ['comparison', 'Compared to similar apps', 'grid'],
  ['next', 'Next steps', 'chevron'],
  ['risks', 'Risks and tech debt', 'alert'],
  ['activity', 'Activity', 'clock'],
];
function renderSidebar() {
  const title = $('#sb-title');
  const body = $('#sb-body');
  if (state.route.view === 'overview') {
    title.textContent = 'PROJECTS';
    body.innerHTML = `<div class="sb-section-h">${icon('chevron')} All projects</div>` + state.list.map((p) => {
      const a = p.analysis || {};
      return `<div class="sb-row" data-go="#/p/${esc(p.id)}">${icon(p.icon)}<span class="grow">${esc(p.name)}</span><span class="meta">${esc(a.stage || '')}</span></div>`;
    }).join('');
    return;
  }
  const p = state.details[state.route.id] || state.list.find((x) => x.id === state.route.id);
  if (!p) { body.innerHTML = ''; return; }
  title.textContent = p.name.toUpperCase();
  const a = p.analysis || {};
  const ls = localSummary(p.local);
  const gh = p.github || {};
  body.innerHTML = `
    <div class="sb-section-h">${icon('chevron')} Outline</div>
    ${SECTIONS.filter(([id]) => id !== 'progress' || (a.inProgress || []).length).map(([id, label, ic]) => `<div class="sb-row" data-scroll="${id}">${icon(ic)}<span class="grow">${label}</span>${
      id === 'comparison' && a.gapCount != null ? `<span class="meta">${a.gapCount} gaps</span>` : ''}${
      id === 'next' && a.nextSteps ? `<span class="meta">${a.nextSteps.length}</span>` : ''}</div>`).join('')}
    <div class="sb-section-h" style="margin-top:6px">${icon('chevron')} Details</div>
    <div class="sb-kv"><span>Stage</span><span>${esc(a.stage || '—')}</span></div>
    <div class="sb-kv"><span>Parity</span><span>${a.parity != null ? `${a.parity}%` : '—'}</span></div>
    <div class="sb-kv"><span>Platform</span><span title="${esc(a.platform)}">${esc(a.platform || '—')}</span></div>
    <div class="sb-kv"><span>Last push</span><span>${gh.ok ? ago(gh.pushedAt) : '—'}</span></div>
    <div class="sb-kv"><span>Local</span><span>${ls ? esc(ls.branch || '?') : 'not cloned'}</span></div>
    <div class="sb-kv"><span>Analyzed</span><span>${esc(a.analyzedAt || '—')}</span></div>
    <div class="sb-section-h" style="margin-top:6px">${icon('chevron')} Projects</div>
    ${state.list.map((x) => `<div class="sb-row ${x.id === p.id ? 'active' : ''}" data-go="#/p/${esc(x.id)}">${icon(x.icon)}<span class="grow">${esc(x.name)}</span></div>`).join('')}
  `;
}
$('#sb-body').addEventListener('click', (e) => {
  const r = e.target.closest('.sb-row');
  if (!r) return;
  if (r.dataset.go) location.hash = r.dataset.go;
  if (r.dataset.scroll) {
    const el = document.getElementById(`sec-${r.dataset.scroll}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ---------- tabs ----------
function renderTabs() {
  if (state.route.view === 'overview') {
    $('#tabs').innerHTML = `<div class="tab active">${icon('grid')}Overview</div>`;
  } else {
    const p = state.list.find((x) => x.id === state.route.id);
    $('#tabs').innerHTML = `<div class="tab active" style="color:var(--fg-strong)">${p ? `<span style="color:${esc(p.color)}">${icon(p.icon)}</span>${esc(p.name)}` : esc(state.route.id)}</div>`;
  }
}

// ---------- overview ----------
function renderOverview() {
  const list = state.list;
  const totalGaps = list.reduce((s, p) => s + ((p.analysis && p.analysis.gapCount) || 0), 0);
  const p1 = list.length;
  const uncommitted = list.reduce((s, p) => { const l = localSummary(p.local); return s + (l ? (l.changes || 0) : 0); }, 0);
  const unpushed = list.reduce((s, p) => { const l = localSummary(p.local); return s + (l ? (l.ahead || 0) : 0); }, 0);
  const avgParity = Math.round(list.reduce((s, p) => s + ((p.analysis && p.analysis.parity) || 0), 0) / (list.length || 1));
  $('#content').innerHTML = `<div class="page">
    <div class="ov-head"><h1>Control Room</h1><p>${p1} projects · ${totalGaps} feature gaps tracked</p></div>
    <div class="kpis">
      <div class="kpi"><div class="label">Projects</div><div class="value">${list.length}</div><div class="sub">${list.filter((p) => p.local && p.local.length).length} cloned locally</div></div>
      <div class="kpi"><div class="label">Avg. parity</div><div class="value">${avgParity}%</div><div class="meter"><i style="width:${avgParity}%"></i></div></div>
      <div class="kpi"><div class="label">Uncommitted</div><div class="value ${uncommitted ? 'warn' : ''}">${uncommitted}</div><div class="sub">files across clones</div></div>
      <div class="kpi"><div class="label">Unpushed</div><div class="value ${unpushed ? 'warn' : ''}">${unpushed}</div><div class="sub">commits ahead of origin</div></div>
    </div>
    <div class="ov-grid">${list.map(ovCard).join('')}</div>
  </div>`;
}
function ovCard(p) {
  const a = p.analysis || {};
  const gh = p.github || {};
  const ls = localSummary(p.local);
  let localTxt = '<span class="faint">not cloned</span>';
  if (ls) {
    const parts = [];
    if (ls.changes) parts.push(`<span class="warn">${ls.changes} changed</span>`);
    if (ls.ahead) parts.push(`<span class="warn">↑${ls.ahead}</span>`);
    if (ls.behind) parts.push(`<span class="warn">↓${ls.behind}</span>`);
    localTxt = parts.length ? parts.join(' ') : '<span class="ok">clean</span>';
  }
  let last = '—';
  if (gh.ok) last = gh.empty ? '<span class="warn">empty repo</span>' : ago(gh.lastCommit ? gh.lastCommit.date : gh.pushedAt);
  else if (gh.error) last = '<span class="faint" title="' + esc(gh.error) + '">unavailable</span>';
  const next = a.topNext;
  return `<div class="ov-card" tabindex="0" data-go="#/p/${esc(p.id)}" style="--c:${esc(p.color)}">
    <div class="ov-top">
      <div class="hero-icon">${icon(p.icon)}</div>
      <div style="min-width:0;flex:1">
        <div class="name">${esc(p.name)}</div>
        <div class="tl">${esc(a.tagline || '')}</div>
      </div>
      <span class="chip stage">${esc(a.stage || '—')}</span>
    </div>
    <div class="ov-stats">
      <div><div class="l">Parity</div><div class="v">${a.parity != null ? `${a.parity}%` : '—'}</div><div class="meter"><i style="width:${a.parity || 0}%;background:${esc(p.color)}"></i></div></div>
      <div><div class="l">Last commit</div><div class="v">${last}</div></div>
      <div><div class="l">Local</div><div class="v">${localTxt}</div></div>
    </div>
    ${next ? `<div class="ov-next"><span class="prio ${esc(next.priority)}">${esc(next.priority)}</span><span title="${esc(next.title)}">${esc(next.title)}</span></div>` : ''}
  </div>`;
}
$('#content').addEventListener('click', (e) => {
  const c = e.target.closest('[data-go]');
  if (c) location.hash = c.dataset.go;
  const seg = e.target.closest('[data-gaps]');
  if (seg) {
    state.gapsOnly = seg.dataset.gaps === '1';
    save('pcr.gapsOnly', state.gapsOnly ? '1' : '0');
    renderProject();
  }
});
$('#content').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { const c = e.target.closest('.ov-card'); if (c) location.hash = c.dataset.go; }
});

// ---------- project page ----------
const cov = (v) => {
  const cls = v >= 1 ? 'c1' : v > 0 ? 'c05' : 'c0';
  const label = v >= 1 ? 'Yes' : v > 0 ? 'Partial' : 'No';
  return `<span class="cov ${cls}" title="${label}" aria-label="${label}"></span>`;
};

function renderProject() {
  const id = state.route.id;
  const p = state.details[id];
  if (!p) {
    $('#content').innerHTML = '<div class="loading">Loading…</div>';
    return;
  }
  const scrollTop = $('#content').scrollTop;
  const a = p.analysis || {};
  const gh = p.github || {};
  const local = p.local || [];
  const ls = local[0];
  const stale = isStale(p);

  const lastCommit = gh.ok && gh.commits && gh.commits[0];
  const p1Gaps = (a.matrix || []).filter((r) => r.us < 1 && r.priority === 'P1').length;

  let localValue = '—';
  let localSub = 'no local clone found';
  if (ls) {
    const n = ls.changes.length;
    localValue = n ? `<span class="warn">${n}</span>` : '<span class="ok">clean</span>';
    localSub = `${ls.branch || '?'}${ls.ahead ? ` · ↑${ls.ahead} unpushed` : ''}${ls.behind ? ` · ↓${ls.behind}` : ''}${n ? ' · uncommitted' : ''}`;
  }

  const comps = a.competitors || [];
  const rows = (a.matrix || []).filter((r) => !state.gapsOnly || r.us < 1);

  $('#content').innerHTML = `<div class="page" style="--c:${esc(p.color)}">
    <div class="hero">
      <div class="hero-icon">${icon(p.icon)}</div>
      <div style="min-width:0;flex:1">
        <h1>${esc(p.name)}</h1>
        <div class="tagline">${esc(a.tagline || gh.description || '')}</div>
        <div class="chips">
          ${a.stage ? `<span class="chip stage">${esc(a.stage)}</span>` : ''}
          ${a.platform ? `<span class="chip">${esc(a.platform)}</span>` : ''}
          ${(a.stack || []).map((s) => `<span class="chip">${esc(s)}</span>`).join('')}
          ${stale ? `<span class="chip warn" title="There are commits newer than this analysis">${icon('alert')}Analysis may be stale</span>` : ''}
        </div>
        <div class="links">
          <a href="${esc(p.repo)}" target="_blank" rel="noopener">${icon('external')}${esc(p.slug || p.repo)}</a>
          ${gh.ok && gh.homepage ? `<a href="${esc(gh.homepage)}" target="_blank" rel="noopener">${icon('cloud')}${esc(gh.homepage.replace(/^https?:\/\//, ''))}</a>` : ''}
          ${local.map((l) => `<span>${icon('folder')}${esc(home(l.path))}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><div class="label">Feature parity</div><div class="value">${a.parity != null ? `${a.parity}%` : '—'}</div><div class="meter"><i style="width:${a.parity || 0}%;background:${esc(p.color)}"></i></div></div>
      <div class="kpi"><div class="label">Gaps</div><div class="value">${a.gapCount != null ? a.gapCount : '—'}</div><div class="sub">${p1Gaps} high priority</div></div>
      <div class="kpi"><div class="label">Last commit</div><div class="value">${gh.ok ? (gh.empty ? '<span class="warn">—</span>' : esc(ago(lastCommit && lastCommit.date))) : '—'}</div><div class="sub">${gh.ok ? (gh.empty ? 'repository is empty' : esc(lastCommit ? lastCommit.message : '')) : esc(gh.error || '')}</div></div>
      <div class="kpi"><div class="label">Open issues / PRs</div><div class="value">${gh.ok ? `${gh.openIssues.length} / ${gh.openPulls.length}` : '—'}</div><div class="sub">${gh.ok ? `${gh.private ? 'private' : 'public'} · ${gh.stars}★` : ''}</div></div>
      <div class="kpi"><div class="label">Local changes</div><div class="value">${localValue}</div><div class="sub" title="${esc(localSub)}">${esc(localSub)}</div></div>
    </div>

    <section class="block" id="sec-summary">
      <h2>Summary<span class="spacer"></span></h2>
      <p class="summary">${esc(a.summary || 'No analysis yet. Add analysis/' + p.id + '.json.')}</p>
    </section>

    <section class="block" id="sec-implemented">
      <h2>Implemented <span class="count">${(a.implemented || []).reduce((s, g) => s + g.items.length, 0)}</span><span class="spacer"></span></h2>
      <div class="groups">${(a.implemented || []).map((g) => `
        <div class="group"><h3>${esc(g.group)}</h3><ul>${g.items.map((it) => `<li>${icon('check')}<span>${esc(it)}</span></li>`).join('')}</ul></div>`).join('')}
      </div>
    </section>

    ${(a.inProgress || []).length ? `<section class="block" id="sec-progress">
      <h2>In progress, not on main <span class="count">${a.inProgress.reduce((s, g) => s + g.items.length, 0)}</span><span class="spacer"></span></h2>
      <div class="groups">${a.inProgress.map((g) => `
        <div class="group wip"><h3>${icon('branch')}${esc(g.where)}</h3><ul>${g.items.map((it) => `<li>${icon('dot')}<span>${esc(it)}</span></li>`).join('')}</ul></div>`).join('')}
      </div>
    </section>` : ''}

    <section class="block" id="sec-comparison">
      <h2>Compared to similar apps <span class="count">${a.gapCount || 0} gaps</span><span class="spacer"></span></h2>
      <div class="comp-notes">${comps.map((c) => `<span><b>${esc(c.name)}</b>: ${esc(c.note)}</span>`).join('')}</div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Filter">
          <button data-gaps="0" class="${state.gapsOnly ? '' : 'on'}">All features</button>
          <button data-gaps="1" class="${state.gapsOnly ? 'on' : ''}">Gaps only</button>
        </div>
        <div class="legend"><span>${cov(1)} Yes</span><span>${cov(0.5)} Partial</span><span>${cov(0)} No</span></div>
      </div>
      <div class="table-wrap"><table class="matrix">
        <thead><tr><th>Feature</th><th class="us">${esc(p.name)}</th>${comps.map((c) => `<th>${esc(c.name)}</th>`).join('')}<th>Priority</th></tr></thead>
        <tbody>${rows.map((r) => `<tr class="${r.us < 1 ? 'gap' : ''}">
          <td class="feat">${esc(r.feature)}${r.note ? `<span class="note">${esc(r.note)}</span>` : ''}</td>
          <td class="us">${cov(r.us)}</td>
          ${comps.map((_, i) => `<td>${cov((r.comp || [])[i] || 0)}</td>`).join('')}
          <td>${r.us < 1 && r.priority ? `<span class="prio ${esc(r.priority)}">${esc(r.priority)}</span>` : ''}</td>
        </tr>`).join('') || `<tr><td colspan="${comps.length + 3}" class="muted">No gaps 🎉</td></tr>`}</tbody>
      </table></div>
      <div class="disclaimer">Competitor capabilities are approximate, based on public knowledge as of ${esc(a.analyzedAt || '—')}. Parity is the average coverage of the features above: yes = 1, partial = ½.</div>
    </section>

    <section class="block" id="sec-next">
      <h2>Next steps <span class="count">${(a.nextSteps || []).length}</span><span class="spacer"></span></h2>
      <ol class="steps">${(a.nextSteps || []).map((s) => `
        <li class="step"><span class="prio ${esc(s.priority)}">${esc(s.priority)}</span>
          <div><div class="title">${esc(s.title)}</div><div class="why">${esc(s.why)}</div></div>
          <span class="effort" title="Effort">${{ S: 'small', M: 'medium', L: 'large' }[s.effort] || esc(s.effort || '')}</span></li>`).join('')}
      </ol>
    </section>

    <section class="block" id="sec-risks">
      <h2>Risks and tech debt<span class="spacer"></span></h2>
      <ul class="risks">${(a.risks || []).map((r) => `<li>${icon('alert')}<span>${esc(r)}</span></li>`).join('')}</ul>
    </section>

    <section class="block" id="sec-activity">
      <h2>Activity<span class="spacer"></span></h2>
      <div class="cols">
        <div class="card">
          <h3>${icon('cloud')}GitHub · recent commits</h3>
          ${renderRemoteCommits(gh, ls)}
        </div>
        <div style="display:grid;gap:16px;align-content:start">
          <div class="card"><h3>${icon('branch')}Local working copy</h3>${renderLocal(local)}</div>
          <div class="card"><h3>Languages</h3>${renderLangs(gh)}</div>
          ${gh.ok && (gh.openIssues.length || gh.openPulls.length) ? `<div class="card"><h3>Open issues and PRs</h3>${
            [...gh.openPulls.map((i) => ({ ...i, pr: true })), ...gh.openIssues].map((i) => `<div class="issue"><span class="num">#${i.number}</span><a href="${esc(i.url)}" target="_blank" rel="noopener">${i.pr ? '[PR] ' : ''}${esc(i.title)}</a></div>`).join('')
          }</div>` : ''}
        </div>
      </div>
    </section>
  </div>`;
  $('#content').scrollTop = scrollTop;
}

function renderRemoteCommits(gh, ls) {
  if (!gh.ok) {
    const local = ls && ls.commits && ls.commits.length;
    return `<p class="muted">GitHub unavailable: ${esc(gh.error || 'unknown error')}.${local ? ' Showing local history instead.' : ''}</p>${
      local ? commitList(ls.commits.map((c) => ({ ...c, url: null })), new Set()) : ''}`;
  }
  if (gh.empty) return '<p class="muted">The repository is empty. Nothing has been pushed yet.</p>';
  const remote = new Set(gh.commits.map((c) => c.sha));
  const unpushed = ls && ls.ahead ? ls.commits.slice(0, ls.ahead).filter((c) => !remote.has(c.sha)) : [];
  return commitList([...unpushed.map((c) => ({ ...c, unpushed: true })), ...gh.commits]);
}
function commitList(commits) {
  if (!commits.length) return '<p class="muted">No commits.</p>';
  return `<ul class="commits">${commits.map((c) => `<li class="${c.unpushed ? 'unpushed' : ''}">
    ${c.url ? `<a class="sha" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.sha.slice(0, 7))}</a>` : `<span class="sha">${esc(c.sha.slice(0, 7))}</span>`}
    <span class="msg" title="${esc(c.message)}">${c.unpushed ? '<span class="warn">unpushed · </span>' : ''}${esc(c.message)}</span>
    <span class="when" title="${esc(c.date)}">${esc(ago(c.date))}</span></li>`).join('')}</ul>`;
}
function renderLocal(local) {
  if (!local.length) return '<p class="muted">No local clone found next to the control room. Clone it into a sibling folder, or set <code>localPath</code> in projects.json.</p>';
  return local.map((l) => `
    <dl class="kv">
      <dt>Path</dt><dd title="${esc(l.path)}">${esc(home(l.path))}</dd>
      <dt>Branch</dt><dd>${esc(l.branch || '—')}${l.upstream ? ` <span class="faint">→ ${esc(l.upstream)}</span>` : ' <span class="faint">(no upstream)</span>'}</dd>
      <dt>Sync</dt><dd>${l.ahead == null ? '<span class="faint">—</span>' : `${l.ahead ? `<span class="warn">↑${l.ahead} to push</span>` : '↑0'} ${l.behind ? `<span class="warn">↓${l.behind} to pull</span>` : '↓0'}`}</dd>
      <dt>Changes</dt><dd>${l.changes.length ? `<span class="warn">${l.changes.length} uncommitted</span>` : '<span class="ok">clean</span>'}</dd>
    </dl>
    ${l.changes.length ? `<ul class="files">${l.changes.slice(0, 200).map((c) => `<li><span class="code ${esc(c.code)}">${esc(c.code)}</span><span>${esc(c.file)}</span></li>`).join('')}</ul>` : ''}
    ${l.commits.length ? `<div class="faint" style="margin:10px 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:.04em">Recent on ${esc(l.branch)}</div>${commitList(l.commits.slice(0, 5).map((c, i) => ({ ...c, unpushed: l.ahead != null && i < l.ahead })))}` : ''}
  `).join('<hr style="border:0;border-top:1px solid var(--border);margin:10px 0">');
}
function renderLangs(gh) {
  if (!gh.ok) return '<p class="muted">—</p>';
  const entries = Object.entries(gh.languages || {});
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (!total) return '<p class="muted">No code detected yet.</p>';
  return `<div class="langbar">${entries.map(([l, v], i) => `<i style="width:${(v / total) * 100}%;background:${langColor(l, i)}" title="${esc(l)}"></i>`).join('')}</div>
    <ul class="langs">${entries.map(([l, v], i) => `<li><span class="sw" style="background:${langColor(l, i)}"></span>${esc(l)} <span class="pct">${((v / total) * 100).toFixed(1)}%</span></li>`).join('')}</ul>`;
}

// ---------- status bar ----------
function renderStatus() {
  const sb = $('#statusbar');
  const items = [`<span class="si remote">${icon('radar')}Control Room</span>`];
  if (state.route.view === 'project') {
    const p = state.details[state.route.id];
    const l = p && p.local && p.local[0];
    if (l) {
      items.push(`<span class="si">${icon('branch')}${esc(l.branch || '?')}${l.changes.length ? '*' : ''}</span>`);
      items.push(`<span class="si">${icon('sync')}${l.behind || 0}↓ ${l.ahead || 0}↑</span>`);
    }
    if (p && p.analysis) items.push(`<span class="si hide-sm">Analyzed ${esc(p.analysis.analyzedAt)}</span>`);
  }
  items.push('<span class="grow"></span>');
  const rl = state.rateLimit;
  if (rl) {
    items.push(`<span class="si hide-sm" title="GitHub API rate limit${rl.authenticated ? ' (authenticated)' : ' (unauthenticated: set GITHUB_TOKEN for 5000/h)'}">${icon('cloud')}GitHub ${rl.remaining}/${rl.limit}</span>`);
  }
  if (state.loadedAt) items.push(`<button class="si" id="sb-refresh" title="Refresh (R)">${icon('refresh')}Updated ${new Date(state.loadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</button>`);
  sb.innerHTML = items.join('');
  const btn = $('#sb-refresh');
  if (btn) btn.onclick = refresh;
}

// ---------- data loading ----------
async function loadList() {
  const data = await getJSON('/api/projects');
  state.list = data.projects;
  state.rateLimit = data.rateLimit;
  state.loadedAt = Date.now();
}
async function loadDetail(id) {
  const p = await getJSON(`/api/projects/${encodeURIComponent(id)}`);
  state.details[id] = p;
  state.rateLimit = p.rateLimit || state.rateLimit;
}

function render() {
  renderActivityBar();
  renderSidebar();
  renderTabs();
  if (state.route.view === 'overview') renderOverview();
  else renderProject();
  renderStatus();
  const p = state.list.find((x) => x.id === state.route.id);
  document.title = state.route.view === 'project' && p ? `${p.name} · Control Room` : 'Project Control Room';
}

async function route() {
  parseRoute();
  if (state.route.view === 'project' && state.route.id !== route.lastId) $('#content').scrollTop = 0;
  route.lastId = state.route.id;
  render();
  if (state.route.view === 'project' && !state.details[state.route.id]) {
    try { await loadDetail(state.route.id); } catch (e) {
      $('#content').innerHTML = `<div class="empty">Couldn't load project: ${esc(e.message)}</div>`;
      return;
    }
    render();
  }
}

let refreshing = false;
async function refresh() {
  if (refreshing) return;
  refreshing = true;
  const btn = $('#refresh-btn');
  if (btn) btn.classList.add('spin');
  try {
    await fetch('/api/refresh', { method: 'POST' });
    state.details = {};
    await loadList();
    if (state.route.view === 'project') await loadDetail(state.route.id);
  } catch (e) { console.error(e); }
  refreshing = false;
  render();
}

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if ((e.ctrlKey || e.metaKey) && /^[1-9]$/.test(e.key)) {
    const p = state.list[Number(e.key) - 1];
    if (p) { e.preventDefault(); location.hash = `#/p/${p.id}`; }
  } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    refresh();
  } else if (e.key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    location.hash = '#/';
  }
});

window.addEventListener('hashchange', route);
applySidebar();
(async () => {
  try { await loadList(); } catch (e) {
    $('#content').innerHTML = `<div class="empty">Couldn't reach the server: ${esc(e.message)}</div>`;
    return;
  }
  route();
  // Background refresh of the list every 5 minutes (server-side cache keeps GitHub calls low).
  setInterval(async () => {
    try {
      await loadList();
      if (state.route.view === 'project') await loadDetail(state.route.id);
      render();
    } catch { /* ignore */ }
  }, 5 * 60 * 1000);
})();

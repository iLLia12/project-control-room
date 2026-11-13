# Project Control Room

One screen for the state of all my projects: what's implemented, what's in progress, how each one compares with similar apps, and live repo activity.

```sh
npm start        # → http://localhost:5555
```

No dependencies. Runs on Node 16+.

## How it works

| Source | What it gives |
| --- | --- |
| `projects.json` | Projects to track: id, name, repo URL, icon, color, optional `localPath` |
| `analysis/<id>.json` | Curated assessment: summary, implemented features, in-progress work, a feature matrix against competitors (parity % is computed from it), next steps and risks |
| GitHub API | Recent commits, languages, open issues and PRs. Cached for 10 min with ETags |
| Local clones | Branch, uncommitted files, ahead/behind and recent commits. Found by matching `origin` remotes in sibling folders (`SCAN_DIRS` overrides the folders) |

A project page shows **Analysis may be stale** when the repo has commits newer than `analyzedAt`. To refresh an assessment, ask Claude Code to re-analyze that repo and update `analysis/<id>.json`.

Optional: set `GITHUB_TOKEN` (or sign in with `gh auth login`) to raise the API limit from 60 to 5000 requests an hour.

## UI

VS Code-style layout: the activity bar shows each project as an icon, with its name in a tooltip on hover. A badge counts uncommitted plus unpushed changes. Clicking the active icon toggles the sidebar.

Shortcuts: `Ctrl/⌘ + 1–9` switches projects, `g` opens the overview, `r` refreshes.

# Black Bird Ops Changelog

## 2026-06-26 — Add Claude Code operating layer

**Branch:** `claude/add-black-bird-ops-skills`
**Base commit:** `5bedcf9be16114ac0973905e74a5d266d2b2d04a`

### Created skills

| Path | Purpose |
|---|---|
| `.claude/skills/black-bird-preflight/SKILL.md` | Manual preflight: branch, HEAD, dirty tree, changed files, data validation, optional live check |
| `.claude/skills/black-bird-visual-audit/SKILL.md` | Exact-selector visual audit using Playwright and `window.__bbState` |
| `.claude/skills/black-bird-visual-audit/checklist.md` | Viewport specs, exact node IDs, solo selectors, state-check patterns, issue classification |
| `.claude/skills/black-bird-pr-review/SKILL.md` | Pre-merge PR review: forbidden files, scope drift, stale claims, CI status |
| `.claude/skills/black-bird-live-check/SKILL.md` | Post-merge Pages reachability and deployment status check |
| `.claude/skills/black-bird-task-plan/SKILL.md` | Implementation work order generator; no code produced |

### Created agents

| Path | Purpose |
|---|---|
| `.claude/agents/black-bird-repo-inspector.md` | Read-only source inspector |
| `.claude/agents/black-bird-visual-auditor.md` | Read-only Playwright auditor |
| `.claude/agents/black-bird-pr-reviewer.md` | Read-only PR reviewer |
| `.claude/agents/black-bird-test-log-summarizer.md` | Log summarizer (max 20 lines) |

### Created docs

- `.claude/README-black-bird-ops.md` — operating guide
- `.claude/BLACK_BIRD_OPS_CHANGELOG.md` — this file

### What did not change

- `index.html` — not touched
- `tests/**` — not touched
- `test-results/**` — not touched
- `package.json` / `package-lock.json` — not touched
- ontology / RNO / MNO prose — not touched
- `.github/workflows/**` — not touched
- screenshot baselines — not touched

### Validation

- `npm run test:data` → PASS (50 nodes)
- Full Playwright suite not run (no app code changed)
- No hooks enabled
- No plugins installed
- No agent teams enabled

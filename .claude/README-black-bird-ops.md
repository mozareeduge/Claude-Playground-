# Black Bird Claude Code Operations

Project-local skills and agents for The Black Bird (`index.html` — D3/SVG hypergraph research poem).

## Skills (slash commands)

| Skill | When to use |
|---|---|
| `/black-bird-preflight` | Before any work. Reports branch, HEAD, dirty tree, changed files, and data validation. |
| `/black-bird-task-plan <problem>` | Before writing any code. Produces a scoped work order. Does not implement. |
| `/black-bird-visual-audit` | Visual and interaction audit. Exact selectors, state assertions, screenshots to `/tmp`. |
| `/black-bird-pr-review` | Before merge. Checks forbidden files, scope drift, stale claims, CI status. |
| `/black-bird-live-check <sha>` | After merge. Checks Pages deployment and HTTP status. Not a browser test. |

## Subagents

Use subagents for noisy exploration or isolated inspection — not for autonomous implementation.

| Agent | Purpose |
|---|---|
| `black-bird-repo-inspector` | Locate functions, selectors, state transitions, data definitions in source. Read-only. |
| `black-bird-visual-auditor` | Run exact-selector Playwright audit flows. Read-only, screenshots to `/tmp` only. |
| `black-bird-pr-reviewer` | Independent PR review. Returns merge-ready yes/no. Read-only. |
| `black-bird-test-log-summarizer` | Summarize long test/Playwright logs into failures and next action. Max 20 lines. |

## Session hygiene

- Use `/clear` between unrelated tasks.
- Use `/compact` before long sessions. When compacting, preserve: decisions made, changed files, failing test names, exact selectors used.
- Do not use agent teams unless a future task is large, separable, and explicitly approved.
- Do not install third-party plugins for this project without explicit approval.
- Do not enable automatic hooks until there is a specific, tested need.

## Hooks (future)

Hooks are not enabled. They may later be used only for log summarization or scope warnings, but they must be added in a separate reviewed PR.

## Quick reference

```
Before work:   /black-bird-preflight
Before code:   /black-bird-task-plan <problem>
Visual check:  /black-bird-visual-audit
Before merge:  /black-bird-pr-review
After merge:   /black-bird-live-check <sha>
```

## Constraints that never change

- `index.html` is the single-file artwork. Do not split it.
- Object ontology (`RNO`, `MNO`, `FO`, `NameO`, `RefO`, `RelO`) does not change without explicit approval.
- RNO/MNO prose does not change without explicit approval.
- `package.json` / `package-lock.json` do not change without explicit approval.
- One small PR per concern. Do not bundle unrelated fixes.

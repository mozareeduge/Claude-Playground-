---
name: black-bird-visual-audit
description: Exact-selector visual audit for Black Bird mobile/desktop flows. Uses Playwright, window.__bbState assertions, and data-solo selectors. Never edits app files. Screenshots go to /tmp only.
disable-model-invocation: true
context: fork
agent: black-bird-visual-auditor
allowed-tools: Bash, Read, Grep, Glob
effort: medium
---

# Black Bird Visual Audit

Full procedure is in `checklist.md` alongside this file.

## Setup

1. Run preflight first:
   ```bash
   npm run test:data
   git log --oneline -1
   ```

2. Determine source:
   - Try `https://mozareeduge.github.io/Claude-Playground-/?v=<sha>`
   - If unreachable (`net::ERR_*` or non-200), serve local:
     ```bash
     npx serve . -p 8787 --no-clipboard &
     sleep 2
     curl -s -o /dev/null -w "%{http_code}" http://localhost:8787/
     ```
   - State clearly which source was used.

3. Set screenshot output dir:
   ```bash
   SHA=$(git rev-parse --short HEAD)
   OUT="/tmp/black-bird-audit-${SHA}"
   mkdir -p "$OUT"
   ```
   **Do not write screenshots into the repo.**

## Script skeleton

Write an inline Node.js script using Playwright. Use `executablePath: '/opt/pw-browsers/chromium'`. Load `checklist.md` for exact IDs, selectors, and state-check patterns.

Key rules:
- Node tap: target `g.node` where `g.__data__.id === 'FO.ALLAH'` etc. — not label text.
- Solo: `document.querySelector('[data-solo="FO.CORPSE"]').click()` — not fuzzy row matching.
- Before each screenshot: read `window.__bbState` and log `surface`, `phase`, `activeId`, `soloSet`.
- Onboarding gate: poll until `phase==='focused' && activeId==='FO.BLACK_BIRD_FIELD'` before field shots.
- Keep mobile and desktop in separate browser contexts.

## Report format

After all screenshots, produce a report:

```
VISUAL AUDIT REPORT
===================
source:         local main <sha> / live Pages <sha>
live URL:       reachable / unreachable (<reason>)
data validation: PASS / FAIL
viewports:      390×844, 375×667, 1440×900

RESULTS
-------
mobile-entry:           <no issue / visual concern / reliable blocker>
mobile-nav:             <.map-tools hidden=yes/no> <bottom-nav visible=yes/no>
allah-field:            surface=<s> activeId=<id> panel=<vis> → <classification>
allah-read:             surface=<s> activeId=<id> → <classification>
corpse-field:           ...
corpse-read:            ...
solo-corpse:            surface=<s> activeId=<id> soloSet includes FO.CORPSE=<y/n> → <classification>
solo-corpse-read:       ...
solo-allah:             ...
solo-odin:              ...
solo-god:               ...
mno-black-ring-read:    ...
mno-window-read:        ...
short-phone-field:      ...
short-phone-read:       ...
desktop-entry:          ...
desktop-field:          panel=<vis> mapWrap=<vis> → <classification>
desktop-mno-black-ring: ...
desktop-mno-window:     ...

RELIABLE BLOCKERS:   <list or "none">
VISUAL CONCERNS:     <list>
AUDIT LIMITATIONS:   <list>
SCREENSHOTS:         <OUT dir>
```

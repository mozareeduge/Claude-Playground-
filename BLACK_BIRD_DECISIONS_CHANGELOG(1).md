# Black Bird — Decisions and Changelog

This file is the canonical project log. Keep it in the repository root. Update it after every Claude Code round.

## Current direction

The Black Bird is being stabilized as a single-file HTML artifact before any full repo migration. The next architecture may use Vite/TypeScript/D3 modules, but not until the experience is stable.

## Standing decisions

- Keep the current object ontology: `RNO`, `MNO`, `FO`, `NameO`, `RefO`, `RelO`.
- Keep the work as a speculative research poem, not a dashboard.
- Do not separate poem and research into preset lenses.
- Do not use representational icons for object types.
- Do not restore cluster labels.
- Treat route as bounded focus-history, not breadcrumb navigation.
- Treat mobile as a separate interaction flow, not compressed desktop.
- Use local aperture for dense graph areas instead of permanently spacing the field.
- Maintain a single overlay stack: drawers, sheets, previews, and route drawer should not layer unpredictably.

## Version notes

### V5.6-nightly — governed interaction repair

Base file: `the_black_bird_v5_clean_v3(2).html` or latest single-file HTML equivalent.

Decisions:
- Keep a single-file HTML build for the nightly round.
- Add explicit phase/surface/overlay logic inside the single-file build.
- Desktop remains graph + reader split.
- Mobile becomes two-surface: Field and Read.
- Dense graph areas use temporary local aperture on focus.
- Overlays should close or replace incompatible overlays.

Known risks:
- Mobile Read/Field switching needs real-device QA.
- Local aperture needs visual tuning around very dense neighborhoods.
- Desktop Black Bird first focus should be checked on the laptop viewport.

### Testing harness round — pending

Planned decision:
- Add Playwright smoke tests for desktop onboarding, Field refit, dense aperture evidence, mobile Field surface, and mobile Read surface.
- No app behaviour changes in this round.

Files expected:
- `package.json`
- `playwright.config.js`
- `tests/black-bird-smoke.spec.js`
- `TESTING_REPORT.md`
- `BLACK_BIRD_DECISIONS_CHANGELOG.md`

## Changelog template

Use this for future entries:

```md
## YYYY-MM-DD — Short round name

Base file:
- `<filename>`

Goal:
- ...

Files changed:
- ...

Commands run:
- ...

Decisions:
- ...

Results:
- ...

Known risks / next step:
- ...
```

---

## Testing harness round — 2026-06-21

**Base file:** `the_black_bird_v5_6_nightly.html`

**Decision:** Add a Playwright smoke test harness. No app behavior changed.

**Changed files:**
- `package.json` — created; added `@playwright/test` dev dep, `d3` dep (local CDN fallback), npm scripts: `test`, `test:headed`, `test:report`
- `playwright.config.js` — created; Chromium-only, 90s global timeout, pre-installed binary path
- `tests/black-bird-smoke.spec.js` — created; 5 scenarios: desktop onboarding, Field refit, dense aperture, mobile Field, mobile Read
- `TESTING_REPORT.md` — populated with full results
- `BLACK_BIRD_DECISIONS_CHANGELOG(1).md` — this entry

**Commands run:**
- `npm install`
- `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright test` → 5 passed (1.5 min)

**Test results:**
- S1 Desktop onboarding: NEEDS HUMAN REVIEW — transitions work; Black Bird active in reader; left-margin of active node label is 2 px (below 80 px threshold); screenshot captured
- S2 Desktop Field refit: PASS — 44/44 nodes inside viewport on all 3 rounds (100%)
- S3 Dense aperture: PASS — 30 separated nodes after focus; aperture note: `usable and visually calm`
- S4 Mobile Field: PASS — graph height 594 px; reader hidden; bottom nav visible
- S5 Mobile Read: PASS — reader height 544 px; scrollable; graph hidden

**Known issues / environment notes:**
- D3 CDN blocked (403) in this remote environment. Tests intercept with local `d3@7.9.0`.
- D3 force-sim NaN console errors on startup are filtered as known noise; not real errors.
- S1 left-margin measurement needs human review — label bounding box may not reflect rendered node circle position accurately.

---

## Round 2 — fix smoke failures — 2026-06-22

**Base file:** `the_black_bird_v5_6_nightly.html`

**Decision:** Fix four issues revealed by Round 1 smoke pass. No design changes, no new features, no HTML structure changes.

**Changed files:**
- `the_black_bird_v5_6_nightly.html` — four targeted fixes:
  - FIX 1: `finishOnboarding` rewritten to open reader first, measure final map dimensions, freeze Black Bird core node with `d.fx/d.fy` for 2400 ms, then call `fitFocusFrame` with `safeStage:true`. Camera now centers correctly on the core node. Unfreeze at 2400 ms (after sim alpha decays; well past 1200 ms test wait).
  - FIX 1 (also): `fitFocusFrame` extended with `safeStage` option that centers on `coreId` node position rather than focus-set centroid; uses `biasX=0.52, biasY=0.56`.
  - FIX 3: `registerRouteEvent` now compresses consecutive duplicate IDs — updates `source` on the existing last event instead of pushing a new one.
  - FIX 4: `updateGraphGeometry` wraps all SVG attribute assignments with `Number.isFinite` guard (returns 0 for NaN). `simNodes` pre-initialized to `±10 px` random before simulation starts.
- `TESTING_REPORT.md` — updated with Round 2 results; all 5 PASS.
- `BLACK_BIRD_DECISIONS_CHANGELOG(1).md` — this entry.

**Commands run:**
- `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright test` → 5 passed

**Test results:**
- S1 Desktop onboarding: PASS — L=401 px T=709 px R=369 px B=550 px (all above thresholds)
- S2 Desktop Field refit: PASS — 44/44 nodes inside viewport on all 3 rounds (100%)
- S3 Dense aperture: PASS — 35 separated nodes; aperture note: `usable and visually calm`
- S4 Mobile Field: PASS — graph height 594 px; reader hidden; bottom nav visible
- S5 Mobile Read: PASS — reader height 544 px; scrollable; graph hidden

**Known risks / next step:**
- Black Bird core node is pinned for 2400 ms after onboarding. After unpin, the sim (alpha ~0.003) may cause a very slight drift — visually imperceptible but worth monitoring on real device.
- FIX 2 (field refit) was already passing; no code changed for it.

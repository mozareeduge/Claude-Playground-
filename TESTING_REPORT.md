# Testing Report — Black Bird

## 2026-06-25 — Verification tightening (Phase 1 follow-up)

- `npm run test:data` → **PASS** — 50 nodes, 0 errors. Data ontology unchanged.
- `npm test` (Playwright) → **14/14 PASS** (3.9m)

| Test | Status | Notes |
|---|---|---|
| 1. Desktop onboarding to Black Bird | PASS | |
| 2. Desktop Field refit from multiple focuses | PASS | |
| 3. Desktop dense area aperture evidence | PASS | |
| 4. Mobile Field surface | PASS | |
| 5. Mobile Read surface | PASS | |
| 6. Mobile onboarding ends in Field overview | PASS | Real onboarding; reducedMotion; focus ring asserted |
| 7. Mobile node tap opens full Read | PASS | |
| 8. Mobile Read fallback opens Black Bird when no object is active | PASS | activeId cleared; FO.BLACK_BIRD_FIELD asserted in .meta |
| 9. Mobile inline link navigates within Read | PASS | |
| 10. Mobile related object navigates within Read | PASS | |
| 11. Mobile Field returns to graph with focus and identity preserved | PASS | tappedId verified; focus ring; safe zone; route; re-open |
| 12. No console NaN errors on mobile | PASS | |
| 13. No SVG line attributes receive NaN | PASS | |
| 14. No phantom edges drawn to origin (0,0) | PASS | New: validates last-finite geometry guard |

Screenshots: `test-results/black-bird-smoke/` — all 14 screenshots updated.

Changes this round: `safeCoord()` removed; `updateGraphGeometry()` and `drawRouteMemory()` use `.each()` last-finite pattern. `test-results/.last-run.json` removed from git and gitignored.

---

## 2026-06-25 — Mobile Two-Chamber Phase 1

- `npm run test:data` → **PASS** — 50 nodes, 0 errors. Data ontology unchanged.
- `npm test` (Playwright) → **13/13 PASS**

| Test | Status |
|---|---|
| 1. Desktop onboarding to Black Bird | PASS |
| 2. Desktop Field refit from multiple focuses | PASS |
| 3. Desktop dense area aperture evidence | PASS |
| 4. Mobile Field surface | PASS |
| 5. Mobile Read surface | PASS |
| 6. Mobile onboarding ends in Field overview | PASS |
| 7. Mobile node tap opens full Read | PASS |
| 8. Mobile Read button opens Black Bird when entering from Field | PASS |
| 9. Mobile inline link navigates within Read | PASS |
| 10. Mobile related object navigates within Read | PASS |
| 11. Mobile Field button returns to graph centered on object | PASS |
| 12. No console NaN errors on mobile | PASS |
| 13. No SVG line attributes receive NaN | PASS |

Screenshots: `test-results/black-bird-smoke/` — mobile-field-overview, mobile-node-tap-read, mobile-read-black-bird, mobile-return-field-focused, desktop-smoke confirmed.

---

## Round: Add FO.GOD field object (2026-06-24)

- `npm run test:data` → **PASS** — 50 nodes, 0 errors. FO.GOD present; RelO.R9C3F1A62 and RelO.RB6E74D1A present and contain FO.GOD; all existing checks preserved.
- `npm test` (Playwright browser smoke) → **BLOCKED locally** — Chromium not installable in container. Deferred to GitHub Actions `playwright-smoke.yml`.

---

## Round: ID Singularity + Approved RNO Copy (2026-06-24)

- `npm run test:data` → **PASS** — 47 nodes, 0 errors. All ordered IDs migrated; FO.ALLAH and both new RefO objects present and connected; RelO labels opaque; RelO shortLabels rel·XXXX.
- `npm test` (Playwright browser smoke) → **BLOCKED locally** — Chromium binary not installable in remote container. Deferred to GitHub Actions `playwright-smoke.yml` workflow on the PR branch.

---

# Testing Report — Black Bird Final Visual QA

## Environment

- Date/time: 2026-06-22
- Browser: Chromium v1194 via Playwright v1.45.0
- Desktop viewport: 1440 × 900
- Mobile viewport: 400 × 650
- Main HTML file: `index.html`
- D3: vendored locally at `vendor/d3.v7.9.0.min.js` — no CDN interception needed
- Commands run: `npm test`

## Summary

| Scenario | Status | Evidence |
|---|---|---|
| Desktop onboarding to Black Bird | PASS | `qa/final-visual-qa/desktop-01-after-onboarding.png` |
| Desktop Field refit | PASS | 3 field-refit screenshots; ≥85% nodes visible after each refit |
| Dense area aperture | PASS | `qa/final-visual-qa/desktop-03-dense-aperture.png` |
| Mobile Field surface | PASS (fixed) | `qa/final-visual-qa/mobile-04-field-surface.png` — graph-only surface confirmed |
| Mobile Read surface | PASS | `qa/final-visual-qa/mobile-05-read-surface.png` |

All 5 smoke scenarios passed (24.6s total).

## CDN guard

No request reached `cdnjs.cloudflare.com/ajax/libs/d3`.

## Scenario Details

### 1. Desktop onboarding to Black Bird

Status: PASS

Observations: Enter button clicked; after 2s wait, `.node-core` elements visible in DOM, no page errors detected. Graph centered in field with onboarding prompt visible.

### 2. Desktop Field refit from multiple focuses

Status: PASS

Measurements: ≥85% of `.node-core` elements inside viewport after each Field action across 3 focus cycles. Graph visible in split view (map-wrap left, reader pane right).

### 3. Desktop dense area / local aperture

Status: PASS

Observations: Screenshot captured before and after focus. Human review recommended for visual quality of aperture breathing.

### 4. Mobile Field surface

Status: PASS (fixed)

Root cause of prior failure: `#fieldBtn` (inside `.map-wrap`) is hidden when `surface-read` is active — `isVisible()` returned false so click was skipped. Fixed by using `[data-mobile="field"]` (bottom-nav Field button) which is always visible.

Observations: `#mapWrap` has height > 400px; graph-only surface confirmed. Panel (`#reader`) is hidden in `surface-field` mode per CSS rules. Bottom nav with Field/Read/View/Index visible.

### 5. Mobile Read surface

Status: PASS

Observations: Reader pane occupies full surface height (>300px), body text readable, references and object chips visible, bottom nav present.

## Console / Page Errors

None detected during test run.

## Screenshots

Stable final QA screenshots saved to: `qa/final-visual-qa/`

| File | Content |
|---|---|
| `desktop-00-threshold.png` | Threshold entry card |
| `desktop-01-after-onboarding.png` | Graph-only onboarding field |
| `desktop-02-field-refit-1.png` | Desktop split view after refit 1 |
| `desktop-02-field-refit-2.png` | Desktop split view after refit 2 |
| `desktop-02-field-refit-3.png` | Desktop split view after refit 3 |
| `desktop-03-dense-before.png` | Graph before focus |
| `desktop-03-dense-aperture.png` | Graph after focus (aperture active) |
| `mobile-04-field-surface.png` | Mobile graph-only field surface |
| `mobile-05-read-surface.png` | Mobile reader surface |

## Desktop Composition Polish Round (2026-06-22)

Root cause: `returnToField()` restarted the D3 force simulation via `measureGraph()`, causing node drift during the 850ms camera animation. Cluster forces (lyric, irish) pull nodes toward the lower portion of the viewport, resulting in lower-left bias.

Fix: Replaced `measureGraph()` call in desktop path of `returnToField()` with inline dimension measurement that does not restart the simulation.

Composition measurements after fix (1440×900, `qa/desktop-composition-polish/`):

| Refit | dx (horiz, ±12% limit) | dy (vert, ±14% limit) | Status |
|---|---|---|---|
| 1 | +7.1% | +7.4% | PASS |
| 2 | -7.6% | +12.2% | PASS |
| 3 | +3.5% | +0.4% | PASS |

All 5 smoke tests: PASS (5/5).

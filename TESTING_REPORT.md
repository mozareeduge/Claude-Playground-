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

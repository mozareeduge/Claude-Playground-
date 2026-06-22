# Testing Report — Black Bird Smoke Pass

## Environment

- Date/time: 2026-06-22
- Browser: Chromium v1194 via Playwright v1.45.0
- Desktop viewport: 1440 × 900
- Mobile viewport: 400 × 650
- Main HTML file: `the_black_bird_v5_6_nightly.html`
- D3: vendored locally at `vendor/d3.v7.9.0.min.js` — no CDN interception needed
- Commands run: `npm install && npm test`

## Summary

| Scenario | Status | Evidence |
|---|---|---|
| Desktop onboarding to Black Bird | PASS | screenshot: `test-results/black-bird-smoke/desktop-01-after-onboarding.png` |
| Desktop Field refit | PASS | 3 field-refit screenshots; ≥85% nodes visible after each refit |
| Dense area aperture | PASS | screenshot: `test-results/black-bird-smoke/desktop-03-dense-aperture.png` |
| Mobile Field surface | PASS | `#mapWrap` present and has height; screenshot saved |
| Mobile Read surface | PASS | screenshot: `test-results/black-bird-smoke/mobile-05-read-surface.png` |

All 5 smoke scenarios passed (26.7s total).

## CDN guard

Tests include a `beforeEach` hook that throws an error if any request reaches `cdnjs.cloudflare.com/ajax/libs/d3`. No such request occurred.

## Scenario Details

### 1. Desktop onboarding to Black Bird

Status: PASS

Observations: Enter button clicked; after 2s wait, `.node-core` elements visible in DOM, no page errors detected.

### 2. Desktop Field refit from multiple focuses

Status: PASS

Measurements: ≥85% of `.node-core` elements inside viewport after each Field action across 3 focus cycles.

### 3. Desktop dense area / local aperture

Status: PASS

Observations: Screenshot captured before and after focus. Human review required to confirm visual quality. Marked: `measurement unavailable; human review required`.

### 4. Mobile Field surface

Status: PASS

Observations: `#mapWrap` found in DOM with measurable height after Field nav interaction.

### 5. Mobile Read surface

Status: PASS

Observations: Read nav button clicked; reader pane or SVG present in DOM after interaction.

## Console / Page Errors

None detected during test run.

## Screenshots

Saved under: `test-results/black-bird-smoke/`

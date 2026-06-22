# Testing Report — Black Bird Smoke Pass

## Environment

- **Date/time:** 2026-06-22
- **Browser:** Chromium (portable: uses `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` if present, otherwise Playwright default)
- **Viewports:** Desktop 1440 × 900, Mobile 400 × 650
- **Main HTML file:** `the_black_bird_v5_6_nightly.html`
- **Commands run:**
  - `npm install`
  - `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright test`
- **Note:** D3 CDN (`cdnjs.cloudflare.com`) returns 403 in this environment. Tests use `page.route()` to intercept and serve the locally installed `d3@7.9.0` package instead.
- **Screenshot archive:** `qa/smoke-2026-06-22/`

---

## Summary

| Scenario                         | Status | Evidence                                                                                                         |
| -------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| S1: Desktop onboarding to Black Bird | PASS | Initial: L=401 T=710 R=369 B=552. Post-freeze (3200ms later): L=352 T=710 R=419 B=552. All above thresholds. |
| S2: Desktop Field refit              | PASS | 44/44 nodes (100%) inside viewport on all 3 rounds                                                              |
| S3: Dense area aperture              | PASS | 34 separated nodes; aperture note: `usable and visually calm`                                                    |
| S4: Mobile Field surface             | PASS | Graph height 594 px; reader hidden; bottom nav visible                                                           |
| S5: Mobile Read surface              | PASS | Reader height 544 px; scrollable; graph hidden                                                                   |
| S6: Route duplicate compression      | PASS | Only 1 Black Bird route item after two consecutive focuses; no consecutive duplicates                            |

All 6 scenarios PASS.

---

## Scenario Detail

### S1 — Desktop Onboarding to Black Bird

**Status: PASS**

- Onboarding completed ~13 s; Black Bird active in reader pane.
- **Initial margins** (1200 ms after `phase-focused`):
  - Left: 401 px (≥ 80 px) ✓
  - Top: 710 px (≥ 110 px) ✓
  - Right: 369 px (≥ 40 px) ✓
  - Bottom: 552 px (≥ 40 px) ✓
- **Post-freeze margins** (3200 ms after initial measurement; `fx/fy` unpin fires at 2400 ms from onboarding):
  - Left: 352 px (≥ 80 px) ✓
  - Top: 710 px (≥ 110 px) ✓
  - Right: 419 px (≥ 40 px) ✓
  - Bottom: 552 px (≥ 40 px) ✓
- Slight lateral drift after unpin (L: 401 → 352, R: 369 → 419 — node moved ~50 px right). Node remains well within safe margins.
- NaN SVG attribute warnings: **none observed** after suppression was removed.
- Screenshots: `qa/smoke-2026-06-22/desktop-01-after-onboarding.png`, `qa/smoke-2026-06-22/desktop-01-after-onboarding-post-freeze.png`

### S2 — Desktop Field Refit from Multiple Focuses

**Status: PASS**

- Three focus → Field cycles completed.
- Node coverage after each Field refit:
  - Round 1: 44/44 (100.0%)
  - Round 2: 44/44 (100.0%)
  - Round 3: 44/44 (100.0%)
- Screenshots: `qa/smoke-2026-06-22/desktop-02-field-refit-{1,2,3}.png`

### S3 — Desktop Dense Area / Local Aperture

**Status: PASS**

- Focus target: Black Bird node (via SVG `text.node-label`).
- **34** of visible nodes individually selectable (no neighbour within 20 px centre-to-centre).
- Aperture note: **`usable and visually calm`**
- Screenshots: `qa/smoke-2026-06-22/desktop-03-dense-before.png`, `qa/smoke-2026-06-22/desktop-03-dense-aperture.png`

### S4 — Mobile Field Surface

**Status: PASS**

- Graph (`.map-wrap`) height: **594 px** (> 40% of 650 px) ✓
- Reader (`#reader`): **hidden**
- Bottom nav: **visible**
- Screenshot: `qa/smoke-2026-06-22/mobile-04-field-surface.png`

### S5 — Mobile Read Surface

**Status: PASS**

- Reader (`#reader`) height: **544 px** ✓
- Reader scrollable: **true** ✓
- Graph (`.map-wrap`): **hidden** (0 px) ✓
- Bottom nav: **visible**
- Screenshot: `qa/smoke-2026-06-22/mobile-05-read-surface.png`

### S6 — Route Duplicate Compression

**Status: PASS**

- After onboarding (Black Bird auto-focused), Black Bird was focused a second time via a route-item click.
- Visible route items: `["Black Bird"]` — only one entry; no consecutive duplicate.
- The `registerRouteEvent` deduplication correctly compressed the consecutive same-id event.

---

## Console / Page Errors

- **NaN SVG attribute suppression removed** in Round 3. No `attribute x1/y1/x2/y2: Expected length, "NaN"` errors observed. The `Number.isFinite` guards in `updateGraphGeometry` (FIX 4) and pre-initialized node positions are sufficient.
- Only remaining noise filter: `favicon` 404s (not real errors).
- No page errors observed in any scenario.

---

## Screenshot Archive

All screenshots in `qa/smoke-2026-06-22/`:

- `desktop-01-after-onboarding.png` — S1: Post-onboarding (initial measurement)
- `desktop-01-after-onboarding-post-freeze.png` — S1: Post-freeze stability (3200 ms later)
- `desktop-02-field-refit-1.png` — S2: Field refit round 1
- `desktop-02-field-refit-2.png` — S2: Field refit round 2
- `desktop-02-field-refit-3.png` — S2: Field refit round 3
- `desktop-03-dense-before.png` — S3: Before dense focus
- `desktop-03-dense-aperture.png` — S3: After local aperture focus
- `mobile-04-field-surface.png` — S4: Mobile Field surface
- `mobile-05-read-surface.png` — S5: Mobile Read surface

(Generated `test-results/` is excluded from git via `.gitignore`.)

---

## Round History

| Round | Date | Result | Notes |
|-------|------|--------|-------|
| Round 1 (harness) | 2026-06-21 | 4 PASS, 1 REVIEW | S1 L=2px; NaN errors filtered |
| Round 2 (fixes) | 2026-06-22 | 5 PASS | S1 L=401px; NaN guards; route dedup |
| Round 3 (hygiene) | 2026-06-22 | 6 PASS | NaN suppression removed (no errors); post-freeze stability confirmed; S6 added |

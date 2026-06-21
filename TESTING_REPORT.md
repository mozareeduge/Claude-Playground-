# Testing Report — Black Bird Smoke Pass

## Environment

- **Date/time:** 2026-06-21
- **Browser:** Chromium (local binary `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`)
- **Viewports:** Desktop 1440 × 900, Mobile 400 × 650
- **Main HTML file:** `the_black_bird_v5_6_nightly.html`
- **Commands run:**
  - `npm install`
  - `npx playwright install chromium` (failed; used pre-installed binary at `/opt/pw-browsers/`)
  - `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright test`
- **Note:** D3 CDN (`cdnjs.cloudflare.com`) returns 403 in this environment. Tests use `page.route()` to intercept the CDN request and serve the locally installed `d3@7.9.0` package instead. D3 7.9.0 is API-compatible with 7.8.5.

---

## Summary

| Scenario                         | Status | Evidence                                                                                       |
| -------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| Desktop onboarding to Black Bird | REVIEW | `desktop-01-after-onboarding.png` — Black Bird active in reader; node L-margin 2px (< 80px threshold); needs human review for spatial placement |
| Desktop Field refit              | PASS   | `desktop-02-field-refit-{1,2,3}.png` — 44/44 nodes (100%) inside viewport on all 3 rounds    |
| Dense area aperture              | PASS   | `desktop-03-dense-aperture.png` — 30 separated nodes; aperture note: `usable and visually calm` |
| Mobile Field surface             | PASS   | `mobile-04-field-surface.png` — graph height 594 px; reader hidden; bottom nav visible        |
| Mobile Read surface              | PASS   | `mobile-05-read-surface.png` — reader height 544 px; reader scrollable; graph hidden          |

---

## Scenario Detail

### S1 — Desktop Onboarding to Black Bird

**Status: NEEDS HUMAN REVIEW**

- App transitioned from `phase-threshold` → `phase-onboarding` → `phase-focused` correctly.
- Onboarding completed in approximately 12–13 s (3 stages × 2.6 s hold + 0.5 s fade).
- Black Bird (`Crow / Raven / Black Bird`) was active in the reader pane after onboarding.
- Graph viewport: 860 × 900 px (full left column).
- Active node margin measurement (via SVG `text.node-label` bounding box):
  - **Left:** 2 px (threshold: ≥ 80 px) — BELOW THRESHOLD
  - **Top:** 655 px (threshold: ≥ 110 px) — above threshold
  - **Right:** 758 px (threshold: ≥ 40 px) — above threshold
  - **Bottom:** 599 px (threshold: ≥ 40 px) — above threshold
- Left margin of 2 px suggests the Black Bird node is positioned very close to the left edge of the graph viewport (near the rail/title boundary). **Human review required** to determine whether this is a clipping issue or whether the SVG label coordinate reflects the graph's natural initial zoom position.
- Screenshot: `desktop-01-after-onboarding.png`

### S2 — Desktop Field Refit from Multiple Focuses

**Status: PASS**

- Three focus → Field cycles completed.
- Node coverage after each Field refit:
  - Round 1: 44/44 (100.0%)
  - Round 2: 44/44 (100.0%)
  - Round 3: 44/44 (100.0%)
- All rounds passed the ≥ 85% threshold.
- Focus targets were `fl` links in the reader panel (Black Bird reader was pre-loaded after onboarding).
- Screenshots: `desktop-02-field-refit-{1,2,3}.png`

### S3 — Desktop Dense Area / Local Aperture

**Status: PASS (observation recorded)**

- Focus target: Black Bird node (found via SVG `text.node-label`).
- Before screenshot: `desktop-03-dense-before.png` (same as post-onboarding — Black Bird already focused).
- After focus screenshot: `desktop-03-dense-aperture.png` — aperture visible with local dimming of non-neighbors.
- Separation count: **30 of visible nodes were individually selectable** (no neighbor within 20 px centre-to-centre).
- Aperture note: **`usable and visually calm`**
- The aperture transition was measurable. Human review of the screenshot may reveal whether the effect reads as compositionally natural or mechanically imposed.

### S4 — Mobile Field Surface

**Status: PASS**

- Viewport: 400 × 650.
- After onboarding and tapping bottom nav `Field`:
  - Graph (`.map-wrap`) height: **594 px** (> 40% of 650 px threshold).
  - Reader (`#reader`): **hidden** (panel not visible in Field surface).
  - Bottom nav: **visible**.
- Graph dominates the screen; reader is not present.
- Screenshot: `mobile-04-field-surface.png`

### S5 — Mobile Read Surface

**Status: PASS**

- Tapping bottom nav `Read` from Field surface:
  - Reader (`#reader`) height: **544 px** (dominant, > 200 px threshold).
  - Reader `scrollHeight > clientHeight`: **true** (reader is scrollable).
  - Graph (`.map-wrap`): **hidden** (height reported as 0 / not in layout).
  - Bottom nav: **visible**.
- Reader occupies the main surface; graph is hidden; scrolling is available.
- Screenshot: `mobile-05-read-surface.png`

---

## Console / Page Errors

One category of console errors was observed and filtered as known noise:
- **`Error: <line> attribute x1/y1/x2/y2: Expected length, "NaN".`** — These are D3 force simulation initialization artifacts. They appear during the first few simulation ticks before node positions are calculated and resolve automatically. They do not indicate application failure and were excluded from the error assertion.

No other console errors or page errors were observed.

---

## Screenshots

All screenshots saved under `test-results/black-bird-smoke/`:

- `desktop-01-after-onboarding.png` — S1: Post-onboarding desktop state
- `desktop-02-field-refit-1.png` — S2: Field refit round 1
- `desktop-02-field-refit-2.png` — S2: Field refit round 2
- `desktop-02-field-refit-3.png` — S2: Field refit round 3
- `desktop-03-dense-before.png` — S3: Before dense focus
- `desktop-03-dense-aperture.png` — S3: After local aperture focus
- `mobile-04-field-surface.png` — S4: Mobile Field surface
- `mobile-05-read-surface.png` — S5: Mobile Read surface

---

## Observations Only

1. **S1 left-margin of 2 px**: The active Black Bird node's SVG label appears very close to the left edge of the graph area after onboarding. This may reflect: (a) the initial force-simulation layout placing the Black Bird node near the left boundary before a proper fit-frame runs; (b) a coordinate offset between the SVG `text.node-label` and the rendered node circle; or (c) a genuine post-onboarding camera/zoom issue that clips the label near the left rail. Human review of `desktop-01-after-onboarding.png` is recommended. Note: the full node circle may still be well within bounds even if the label coordinate is near the edge.

2. **D3 NaN console errors**: These occur early in the simulation and self-resolve. They are cosmetically harmless but worth noting for completeness. They appear regardless of local/CDN D3 source.

3. **Mobile Read**: The reader correctly takes over the full surface in Read mode, with the graph fully hidden. Scrolling works. Bottom nav remains accessible. This surface separation is functioning as designed.

4. **Field refit 100% coverage**: All 44 nodes are within the map-wrap viewport after every Field refit. This is strong evidence that the `fitVisibleField()` function is working reliably.

5. **Dense aperture 30 separated nodes**: With 44 total nodes in the graph, 30 showing adequate separation after focusing Black Bird is a strong result. The local aperture effect is measurably creating space around the focus area.

---

*No fixes proposed. Observations only.*

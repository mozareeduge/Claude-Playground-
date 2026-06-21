# Testing Report — Black Bird Smoke Pass

## Environment

- Date/time: _to be filled by Claude Code_
- Browser: Chromium via Playwright
- Desktop viewport: 1440 × 900
- Mobile viewport: 400 × 650
- Main HTML file: _to be detected by Claude Code_
- Commands run: _to be filled by Claude Code_

## Summary

| Scenario | Status | Evidence |
|---|---|---|
| Desktop onboarding to Black Bird | NOT RUN | screenshot path + short note |
| Desktop Field refit | NOT RUN | screenshot paths + node visibility numbers |
| Dense area aperture | NOT RUN | screenshot path + human-review note |
| Mobile Field surface | NOT RUN | screenshot path + measured heights |
| Mobile Read surface | NOT RUN | screenshot path + measured heights |

## Scenario Details

### 1. Desktop onboarding to Black Bird

Purpose: verify that after onboarding finishes, Black Bird is active, readable in route or reader, and not cropped or pushed into the rail/title/control/reader boundary area.

Acceptance evidence:
- Route or reader contains `Black Bird` or `Crow / Raven / Black Bird`.
- Screenshot: `test-results/black-bird-smoke/desktop-01-after-onboarding.png`.
- If measurable, active Black Bird focus is inside graph viewport with safe margins:
  - left >= 80 px from graph viewport left,
  - top >= 110 px from graph viewport top,
  - right >= 40 px from graph viewport right,
  - bottom >= 40 px from graph viewport bottom.

Status: NOT RUN

Observations:
_to be filled_

### 2. Desktop Field refit from multiple focuses

Purpose: verify that Field reliably returns the graph to a whole-field view.

Acceptance evidence:
- At least three different focus states tested.
- After each Field click, at least 85% of visible `.node-core` elements are inside the graph viewport.
- Screenshots:
  - `test-results/black-bird-smoke/desktop-02-field-refit-1.png`
  - `test-results/black-bird-smoke/desktop-02-field-refit-2.png`
  - `test-results/black-bird-smoke/desktop-02-field-refit-3.png`

Status: NOT RUN

Measurements:
_to be filled_

Observations:
_to be filled_

### 3. Desktop dense area / local aperture

Purpose: capture evidence about whether dense graph regions become usable after focus.

Suggested focus targets, in order:
- Black Bird
- Corpse
- Cain / Ghurāb
- Huginn / Muninn
- American Crows

Acceptance evidence:
- Screenshot before focus if possible: `test-results/black-bird-smoke/desktop-03-dense-before.png`.
- Screenshot after focus: `test-results/black-bird-smoke/desktop-03-dense-aperture.png`.
- Record one of:
  - `usable and visually calm`
  - `usable but visually artificial`
  - `still dense / hard to select`
  - `measurement unavailable; human review required`

Status: NOT RUN

Observations:
_to be filled_

### 4. Mobile Field surface

Purpose: verify that mobile Field mode gives the graph the main surface.

Acceptance evidence:
- Mobile viewport 400 × 650.
- After an object is active, tapping bottom nav `Field` makes graph/map visible and dominant.
- Reader is hidden or not visually dominant.
- Screenshot: `test-results/black-bird-smoke/mobile-04-field-surface.png`.

Status: NOT RUN

Measurements:
- graph viewport height: _to be filled_
- reader visible height: _to be filled_
- bottom nav visible: _to be filled_

Observations:
_to be filled_

### 5. Mobile Read surface

Purpose: verify that mobile Read mode gives the reader the main surface.

Acceptance evidence:
- After object focus, tapping bottom nav `Read` makes reader visible and dominant.
- Graph is hidden or not consuming the upper part of the screen.
- Reader can scroll vertically.
- Bottom nav does not cover final clickable content after scrolling near bottom.
- Screenshot: `test-results/black-bird-smoke/mobile-05-read-surface.png`.

Status: NOT RUN

Measurements:
- reader viewport height: _to be filled_
- reader scrollHeight > clientHeight: _to be filled_
- graph hidden or secondary: _to be filled_

Observations:
_to be filled_

## Console / Page Errors

NOT RUN

## Screenshots

Screenshots should be saved under:

`test-results/black-bird-smoke/`

## Observations Only

This report should record observations and failures. Do not propose or implement fixes in the testing round.

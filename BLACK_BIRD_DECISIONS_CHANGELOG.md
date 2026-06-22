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

## 2026-06-22 — Canonical artifact and changelog cleanup

Base file:
- `index.html` (promoted from `the_black_bird_v5_6_nightly.html`)

Goal:
- Establish `index.html` as the single active root artifact.
- Rename `BLACK_BIRD_DECISIONS_CHANGELOG(1).md` to canonical `BLACK_BIRD_DECISIONS_CHANGELOG.md`.
- Update all references in tests, README, docs, and reports.

Files changed:
- `index.html` — new canonical root (copy of patched nightly with local D3)
- `archive/old-builds/the_black_bird_v5_6_nightly.html` — nightly moved here for reference
- `BLACK_BIRD_DECISIONS_CHANGELOG.md` — this file; renamed from `(1)` variant
- `tests/black-bird-smoke.spec.js` — PAGE_URL updated to `index.html`
- `README.md` — references updated to `index.html`
- `docs/PROJECT_STATE.md` — main file updated to `index.html`; archive note added
- `TESTING_REPORT.md` — main HTML file updated to `index.html`

Commands run:
- `npm test` — 5/5 passed

Decisions:
- `index.html` is now the canonical deployment artifact.
- Old nightly filename retained in `archive/old-builds/` for reference only.
- Changelog duplicate removed.

Known risks / next step:
- None introduced. Existing risks unchanged (mobile QA, aperture tuning, Google Fonts CDN).

---

## 2026-06-22 — Deployment hardening: local D3

Base file:
- `the_black_bird_v5_6_nightly.html`

Goal:
- Remove CDN dependency on cdnjs.cloudflare.com for D3.
- Add Playwright smoke test harness with CDN guard.

Files changed:
- `the_black_bird_v5_6_nightly.html` — replaced remote D3 CDN `<script>` with `<script src="vendor/d3.v7.9.0.min.js"></script>`
- `vendor/d3.v7.9.0.min.js` — D3 v7.9.0 minified, copied from `node_modules/d3/dist/d3.min.js`
- `package.json` — added name, scripts, devDependency on `@playwright/test@^1.45.0`
- `playwright.config.js` — new; configures Playwright for Chromium, `file://` base URL
- `tests/black-bird-smoke.spec.js` — new; 5 smoke scenarios + CDN guard (`beforeEach` throws if D3 CDN is requested)
- `README.md` — noted D3 is vendored locally
- `docs/PROJECT_STATE.md` — new; stack/dependency table including local D3 note
- `TESTING_REPORT.md` — updated with passing results; noted no CDN interception needed
- `BLACK_BIRD_DECISIONS_CHANGELOG(1).md` — this entry

Commands run:
- `npm install d3@7.9.0 --prefix .`
- `cp node_modules/d3/dist/d3.min.js vendor/d3.v7.9.0.min.js`
- `npm install` (added `@playwright/test@^1.45.0`)
- `npm test` — 5/5 passed (26.7s); no CDN requests detected

Decisions:
- Pin D3 version to what was in the CDN tag (7.8.5 → upgraded to 7.9.0 from npm; API compatible).
- Test guard uses `page.on('request')` to detect and fail on any D3 CDN request.
- No visual, design, ontology, or text changes made.

Results:
- All 5 smoke tests pass.
- No request to cdnjs.cloudflare.com during test run.

Known risks / next step:
- Google Fonts is still loaded from CDN; acceptable for now (not load-critical for app function).
- D3 version bumped from 7.8.5 (CDN) to 7.9.0 (npm); both are D3 v7 minor releases; no breaking changes expected.
- Chromium symlink at `/opt/pw-browsers/chromium-1124` → `chromium-1194` required in this environment due to Playwright version mismatch; may need updating when Playwright is upgraded.

---

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

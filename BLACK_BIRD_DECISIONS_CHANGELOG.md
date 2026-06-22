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

## 2026-06-22 — Final visual QA and mobile Field surface fix

Base file: `index.html`

Decision:
- Fixed test 4 locator: the mobile Field button inside `.map-wrap` (`#fieldBtn`) is hidden when `surface-read` is active, so `isVisible()` returned false and the click was skipped. Updated the locator to `[data-mobile="field"]` (bottom-nav Field button), which is always visible on mobile.
- Increased the post-click wait from 600ms to 800ms to ensure surface transition completes before screenshot.
- Tightened the mobile-04 assertion: `#mapWrap` height must now exceed 400px (full-height graph surface) rather than 200px.

Files changed:
- `tests/black-bird-smoke.spec.js` — mobile Field button locator fix

Commands run:
- `npm test` — 5/5 passed

Screenshots saved:
- `qa/final-visual-qa/` — all 9 smoke screenshots

Visual QA summary:
- Desktop threshold: PASS — centered card, no noise.
- Desktop after onboarding: PASS — graph centered in field, onboarding prompt visible.
- Desktop field refit ×3: PASS — graph visible in split view (≥85% nodes in viewport).
- Desktop dense aperture: PASS — reader pane + focused state screenshot captured.
- Mobile Field surface: FIXED — now correctly shows full-height graph-only surface with bottom nav.
- Mobile Read surface: PASS — reader occupies full surface, bottom nav visible and clickable.

Known risks:
- Desktop graph appears slightly small in split view during field refit; camera centering could be tightened in a later round.
- Local aperture visual quality still requires human review on real devices.
- Google Fonts still loaded from CDN.

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

## 2026-06-22 — GitHub Pages deployment readiness

Base file: `index.html`

Decision:
- Verified repo is ready to publish from GitHub Pages branch root. No changes to `index.html`.
- `.gitignore` confirmed safe: only `node_modules/` and `playwright-report/` are ignored.
- `vendor/d3.v7.9.0.min.js` loads via relative path — resolves correctly under the Pages subdirectory URL (`/Claude-Playground-/vendor/...`).
- `README.md` updated with Deployment section (GitHub Pages UI steps, expected URL) and Custom Domain Later section (Cloudflare Registrar + DNS recommendation).
- No `CNAME` file added; no DNS records configured yet. Custom domain deferred until a domain is chosen.

Files changed:
- `README.md` — added Deployment and Custom Domain Later sections
- `docs/PROJECT_STATE.md` — added deployment readiness note

Commands run:
- `npm test` — 5/5 passed

Known risks:
- Repository name `Claude-Playground-` contains a trailing hyphen; GitHub Pages URL will include it verbatim: `https://mozareeduge.github.io/Claude-Playground-/`. Verify this resolves correctly after enabling Pages.
- If the branch is not merged to `main` before Pages is enabled, the user must select the working branch (`claude/inspiring-euler-2fakpj`) as the source branch in Pages settings.

## 2026-06-22 — Desktop Field refit composition fix

Base file: `index.html`

Decision:
- Root cause identified: `returnToField()` called `measureGraph()` which restarted the D3 force simulation with `sim.alpha(0.08)`. The simulation cluster forces pull nodes toward positions biased toward the lower half of the viewport (lyric cluster at 80% height, irish at 70% height). `fitVisibleField` computed the camera for pre-drift node positions, but nodes continued drifting for ~3 seconds post-refit. Result: visible lower-left bias in all desktop Field refit screenshots.
- Fix: in `returnToField()` desktop path, replaced `measureGraph()` with an inline dimension measurement (`width`, `height`, `viewBox`, center force) that does NOT restart the simulation. The sim remains at its settled (low-alpha) state, so nodes stay stable when `fitVisibleField` computes the camera transform.
- Mobile path unchanged (`setReaderOpen` with measure).

Files changed:
- `index.html` — `returnToField()` desktop path: inline measure instead of `measureGraph()`
- `qa/desktop-composition-polish/` — 3 new composition screenshots

Commands run:
- `npm test` — 5/5 passed

Desktop composition measurements (1440×900 viewport):
- Refit 1: dx=+7.1% (±12% limit), dy=+7.4% (±14% limit) — PASS
- Refit 2: dx=-7.6% (±12% limit), dy=+12.2% (±14% limit) — PASS
- Refit 3: dx=+3.5% (±12% limit), dy=+0.4% (±14% limit) — PASS

Known risks:
- Refit 2 dy is at 87% of the ±14% limit; some node layouts may push closer to the boundary.
- If the user resizes the window between focus and field, `returnToField` will not restart the sim to adapt to new dimensions (the resize event listener handles this separately, which is correct).
- Mobile behavior unchanged; existing risks remain (real-device QA, aperture tuning, Google Fonts CDN).

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

## 2026-06-22 — Public GitHub Pages smoke check

Base file: `index.html`

Decision:
- Ran public URL smoke tests against `https://mozareeduge.github.io/Claude-Playground-/`.
- Discovered GitHub Pages returns HTTP 403 `host_not_allowed` — Pages was never activated in repo settings.
- Created GitHub Actions deployment workflow so the site can be published from the repo root on push to `main`.
- Created separate public smoke test spec (`tests/black-bird-public-smoke.spec.js`) with 8 checks, configurable via `PAGE_URL` env var. Added `npm run test:public` script.
- Updated `playwright.config.js`: added `chromium-public` project (scoped to public spec, uses `--ignore-certificate-errors` to work in sandbox environment); `chromium` project now ignores public spec via `testIgnore`.

Files changed:
- `.github/workflows/deploy-pages.yml` — new; Pages deployment workflow on push to `main`
- `tests/black-bird-public-smoke.spec.js` — new; 8-test public URL smoke suite
- `package.json` — added `test:public` script; `test` script scoped to local spec
- `playwright.config.js` — added `chromium-public` project; added `testIgnore` to `chromium` project
- `TESTING_REPORT.md` — added public smoke check section with 403 root cause and action required
- `docs/PROJECT_STATE.md` — noted 403 status and fix pushed
- `BLACK_BIRD_DECISIONS_CHANGELOG.md` — this entry

Commands run:
- `npm test` — 5/5 passed (local)
- `npm run test:public` — 3/8 passed (2 no-error checks passed; blocked by 403 on all content checks)

Results:
- Local smoke: 5/5 PASS.
- Public smoke: BLOCKED. Server returns 403 `host_not_allowed` — GitHub Pages not enabled. No content rendered; threshold/nodes/refit/mobile assertions could not execute.
- CDN guard: PASS (no D3 CDN request detected even on error page).

Action required:
- Repo owner must enable GitHub Pages in Settings → Pages → Source: GitHub Actions.
- After the deploy workflow runs on the next push to `main`, re-run `npm run test:public`.

Known risks:
- Until Pages is enabled, public URL tests will remain blocked.
- `chromium-public` project also runs the spec under the base `chromium` project if `testIgnore` is misconfigured; confirmed working.

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

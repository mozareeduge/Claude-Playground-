# Black Bird — Decisions and Changelog

This file is the canonical project log. Keep it in the repository root. Update it after every Claude Code round.

## 2026-06-25 — Verification tightening and repository hygiene (Phase 1 follow-up)

Base file: `index.html`

Goal: Tighten test verification and fix geometry guard without changing the approved mobile two-chamber design.

Decisions:
- `safeCoord()→0` pattern removed. `updateGraphGeometry()` and `drawRouteMemory()` now use `.each()` — only write SVG attributes when all four coordinates are finite; leave existing attribute values unchanged if any coord is non-finite. Eliminates phantom edges drawn to SVG origin (0,0).
- Test 6 rewritten to exercise real onboarding (not `?skipIntro=1`): uses `emulateMedia({reducedMotion:'reduce'})` for fast animations, waits on observable `surface-field` class, asserts Black Bird focus ring is active.
- Test 8 renamed and strengthened: first clears `activeId` by clicking empty SVG area, waits for `phase-field` class, then asserts specifically `FO.BLACK_BIRD_FIELD` in reader `.meta` element.
- Test 11 rewritten: records `tappedId` via `parentElement.__data__?.id` before tap, verifies identity in Read `.meta`, verifies `phase-focused` class preserved after Field return, checks focus ring active on that node, checks node in central safe viewport region, checks route non-empty, re-opens Read and verifies same ID.
- Test 14 added: verifies no SVG line has all four attrs at origin (`x1="0" y1="0" x2="0" y2="0"`) and no non-finite attribute values — the phantom-edge regression test for the old `safeCoord` pattern.
- `test-results/.last-run.json` removed from git tracking; added to `.gitignore`. Screenshots preserved.

Files changed:
- `index.html` — removed `safeCoord()`; rewrote `updateGraphGeometry()` with `.each()` last-finite pattern; rewrote `drawRouteMemory()` enter.merge block with same pattern
- `tests/black-bird-smoke.spec.js` — rewrote tests 6, 8, 11; added test 14; total now 14 tests
- `.gitignore` — added `test-results/.last-run.json`
- `BLACK_BIRD_DECISIONS_CHANGELOG.md` — this entry
- `TESTING_REPORT.md` — updated with 14/14 results

Commands run:
- `npm run test:data` → PASS (50 nodes)
- `npm test` → 14/14 passed (3.9m)

Known risks:
- Test 6 timeout set to 8s for `surface-field` class; real-device onboarding timing may vary.
- `drawRouteMemory` enter block no longer sets initial coordinates — lines are invisible until the next tick when coordinates become finite. On settled sims this is instantaneous; on very early ticks there may be a single frame without route lines, which is imperceptible.

---

## 2026-06-25 — Mobile two-chamber repair (Phase 1)

Base file: `index.html`

Goal: Emergency mobile viability repair — separate Field Chamber (graph) from Read Chamber (full-screen reader). Fix SVG NaN geometry errors. Reduce RelO label collision on mobile.

Decisions:
- Mobile onboarding ends in Field Chamber (graph overview), not Read. On desktop, onboarding still ends in focused+reader-open state.
- Mobile node tap now goes directly to full Read (no sheet detour). Sheet remains only for projected edge info.
- Mobile Read button opens FO.BLACK_BIRD_FIELD as fallback when no object is focused.
- Mobile Field button (from Read) returns to graph centered on current object — does not clear activeId. Graph lighting preserves focused state.
- SVG geometry: added `safeCoord()` guard — all line x1/y1/x2/y2 attributes now guard against NaN/Infinity. Route memory segments also guarded.
- RelO and RefO labels are fully hidden on mobile at all zoom levels (they caused dense label collisions). On desktop, existing threshold (k < 1.15) is preserved.
- Data ontology: unchanged. RNO/MNO prose: unchanged.

Files changed:
- `index.html` — `safeCoord()` + `updateGraphGeometry()` NaN guard; `drawRouteMemory` NaN guard; `updateLabelVisibility` RelO/RefO mobile suppression; `finishOnboarding` mobile ends in Field; node click handler direct focusObject on mobile; mobile nav 'read' button with FO.BLACK_BIRD_FIELD fallback; mobile nav 'field' button two-chamber return; `enter({skipOnboarding:true})` mobile Field path
- `tests/black-bird-smoke.spec.js` — expanded from 5 to 13 tests; added mobile two-chamber tests 6–13; screenshots: mobile-field-overview, mobile-node-tap-read, mobile-read-black-bird, mobile-return-field-focused, desktop-smoke
- `BLACK_BIRD_DECISIONS_CHANGELOG.md` — this entry

Commands run:
- `npm run test:data` → PASS (50 nodes)
- `npm test` → 13/13 passed

Screenshots verified:
- mobile-field-overview: full-height graph, Black Bird centered, no reader
- mobile-node-tap-read: full-screen reader (RNO prose + refs + object chips)
- mobile-read-black-bird: full-screen reader for FO.BLACK_BIRD_FIELD (appears-in list)
- mobile-return-field-focused: graph centered on tapped node, focus aperture ring visible
- desktop-smoke: graph+reader split with onboarding prompt — unchanged from prior

Known risks:
- Chromium symlink `/opt/pw-browsers/chromium-1124 → chromium-1194` required for @playwright/test 1.45.0 in this environment.
- Mobile aperture visual quality and real-device font rendering need physical device QA.
- Google Fonts still loaded from CDN.

---

## Round: Add FO.GOD field object (2026-06-24)

- **base file:** `index.html`
- **decision:** Added `FO.GOD` as a central FO. Connected to Quranic mediation structure via `RelO.R9C3F1A62` (participants: FO.GOD, FO.ALLAH, FO.BLACK_BIRD_FIELD, NameO.AR.GHURAB, FO.CAIN, FO.CORPSE, FO.BURIAL) and to Norse structure via `RelO.RB6E74D1A` (participants: FO.GOD, FO.ODIN, FO.BLACK_BIRD_FIELD, NameO.ON.HRAFN, FO.HUGINN, FO.MUNINN, FO.BATTLEFIELD, FO.CORPSE). FO.GOD added to objects lists for RNO.GHURAB_BURIAL__424A0ECF and RNO.HUGINN_MUNINN_RETURN__E0CB0303. No RNO/MNO body prose altered. FO.ALLAH and FO.ODIN remain separate. No direct Allah–Odin RelO added.
- **changed files:** `index.html`, `tests/black-bird-data-integrity.cjs`, `BLACK_BIRD_DECISIONS_CHANGELOG.md`, `docs/PROJECT_STATE.md`, `TESTING_REPORT.md`
- **commands run:** `npm run test:data` → PASS (50 nodes); `npm test` → browser smoke deferred to GitHub Actions
- **known risks:** None — additive only, no existing objects or relations modified.

## Round: Ontology ID Singularity + Approved RNO Copy (2026-06-24)

- **base file:** `index.html`
- **decision:** Migrated all ordered ontology IDs (RNO.04.x, MNO.04/05, RefO.04.x, RefO.05.1, RelO.04.x, RelO.05.x, RelO.MNO.04/05) to singular non-sequential content-hash IDs. Applied approved RNO bodies. Added FO.ALLAH, RefO.SAYERS_HUGINN_MUNINN_CORPSE__C003F76E, RefO.NI_MHAOLDOMHNAIGH_SCALD_CROW__694164EE. RelO labels set to opaque IDs; RelO shortLabels set to rel·XXXX forms. NameO attachment arrays updated to new RNO IDs. Added durable data integrity validator. Added Playwright Smoke GitHub Actions workflow.
- **changed files:** `index.html`, `tests/black-bird-data-integrity.cjs` (new), `package.json`, `.github/workflows/playwright-smoke.yml` (new), `BLACK_BIRD_DECISIONS_CHANGELOG.md`, `docs/PROJECT_STATE.md`, `TESTING_REPORT.md`
- **commands run:** `npm run test:data` → PASS (47 nodes); `npm test` → blocked (Chromium not installable in remote container; deferred to GitHub Actions)
- **known risks:** Browser smoke must be verified via GitHub Actions CI on the PR branch. No visual/layout changes were made.

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

# Project State — The Black Bird

## Current build

- Main file: `index.html`
- Phase: V5.6-nightly — governed interaction repair + deployment hardening

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | D3 v7.9.0 | Vendored locally at `vendor/d3.v7.9.0.min.js`; no CDN required |
| Rendering | SVG via D3 | Single-file embedded |
| Fonts | Google Fonts CDN | Acceptable; not load-critical |
| Tests | Playwright + Chromium | Smoke tests in `tests/black-bird-smoke.spec.js` |
| Build | None (single HTML) | No bundler; direct browser delivery |

## D3 dependency

D3 was previously loaded from cdnjs.cloudflare.com. As of 2026-06-22, D3 is vendored locally to eliminate CDN availability risk. Tests fail if any request reaches the D3 CDN.

## Archive

- `archive/old-builds/the_black_bird_v5_6_nightly.html` — previous root artifact, retained for reference

## Final visual QA status (2026-06-22)

Smoke tests: 5/5 PASS. Screenshots in `qa/final-visual-qa/`.

Mobile Field surface locator bug was fixed in test 4: the bottom-nav `[data-mobile="field"]` button is now used instead of the hidden `#fieldBtn` inside `.map-wrap`.

## GitHub Pages deployment readiness (2026-06-22)

Repo verified ready for GitHub Pages publication from branch root:
- `index.html` at root; `vendor/d3.v7.9.0.min.js` present and referenced by relative path.
- `.gitignore` does not suppress `index.html`, `vendor/`, `docs/`, `qa/`, or `package-lock.json`.
- `README.md` updated with Pages enable steps, expected URL, and custom domain plan.
- No build step required; serve from root.

Expected live URL once Pages is enabled: `https://mozareeduge.github.io/Claude-Playground-/`

**Status (2026-06-22):** GitHub Pages returns 403 `host_not_allowed` — Pages not yet activated in repo settings.

**Fix pushed:** `.github/workflows/deploy-pages.yml` deploys from repo root on push to `main`. Owner must enable Pages via Settings → Pages → Source: GitHub Actions before the workflow can publish. Once enabled, re-run `npm run test:public` to verify.

## Desktop composition polish (2026-06-22)

Desktop Field refit lower-left bias fixed. Root cause: `returnToField()` restarted the force simulation, causing node drift. Fix: measure-only path in desktop `returnToField()`. All 5 smoke tests pass. Composition measurements within ±12%/±14% center thresholds. Screenshots in `qa/desktop-composition-polish/`.

## Known risks

- Desktop graph appears slightly small during field refit in split view; camera centering could be tightened.
- Local aperture needs visual tuning around very dense neighborhoods (human review required on real device).
- Desktop Black Bird first focus should be checked on the laptop viewport.
- Google Fonts is still loaded from CDN; not critical for app function.

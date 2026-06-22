# Project State — The Black Bird

## Current build

- Main file: `the_black_bird_v5_6_nightly.html`
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

## Known risks

- Mobile Read/Field switching needs real-device QA.
- Local aperture needs visual tuning around very dense neighborhoods.
- Desktop Black Bird first focus should be checked on the laptop viewport.
- Google Fonts is still loaded from CDN; not critical for app function.

# Project State — The Black Bird

## Current build

- **Artifact:** `index.html` — the only active root HTML artifact; old build moved to `archive/old-builds/`
- **Version:** v5.6-nightly
- **Stack:** Single-file HTML — D3 v7.9 (CDN with local fallback), vanilla JS, inline CSS

## What works

- Threshold → onboarding → Black Bird first focus flow (desktop)
- Graph + reader split on desktop after first focus
- Field button refits full graph (44/44 nodes in viewport; 100%)
- Local aperture on focus in dense areas (34+ nodes individually selectable)
- Mobile two-surface model: Field (graph) and Read (reader)
- Bottom nav switches surfaces on mobile
- Route records focus history; consecutive duplicates are compressed
- Playwright smoke suite: 6 scenarios, all PASS

## Known risks

- Post-freeze node drift (~50 px lateral after `fx/fy` unpin at 2400 ms). Within safe margins. Monitor on real device.
- Mobile Read/Field switching confirmed in headless Chromium; real-device QA not yet done.
- Dense aperture breathing is functional but not visually tuned for very tight neighborhoods.
- D3 CDN (`cdnjs.cloudflare.com`) returns 403 in the remote CI environment. Tests use local `d3@7.9.0`.

## Next phase

- Real-device QA on mobile (iOS/Android).
- Visual tuning of local aperture in dense graph areas.
- Architecture migration to Vite/TypeScript/D3 modules (deferred until experience is stable).

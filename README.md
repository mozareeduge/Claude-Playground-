# The Black Bird

A single-file D3/SVG speculative research poem interface that stages encounters with objects, relations, and names without explaining them away.

## Current artifact

`index.html`

## Open locally

```
open index.html
# or
python3 -m http.server 8080
# then visit http://localhost:8080/
```

## Run tests

```bash
npm install
npm test                   # headless Chromium smoke pass
npm run test:headed        # same with visible browser
npm run test:report        # open last HTML report
```

Tests require Chromium. If `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` is not present, Playwright will use its own installed Chromium (run `npx playwright install chromium` first).

## Status

Stabilized single-file build (v5.6-nightly). Architecture migration to Vite/TypeScript/D3 modules is planned but not started — the single-file artifact is the source of truth until the experience is stable.

See `BLACK_BIRD_DECISIONS_CHANGELOG.md` for design decisions and round history.

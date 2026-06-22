# The Black Bird

A single-file D3/SVG speculative research poem interface.

## Stack

- `index.html` — single-file canonical build
- D3 v7.9.0 — **vendored locally** at `vendor/d3.v7.9.0.min.js` for deployment reliability; no CDN dependency
- Playwright — smoke testing (Chromium only)

## Run locally

Open `index.html` in a browser, or serve the directory root with any static file server so relative paths resolve.

## Tests

```
npm install
npm test
```

Tests use Playwright with Chromium. All smoke scenarios run against `index.html`; no network requests to cdnjs are expected or permitted.

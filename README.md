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

## Deployment — GitHub Pages

The repo is ready to publish directly from the branch root. No build step required.

### Enable GitHub Pages (UI steps)

1. Open the repository on GitHub.
2. Go to **Settings** → **Pages** (left sidebar).
3. Under **Source**, select **Deploy from a branch**.
4. **Branch**: choose `claude/inspiring-euler-2fakpj` (the current working branch) or `main` once merged.
5. **Folder**: `/ (root)`.
6. Click **Save**.

GitHub will build and publish within ~1 minute. The live URL will be:

```
https://mozareeduge.github.io/Claude-Playground-/
```

(GitHub Pages URLs are case-sensitive and match the repository name exactly.)

### What gets served

`index.html` at the repo root is the entry point. `vendor/d3.v7.9.0.min.js` is loaded by a relative path (`vendor/d3.v7.9.0.min.js`) and will resolve correctly under the Pages subdirectory URL.

## Custom Domain — Later

A custom domain can be configured after the GitHub Pages URL is confirmed working. No `CNAME` file or DNS records are needed yet.

**Recommended low-cost setup when ready:**
- **Registrar**: Cloudflare Registrar (at-cost pricing, no markup).
- **DNS / CDN**: Cloudflare DNS (free tier).
- **Hosting**: GitHub Pages (free).

**Preferred canonical domain style**: `www.<chosen-domain>` as canonical, with the apex/root domain redirecting to `www`. Cloudflare handles the apex redirect without requiring a separate server.

**Steps when a domain is chosen:**
1. Add the custom domain in GitHub → Settings → Pages → Custom domain.
2. GitHub auto-creates a `CNAME` file in the repo.
3. Add Cloudflare DNS records (four GitHub Pages A records for apex, one CNAME for `www`).
4. Enable Cloudflare proxying for the `www` record.
5. GitHub will issue a free TLS certificate via Let's Encrypt within minutes.

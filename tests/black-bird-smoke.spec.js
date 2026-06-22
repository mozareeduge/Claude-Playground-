const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const HTML_FILE = `file://${path.resolve(__dirname, '../index.html')}`;
const SCREENSHOT_DIR = path.resolve(__dirname, '../qa/smoke-2026-06-22');
const D3_LOCAL = path.resolve(__dirname, '../node_modules/d3/dist/d3.min.js');
const D3_CDN_PATTERN = '**/d3/**d3.min.js';

// Intercept D3 CDN and serve local copy so tests work offline
async function interceptD3(page) {
  await page.route(D3_CDN_PATTERN, route => {
    route.fulfill({ path: D3_LOCAL, contentType: 'application/javascript' });
  });
}

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 400, height: 650 };

function screenshotPath(name) {
  return path.join(SCREENSHOT_DIR, name);
}

// Suppress only favicon 404s — not real errors
const NOISE_PATTERNS = [
  /favicon/i,
];
function isNoise(msg) { return NOISE_PATTERNS.some(p => p.test(msg)); }

// Collect console and page errors
function attachErrorListeners(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && !isNoise(msg.text())) errors.push(`[console error] ${msg.text()}`);
  });
  page.on('pageerror', err => { if (!isNoise(err.message)) errors.push(`[page error] ${err.message}`); });
  return errors;
}

async function enterField(page) {
  await page.locator('[data-enter="map"]').click();
}

async function waitForPhase(page, phase, timeout = 15000) {
  await page.waitForFunction(
    p => document.getElementById('app')?.classList.contains(p),
    phase,
    { timeout }
  );
}

// Wait until onboarding is done: phase-focused or phase-field (not threshold/onboarding)
async function waitForPostOnboarding(page, timeout = 20000) {
  await page.waitForFunction(
    () => {
      const app = document.getElementById('app');
      if (!app) return false;
      return app.classList.contains('phase-focused') || app.classList.contains('phase-field');
    },
    null,
    { timeout }
  );
}

// Measure Black Bird node margins within .map-wrap
async function measureBlackBirdMargins(page) {
  return page.evaluate(() => {
    const mapWrap = document.querySelector('.map-wrap');
    const mapBox = mapWrap?.getBoundingClientRect();
    if (!mapBox) return null;
    const labels = document.querySelectorAll('text.node-label');
    for (const el of labels) {
      if (/Black Bird/i.test(el.textContent)) {
        const nb = el.getBoundingClientRect();
        return {
          L: nb.x - mapBox.x,
          T: nb.y - mapBox.y,
          R: (mapBox.x + mapBox.width) - (nb.x + nb.width),
          B: (mapBox.y + mapBox.height) - (nb.y + nb.height),
        };
      }
    }
    return null;
  });
}

// ──────────────────────────────────────────────────
// SCENARIO 1 — Desktop onboarding to Black Bird
// ──────────────────────────────────────────────────
test('S1: Desktop onboarding to Black Bird', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize(DESKTOP);
  const errors = attachErrorListeners(page);
  await interceptD3(page);
  await page.goto(HTML_FILE);

  // Phase: threshold — enter
  await expect(page.locator('[data-enter="map"]')).toBeVisible();
  await enterField(page);

  // Wait for post-onboarding state
  await waitForPostOnboarding(page);

  // Allow render/transition to settle
  await page.waitForTimeout(1200);

  // Assert Black Bird is referenced in route or reader
  const routeText = await page.locator('#route').textContent().catch(() => '');
  const readerText = await page.locator('#reader').textContent().catch(() => '');
  const blackBirdActive =
    /Black Bird|Crow\s*\/\s*Raven/i.test(routeText) ||
    /Black Bird|Crow\s*\/\s*Raven/i.test(readerText);

  // Measure graph viewport bounding box
  const mapBox = await page.locator('.map-wrap').boundingBox();
  expect(mapBox).not.toBeNull();

  // Measure Black Bird node margins (initial — node still pinned by fx/fy)
  const margins = await measureBlackBirdMargins(page);

  if (margins) {
    const marginPass = margins.L >= 80 && margins.T >= 110 && margins.R >= 40 && margins.B >= 40;
    console.log(`S1 initial margins: L=${margins.L.toFixed(0)} T=${margins.T.toFixed(0)} R=${margins.R.toFixed(0)} B=${margins.B.toFixed(0)} — ${marginPass ? 'PASS' : 'FAIL'}`);
    expect(margins.L, `S1 initial: left margin ${margins.L.toFixed(0)}px < 80px`).toBeGreaterThanOrEqual(80);
    expect(margins.T, `S1 initial: top margin ${margins.T.toFixed(0)}px < 110px`).toBeGreaterThanOrEqual(110);
    expect(margins.R, `S1 initial: right margin ${margins.R.toFixed(0)}px < 40px`).toBeGreaterThanOrEqual(40);
    expect(margins.B, `S1 initial: bottom margin ${margins.B.toFixed(0)}px < 40px`).toBeGreaterThanOrEqual(40);
  } else {
    console.warn('S1: Black Bird node label not found for margin measurement');
  }

  await page.screenshot({ path: screenshotPath('desktop-01-after-onboarding.png'), fullPage: false });

  // ── Post-freeze stability: wait 3200 ms more (fx/fy expires at 2400 ms from onboarding) ──
  await page.waitForTimeout(3200);

  const marginsPostFreeze = await measureBlackBirdMargins(page);

  if (marginsPostFreeze) {
    const pfPass =
      marginsPostFreeze.L >= 80 && marginsPostFreeze.T >= 110 &&
      marginsPostFreeze.R >= 40 && marginsPostFreeze.B >= 40;
    console.log(`S1 post-freeze margins: L=${marginsPostFreeze.L.toFixed(0)} T=${marginsPostFreeze.T.toFixed(0)} R=${marginsPostFreeze.R.toFixed(0)} B=${marginsPostFreeze.B.toFixed(0)} — ${pfPass ? 'PASS' : 'FAIL'}`);
    expect(marginsPostFreeze.L, `S1 post-freeze: left margin ${marginsPostFreeze.L.toFixed(0)}px < 80px`).toBeGreaterThanOrEqual(80);
    expect(marginsPostFreeze.T, `S1 post-freeze: top margin ${marginsPostFreeze.T.toFixed(0)}px < 110px`).toBeGreaterThanOrEqual(110);
    expect(marginsPostFreeze.R, `S1 post-freeze: right margin ${marginsPostFreeze.R.toFixed(0)}px < 40px`).toBeGreaterThanOrEqual(40);
    expect(marginsPostFreeze.B, `S1 post-freeze: bottom margin ${marginsPostFreeze.B.toFixed(0)}px < 40px`).toBeGreaterThanOrEqual(40);
  } else {
    console.warn('S1 post-freeze: Black Bird node label not found');
  }

  await page.screenshot({ path: screenshotPath('desktop-01-after-onboarding-post-freeze.png'), fullPage: false });

  // Hard assertions
  expect(errors, `Errors: ${errors.join('\n')}`).toHaveLength(0);
  expect(mapBox.width).toBeGreaterThan(400);
  if (!blackBirdActive) {
    console.warn('S1: Black Bird label not found in route/reader — needs human review');
  }

  test.info().annotations.push({
    type: 'black-bird-active-in-route-reader',
    description: String(blackBirdActive),
  });
  if (margins) {
    test.info().annotations.push({
      type: 'initial-margins',
      description: `L=${margins.L.toFixed(0)} T=${margins.T.toFixed(0)} R=${margins.R.toFixed(0)} B=${margins.B.toFixed(0)}`,
    });
  }
  if (marginsPostFreeze) {
    test.info().annotations.push({
      type: 'post-freeze-margins',
      description: `L=${marginsPostFreeze.L.toFixed(0)} T=${marginsPostFreeze.T.toFixed(0)} R=${marginsPostFreeze.R.toFixed(0)} B=${marginsPostFreeze.B.toFixed(0)}`,
    });
  }
});

// ──────────────────────────────────────────────────
// SCENARIO 2 — Desktop Field refit from multiple focuses
// ──────────────────────────────────────────────────
test('S2: Desktop Field refit from multiple focuses', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const errors = attachErrorListeners(page);
  await interceptD3(page);
  await page.goto(HTML_FILE);
  await enterField(page);
  await waitForPostOnboarding(page);
  await page.waitForTimeout(1200);

  const fieldBtn = page.locator('#fieldBtn');

  // Collect objects to focus: route items or fl links in reader
  const focusTargets = [];

  async function getFocusTargets() {
    // Try route items
    const routeItems = page.locator('.route-item');
    const rc = await routeItems.count();
    for (let i = 0; i < rc && focusTargets.length < 1; i++) {
      focusTargets.push(routeItems.nth(i));
    }
    // Try fl links in reader
    const flLinks = page.locator('#reader .fl');
    const flc = await flLinks.count();
    for (let i = 0; i < flc && focusTargets.length < 3; i++) {
      const box = await flLinks.nth(i).boundingBox({ timeout: 0 }).catch(() => null);
      if (box) focusTargets.push(flLinks.nth(i));
    }
  }

  await getFocusTargets();

  async function measureNodeCoverage(label) {
    const mapBox = await page.locator('.map-wrap').boundingBox();
    if (!mapBox) return { total: 0, inside: 0, pct: 0 };

    const nodeCores = page.locator('.node-core');
    const total = await nodeCores.count();
    let inside = 0;

    for (let i = 0; i < total; i++) {
      const b = await nodeCores.nth(i).boundingBox().catch(() => null);
      if (!b) continue;
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      if (
        cx >= mapBox.x && cx <= mapBox.x + mapBox.width &&
        cy >= mapBox.y && cy <= mapBox.y + mapBox.height
      ) {
        inside++;
      }
    }

    const pct = total > 0 ? (inside / total) * 100 : 0;
    console.log(`${label}: ${inside}/${total} nodes inside viewport (${pct.toFixed(1)}%)`);
    return { total, inside, pct };
  }

  const results = [];

  for (let round = 0; round < 3; round++) {
    // Focus an object
    const target = focusTargets[round % focusTargets.length];
    if (target) {
      await target.click({ force: true }).catch(() => {});
      await page.waitForTimeout(800);
    }

    // Click Field
    await fieldBtn.click();
    await page.waitForTimeout(1000);

    const m = await measureNodeCoverage(`S2 round ${round + 1}`);
    results.push(m);

    await page.screenshot({
      path: screenshotPath(`desktop-02-field-refit-${round + 1}.png`),
      fullPage: false,
    });
  }

  test.info().annotations.push({
    type: 'field-refit-results',
    description: JSON.stringify(results),
  });

  for (let i = 0; i < results.length; i++) {
    const { pct, total } = results[i];
    if (total === 0) continue;
    expect(pct, `Round ${i + 1}: only ${pct.toFixed(1)}% of nodes inside viewport`).toBeGreaterThanOrEqual(85);
  }

  expect(errors).toHaveLength(0);
});

// ──────────────────────────────────────────────────
// SCENARIO 3 — Desktop Dense Area / Local Aperture
// ──────────────────────────────────────────────────
test('S3: Desktop dense area / local aperture', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize(DESKTOP);
  const errors = attachErrorListeners(page);
  await interceptD3(page);
  await page.goto(HTML_FILE);
  await enterField(page);
  await waitForPostOnboarding(page);
  await page.waitForTimeout(1200);

  // Screenshot before focusing a dense area (field state)
  await page.screenshot({ path: screenshotPath('desktop-03-dense-before.png'), fullPage: false });

  // Use evaluate to quickly find clickable elements without Playwright locator timeouts
  const denseLabels = ['black bird', 'corpse', 'cain', 'huginn', 'american crows'];
  let focused = false;

  const clickInfo = await page.evaluate((labels) => {
    // Try reader fl links first
    const flLinks = Array.from(document.querySelectorAll('#reader .fl'));
    for (const label of labels) {
      const el = flLinks.find(e => e.textContent.trim().toLowerCase().includes(label));
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0) return { x: r.x + r.width / 2, y: r.y + r.height / 2, source: 'fl:' + label };
      }
    }
    // Try SVG node labels
    const svgLabels = Array.from(document.querySelectorAll('text.node-label'));
    for (const label of labels) {
      const el = svgLabels.find(e => e.textContent.trim().toLowerCase().includes(label));
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0) return { x: r.x + r.width / 2, y: r.y + r.height / 2, source: 'node:' + label };
      }
    }
    return null;
  }, denseLabels);

  if (clickInfo) {
    await page.mouse.click(clickInfo.x, clickInfo.y);
    await page.waitForTimeout(1000);
    focused = true;
    console.log(`S3: focused dense area via ${clickInfo.source}`);
  }

  await page.screenshot({ path: screenshotPath('desktop-03-dense-aperture.png'), fullPage: false });

  // Measure separation of visible node labels using a single evaluate call (fast)
  const separatedCount = await page.evaluate(() => {
    const mapEl = document.querySelector('.map-wrap');
    const mapRect = mapEl ? mapEl.getBoundingClientRect() : null;
    const labels = Array.from(document.querySelectorAll('text.node-label'));
    const boxes = labels
      .map(el => el.getBoundingClientRect())
      .filter(b => b.width > 0 && b.height > 0)
      .filter(b => !mapRect || (
        b.x >= mapRect.x && b.y >= mapRect.y &&
        b.right <= mapRect.right && b.bottom <= mapRect.bottom
      ));
    let sep = 0;
    for (let i = 0; i < boxes.length; i++) {
      const cxi = boxes[i].x + boxes[i].width / 2;
      const cyi = boxes[i].y + boxes[i].height / 2;
      let overlaps = false;
      for (let j = 0; j < boxes.length; j++) {
        if (i === j) continue;
        const cxj = boxes[j].x + boxes[j].width / 2;
        const cyj = boxes[j].y + boxes[j].height / 2;
        if (Math.abs(cxi - cxj) < 20 && Math.abs(cyi - cyj) < 20) { overlaps = true; break; }
      }
      if (!overlaps) sep++;
    }
    return sep;
  });

  let apertureNote;
  if (!focused) {
    apertureNote = 'measurement unavailable; human review required';
  } else if (separatedCount >= 4) {
    apertureNote = 'usable and visually calm';
  } else if (separatedCount >= 2) {
    apertureNote = 'still dense / hard to select';
  } else {
    apertureNote = 'measurement unavailable; human review required';
  }

  console.log(`S3 aperture: ${separatedCount} separated nodes. Note: ${apertureNote}`);
  test.info().annotations.push({ type: 'aperture-note', description: apertureNote });
  test.info().annotations.push({ type: 'separated-nodes', description: String(separatedCount) });

  expect(errors).toHaveLength(0);
});

// ──────────────────────────────────────────────────
// SCENARIO 4 — Mobile Field Surface
// ──────────────────────────────────────────────────
test('S4: Mobile Field surface', async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const errors = attachErrorListeners(page);
  await interceptD3(page);
  await page.goto(HTML_FILE);
  await enterField(page);
  await waitForPostOnboarding(page);
  await page.waitForTimeout(1200);

  // Tap a node if not already focused
  const appPhase = await page.evaluate(() => document.getElementById('app')?.className);
  if (!appPhase?.includes('phase-focused')) {
    const firstLink = page.locator('#reader .fl').first();
    const firstLinkBox = await firstLink.boundingBox().catch(() => null);
    if (firstLinkBox) await firstLink.click();
    else {
      const label = page.locator('text.node-label').first();
      const lb = await label.boundingBox().catch(() => null);
      if (lb) await page.mouse.click(lb.x + lb.width / 2, lb.y + lb.height / 2);
    }
    await page.waitForTimeout(800);
  }

  // Tap bottom nav Field
  await page.locator('[data-mobile="field"]').click();
  await page.waitForTimeout(800);

  await page.screenshot({ path: screenshotPath('mobile-04-field-surface.png'), fullPage: false });

  const mapBox = await page.locator('.map-wrap').boundingBox();
  const readerBox = await page.locator('#reader').boundingBox().catch(() => null);
  const navBox = await page.locator('.bottom-nav').boundingBox().catch(() => null);

  console.log(`S4 map height: ${mapBox?.height?.toFixed(0)}`);
  console.log(`S4 reader visible: ${readerBox ? `${readerBox.height.toFixed(0)}px` : 'hidden'}`);
  console.log(`S4 bottom-nav visible: ${navBox ? 'yes' : 'no'}`);

  test.info().annotations.push({ type: 's4-graph-height', description: String(mapBox?.height?.toFixed(0)) });
  test.info().annotations.push({ type: 's4-reader-height', description: readerBox ? readerBox.height.toFixed(0) : 'hidden' });
  test.info().annotations.push({ type: 's4-nav-visible', description: navBox ? 'yes' : 'no' });

  if (mapBox) {
    expect(mapBox.height).toBeGreaterThan(MOBILE.height * 0.4);
  }

  expect(errors).toHaveLength(0);
});

// ──────────────────────────────────────────────────
// SCENARIO 5 — Mobile Read Surface
// ──────────────────────────────────────────────────
test('S5: Mobile Read surface', async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const errors = attachErrorListeners(page);
  await interceptD3(page);
  await page.goto(HTML_FILE);
  await enterField(page);
  await waitForPostOnboarding(page);
  await page.waitForTimeout(1200);

  // Ensure something is focused
  const appPhase = await page.evaluate(() => document.getElementById('app')?.className);
  if (!appPhase?.includes('phase-focused')) {
    const firstLink = page.locator('#reader .fl').first();
    const firstLinkBox = await firstLink.boundingBox().catch(() => null);
    if (firstLinkBox) await firstLink.click();
    await page.waitForTimeout(800);
  }

  // Switch to Read surface
  await page.locator('[data-mobile="read"]').click();
  await page.waitForTimeout(800);

  await page.screenshot({ path: screenshotPath('mobile-05-read-surface.png'), fullPage: false });

  const readerBox = await page.locator('#reader').boundingBox().catch(() => null);
  const mapBox = await page.locator('.map-wrap').boundingBox().catch(() => null);

  const readerScrollable = await page.evaluate(() => {
    const r = document.getElementById('reader');
    return r ? r.scrollHeight > r.clientHeight : false;
  });

  const navBox = await page.locator('.bottom-nav').boundingBox().catch(() => null);

  console.log(`S5 reader height: ${readerBox?.height?.toFixed(0)}`);
  console.log(`S5 reader scrollable: ${readerScrollable}`);
  console.log(`S5 map visible/height: ${mapBox ? mapBox.height.toFixed(0) : 'hidden/0'}`);

  test.info().annotations.push({ type: 's5-reader-height', description: String(readerBox?.height?.toFixed(0)) });
  test.info().annotations.push({ type: 's5-scrollable', description: String(readerScrollable) });
  test.info().annotations.push({ type: 's5-map-secondary', description: mapBox ? `${mapBox.height.toFixed(0)}px` : 'hidden' });

  if (readerBox) {
    expect(readerBox.height).toBeGreaterThan(200);
  }

  expect(errors).toHaveLength(0);
});

// ──────────────────────────────────────────────────
// SCENARIO 6 — Route duplicate compression
// ──────────────────────────────────────────────────
test('S6: Route duplicate compression', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const errors = attachErrorListeners(page);
  await interceptD3(page);
  await page.goto(HTML_FILE);
  await enterField(page);
  await waitForPostOnboarding(page);
  await page.waitForTimeout(1200);

  // After onboarding, Black Bird is already the active focus.
  // Focus Black Bird a second time via a route item or fl link.
  const focusedAgain = await page.evaluate(() => {
    // Try clicking a route item that is Black Bird
    const routeItems = Array.from(document.querySelectorAll('.route-item'));
    const bbRoute = routeItems.find(el => /Black Bird/i.test(el.textContent));
    if (bbRoute) { bbRoute.click(); return 'route-item'; }
    // Try clicking a fl link in reader that references Black Bird
    const flLinks = Array.from(document.querySelectorAll('#reader .fl'));
    const bbLink = flLinks.find(el => /Black Bird/i.test(el.textContent));
    if (bbLink) { bbLink.click(); return 'fl-link'; }
    return null;
  });

  await page.waitForTimeout(800);
  console.log(`S6: second focus attempted via: ${focusedAgain}`);

  // Read visible route items
  const routeItems = await page.locator('.route-item').allTextContents();
  console.log(`S6 route items: ${JSON.stringify(routeItems)}`);

  // Check no consecutive identical Black Bird entries
  let consecutiveDuplicate = false;
  for (let i = 1; i < routeItems.length; i++) {
    const prev = routeItems[i - 1].trim();
    const curr = routeItems[i].trim();
    if (/Black Bird/i.test(prev) && /Black Bird/i.test(curr)) {
      consecutiveDuplicate = true;
      console.warn(`S6 FAIL: consecutive Black Bird route items at positions ${i - 1} and ${i}`);
      break;
    }
  }

  test.info().annotations.push({
    type: 's6-route-items',
    description: routeItems.join(' · '),
  });
  test.info().annotations.push({
    type: 's6-consecutive-duplicate',
    description: String(consecutiveDuplicate),
  });

  expect(consecutiveDuplicate, 'Route should not contain consecutive Black Bird entries').toBe(false);
  expect(errors).toHaveLength(0);
});

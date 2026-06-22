// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const PAGE_URL = 'file://' + path.resolve(__dirname, '..', 'index.html');

// Guard: fail if any request hits the D3 CDN
test.beforeEach(async ({ page }) => {
  page.on('request', req => {
    if (req.url().includes('cdnjs.cloudflare.com/ajax/libs/d3')) {
      throw new Error(`CDN D3 request detected — app must use local vendor file. URL: ${req.url()}`);
    }
  });
});

test.describe('Black Bird smoke tests', () => {
  test('1. Desktop onboarding to Black Bird', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(PAGE_URL);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-00-threshold.png' });

    // Enter from threshold
    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
    } else {
      // Some versions use a click-anywhere threshold
      await page.mouse.click(720, 450);
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-01-after-onboarding.png' });

    const nodeCount = await page.locator('.node-core').count();
    expect(nodeCount).toBeGreaterThan(0);

    expect(errors).toHaveLength(0);
  });

  test('2. Desktop Field refit from multiple focuses', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);

    // Enter
    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(2000);

    const fieldBtn = page.locator('button', { hasText: /field/i }).first();
    const nodes = page.locator('.node-core');
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(3, nodeCount); i++) {
      await nodes.nth(i).click({ force: true });
      await page.waitForTimeout(600);

      if (await fieldBtn.isVisible()) await fieldBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `test-results/black-bird-smoke/desktop-02-field-refit-${i + 1}.png` });

      const viewport = page.viewportSize();
      const visibleNodes = await nodes.evaluateAll((els, vp) => {
        return els.filter(el => {
          const r = el.getBoundingClientRect();
          return r.right > 0 && r.bottom > 0 && r.left < vp.width && r.top < vp.height;
        }).length;
      }, viewport);

      expect(visibleNodes / nodeCount).toBeGreaterThanOrEqual(0.85);
    }
  });

  test('3. Desktop dense area aperture evidence', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-03-dense-before.png' });

    const firstNode = page.locator('.node-core').first();
    await firstNode.click({ force: true });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-03-dense-aperture.png' });
  });

  test('4. Mobile Field surface', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(PAGE_URL);

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(2000);

    const firstNode = page.locator('.node-core').first();
    if (await firstNode.isVisible()) {
      await firstNode.click({ force: true });
      await page.waitForTimeout(600);
    }

    const fieldBtn = page.locator('button', { hasText: /field/i }).first();
    if (await fieldBtn.isVisible()) await fieldBtn.click();
    await page.waitForTimeout(600);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-04-field-surface.png' });

    const mapWrap = page.locator('#mapWrap');
    const box = await mapWrap.boundingBox();
    // map-wrap should be visible and occupy at least a third of the mobile viewport height
    if (box) {
      expect(box.height).toBeGreaterThan(200);
    } else {
      // Fall back to checking the SVG is present in the DOM
      const svgCount = await page.locator('#graphSvg').count();
      expect(svgCount).toBeGreaterThan(0);
    }
  });

  test('5. Mobile Read surface', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(PAGE_URL);

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(2000);

    const firstNode = page.locator('.node-core').first();
    if (await firstNode.isVisible()) {
      await firstNode.click({ force: true });
      await page.waitForTimeout(600);
    }

    const readBtn = page.locator('button', { hasText: /read/i }).first();
    if (await readBtn.isVisible()) await readBtn.click();
    await page.waitForTimeout(600);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-05-read-surface.png' });

    const reader = page.locator('#reader, [data-surface="read"], .reader-pane').first();
    if (await reader.isVisible()) {
      const box = await reader.boundingBox();
      expect(box.height).toBeGreaterThan(300);
    }
  });
});

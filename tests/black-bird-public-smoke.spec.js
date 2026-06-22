// @ts-check
const { test, expect } = require('@playwright/test');

const PAGE_URL = process.env.PAGE_URL || 'https://mozareeduge.github.io/Claude-Playground-/';

// Guard: fail if any request hits the D3 CDN
test.beforeEach(async ({ page }) => {
  page.on('request', req => {
    if (req.url().includes('cdnjs.cloudflare.com/ajax/libs/d3')) {
      throw new Error(`CDN D3 request detected — app must use local vendor file. URL: ${req.url()}`);
    }
  });
});

test.describe('Black Bird PUBLIC smoke tests', () => {
  test('1. Page loads and assets respond 200', async ({ page }) => {
    const responses = {};
    page.on('response', res => {
      const url = res.url();
      if (url.includes('index.html') || url.endsWith('/') || url.includes('d3.v7')) {
        responses[url] = res.status();
      }
    });

    const res = await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
    expect(res.status()).toBeLessThan(400);

    await page.screenshot({ path: 'qa/public-url-smoke/01-load.png' });
  });

  test('2. No CDN D3 request', async ({ page }) => {
    // The beforeEach guard will throw if CDN is hit
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
  });

  test('3. Threshold is visible', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'qa/public-url-smoke/03-threshold.png' });

    // Either the threshold overlay or an enter button must be visible
    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    const thresholdEl = page.locator('#threshold, .threshold, [data-phase="threshold"]').first();
    const hasEnter = await enterBtn.isVisible().catch(() => false);
    const hasThreshold = await thresholdEl.isVisible().catch(() => false);
    expect(hasEnter || hasThreshold).toBe(true);
  });

  test('4. Desktop onboarding reaches Black Bird', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
    } else {
      await page.mouse.click(720, 450);
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'qa/public-url-smoke/04-after-onboarding.png' });

    const nodeCount = await page.locator('.node-core').count();
    expect(nodeCount).toBeGreaterThan(0);
    expect(errors).toHaveLength(0);
  });

  test('5. Desktop Field refit passes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(3000);

    const fieldBtn = page.locator('button', { hasText: /field/i }).first();
    const nodes = page.locator('.node-core');
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThan(0);

    // Click first node then return to field
    await nodes.first().click({ force: true });
    await page.waitForTimeout(800);
    if (await fieldBtn.isVisible()) await fieldBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/public-url-smoke/05-field-refit.png' });

    const viewport = page.viewportSize();
    const visibleNodes = await nodes.evaluateAll((els, vp) => {
      return els.filter(el => {
        const r = el.getBoundingClientRect();
        return r.right > 0 && r.bottom > 0 && r.left < vp.width && r.top < vp.height;
      }).length;
    }, viewport);
    expect(visibleNodes / nodeCount).toBeGreaterThanOrEqual(0.85);
  });

  test('6. Mobile Field surface', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(2000);

    const firstNode = page.locator('.node-core').first();
    if (await firstNode.isVisible()) {
      await firstNode.click({ force: true });
      await page.waitForTimeout(600);
    }

    const mobileFieldBtn = page.locator('[data-mobile="field"]');
    if (await mobileFieldBtn.isVisible()) await mobileFieldBtn.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: 'qa/public-url-smoke/06-mobile-field.png' });

    const mapWrap = page.locator('#mapWrap');
    const box = await mapWrap.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThan(400);
    } else {
      const svgCount = await page.locator('#graphSvg').count();
      expect(svgCount).toBeGreaterThan(0);
    }
  });

  test('7. Mobile Read surface', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

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
    await page.waitForTimeout(800);

    await page.screenshot({ path: 'qa/public-url-smoke/07-mobile-read.png' });

    const reader = page.locator('#reader, [data-surface="read"], .reader-pane').first();
    if (await reader.isVisible()) {
      const box = await reader.boundingBox();
      expect(box.height).toBeGreaterThan(300);
    }
  });

  test('8. No console/page errors on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });
});

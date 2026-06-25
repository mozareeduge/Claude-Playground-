// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const PAGE_URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SKIP_URL = PAGE_URL + '?skipIntro=1';

// Guard: fail if any request hits the D3 CDN
test.beforeEach(async ({ page }) => {
  page.on('request', req => {
    if (req.url().includes('cdnjs.cloudflare.com/ajax/libs/d3')) {
      throw new Error(`CDN D3 request detected — app must use local vendor file. URL: ${req.url()}`);
    }
  });
});

test.describe('Black Bird smoke tests', () => {
  // ── Desktop smoke ─────────────────────────────────────────────────────────

  test('1. Desktop onboarding to Black Bird', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(PAGE_URL);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-00-threshold.png' });

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
    } else {
      await page.mouse.click(720, 450);
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-smoke.png' });

    const nodeCount = await page.locator('.node-core').count();
    expect(nodeCount).toBeGreaterThan(0);

    expect(errors).toHaveLength(0);
  });

  test('2. Desktop Field refit from multiple focuses', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);

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

  // ── Mobile: existing baseline ─────────────────────────────────────────────

  test('4. Mobile Field surface', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(PAGE_URL);

    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    if (await enterBtn.isVisible()) await enterBtn.click();
    await page.waitForTimeout(2000);

    const firstNode = page.locator('.node-core').first();
    if (await firstNode.isVisible()) {
      await firstNode.click({ force: true });
      await page.waitForTimeout(800);
    }

    const mobileFieldBtn = page.locator('[data-mobile="field"]');
    if (await mobileFieldBtn.isVisible()) await mobileFieldBtn.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-04-field-surface.png' });

    const mapWrap = page.locator('#mapWrap');
    const box = await mapWrap.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThan(400);
    } else {
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
      await page.waitForTimeout(800);
    }

    // After node tap on mobile, should already be in Read; Read button re-affirms
    const readBtn = page.locator('[data-mobile="read"]');
    if (await readBtn.isVisible()) await readBtn.click();
    await page.waitForTimeout(600);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-05-read-surface.png' });

    const reader = page.locator('#reader');
    if (await reader.isVisible()) {
      const box = await reader.boundingBox();
      expect(box.height).toBeGreaterThan(300);
    }
  });

  // ── Mobile: two-chamber repairs ───────────────────────────────────────────

  test('6. Mobile onboarding ends in Field overview', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    // Reduced motion collapses onboarding animations to near-zero ms
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(PAGE_URL);
    const enterBtn = page.locator('button', { hasText: /enter/i }).first();
    await enterBtn.waitFor({ state: 'visible', timeout: 5000 });
    await enterBtn.click();

    // Wait for observable UI state rather than arbitrary timeout
    const appEl = page.locator('#app');
    await expect(appEl).toHaveClass(/surface-field/, { timeout: 8000 });

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-field-overview.png' });

    // Black Bird should be the focused object after onboarding
    await expect(appEl).toHaveClass(/phase-focused/);
    const hasFocusRing = await page.evaluate(() => {
      for (const node of document.querySelectorAll('g.node')) {
        if (node.__data__?.id === 'FO.BLACK_BIRD_FIELD') {
          const ring = node.querySelector('.node-focus-ring');
          const stroke = ring?.getAttribute('stroke');
          const opacity = parseFloat(ring?.getAttribute('stroke-opacity') || '0');
          return stroke && stroke !== 'transparent' && opacity > 0;
        }
      }
      return false;
    });
    expect(hasFocusRing).toBe(true);

    // Map must be visible and full-height
    const mapWrap = page.locator('#mapWrap');
    await expect(mapWrap).toBeVisible();
    const box = await mapWrap.boundingBox();
    expect(box?.height).toBeGreaterThan(400);

    // Reader panel and sheets must be hidden
    await expect(page.locator('.panel')).not.toBeVisible();
    expect(await page.locator('.sheet.open').count()).toBe(0);

    const nodeCount = await page.locator('.node-core').count();
    expect(nodeCount).toBeGreaterThan(0);

    expect(errors).toHaveLength(0);
  });

  test('7. Mobile node tap opens full Read', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Tap the first visible node
    const firstNode = page.locator('.node-hit').first();
    await firstNode.click({ force: true });
    await page.waitForTimeout(900);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-node-tap-read.png' });

    // App must be in surface-read
    const appEl = page.locator('#app');
    await expect(appEl).toHaveClass(/surface-read/);

    // Reader must be visible and tall
    const reader = page.locator('#reader');
    await expect(reader).toBeVisible();
    const box = await reader.boundingBox();
    expect(box?.height).toBeGreaterThan(300);

    // Reader must have content
    const content = await reader.textContent();
    expect(content?.trim().length).toBeGreaterThan(0);

    // No sheet should be the primary reader (sheet is not the reader pane)
    const sheetOpen = await page.locator('.sheet.open').count();
    // Sheet should not be open (node tap goes straight to Read)
    expect(sheetOpen).toBe(0);

    expect(errors).toHaveLength(0);
  });

  test('8. Mobile Read fallback opens Black Bird when no object is active', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1200);

    // Clear activeId by clicking empty SVG space (upper-left corner, away from nodes)
    const svgBox = await page.locator('#graphSvg').boundingBox();
    await page.mouse.click(svgBox.x + 8, svgBox.y + 8);
    // Wait for phase-field class indicating returnToField completed
    await expect(page.locator('#app')).toHaveClass(/phase-field/, { timeout: 2000 });

    // Tap Read — should fall back to FO.BLACK_BIRD_FIELD
    const readBtn = page.locator('[data-mobile="read"]');
    await expect(readBtn).toBeVisible();
    await readBtn.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-read-black-bird.png' });

    // Must be in Read surface
    await expect(page.locator('#app')).toHaveClass(/surface-read/);

    // Reader must show specifically FO.BLACK_BIRD_FIELD
    const reader = page.locator('#reader');
    await expect(reader).toBeVisible();
    const meta = await page.locator('#reader .meta').textContent();
    expect(meta).toContain('FO.BLACK_BIRD_FIELD');
  });

  test('9. Mobile inline link navigates within Read', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Enter Read by tapping a node that has inline links (tap any RNO/MNO)
    const nodes = page.locator('.node-hit');
    const count = await nodes.count();
    let navigated = false;
    for (let i = 0; i < Math.min(count, 8); i++) {
      await nodes.nth(i).click({ force: true });
      await page.waitForTimeout(700);

      // Check if there's an inline link (.fl) in reader
      const inlineLinks = page.locator('#reader .fl');
      const linkCount = await inlineLinks.count();
      if (linkCount > 0) {
        const firstTitle = await page.locator('#reader .title').textContent().catch(() => '');
        await inlineLinks.first().click();
        await page.waitForTimeout(700);
        const newTitle = await page.locator('#reader .title').textContent().catch(() => '');
        // Title should have changed (navigated to a different object)
        if (firstTitle !== newTitle) {
          navigated = true;
          break;
        }
      }
      // Return to field before trying next node
      await page.locator('[data-mobile="field"]').click();
      await page.waitForTimeout(500);
    }
    expect(navigated).toBe(true);
  });

  test('10. Mobile related object (chip/index-item) navigates within Read', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Tap Read button to see Black Bird field object (has related items)
    await page.locator('[data-mobile="read"]').click();
    await page.waitForTimeout(800);

    // Black Bird FO has "appears in" index items
    const indexItems = page.locator('#reader .index-item');
    const itemCount = await indexItems.count();
    if (itemCount > 0) {
      const firstTitle = await page.locator('#reader .title').textContent().catch(() => '');
      await indexItems.first().click();
      await page.waitForTimeout(700);
      const newTitle = await page.locator('#reader .title').textContent().catch(() => '');
      expect(firstTitle).not.toBe(newTitle);
    } else {
      // Chips
      const chips = page.locator('#reader .chip');
      if (await chips.count() > 0) {
        const firstTitle = await page.locator('#reader .title').textContent().catch(() => '');
        await chips.first().click();
        await page.waitForTimeout(700);
        const newTitle = await page.locator('#reader .title').textContent().catch(() => '');
        expect(firstTitle).not.toBe(newTitle);
      }
    }
    // Ensure we're still in Read
    await expect(page.locator('#app')).toHaveClass(/surface-read/);
  });

  test('11. Mobile Field returns to graph with focus and identity preserved', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1200);

    // Record the ID of the first node before tapping
    const tappedId = await page.evaluate(() => {
      const hitEl = document.querySelector('.node-hit');
      return hitEl?.parentElement?.__data__?.id ?? null;
    });
    expect(tappedId).not.toBeNull();

    // Tap node → Read
    await page.locator('.node-hit').first().click({ force: true });
    await page.waitForTimeout(900);
    await expect(page.locator('#app')).toHaveClass(/surface-read/);

    // Confirm Read opened for that exact object
    const readMeta = await page.locator('#reader .meta').textContent();
    expect(readMeta).toContain(tappedId);

    // Tap Field button
    await page.locator('[data-mobile="field"]').click();
    await page.waitForTimeout(900);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-return-field-focused.png' });

    // Must be in field surface, still phase-focused (activeId preserved)
    await expect(page.locator('#app')).toHaveClass(/surface-field/);
    await expect(page.locator('#app')).toHaveClass(/phase-focused/);

    // Focus ring must be active on the tapped node
    const hasFocusRing = await page.evaluate((id) => {
      for (const node of document.querySelectorAll('g.node')) {
        if (node.__data__?.id === id) {
          const ring = node.querySelector('.node-focus-ring');
          const stroke = ring?.getAttribute('stroke');
          const opacity = parseFloat(ring?.getAttribute('stroke-opacity') || '0');
          return stroke && stroke !== 'transparent' && opacity > 0;
        }
      }
      return false;
    }, tappedId);
    expect(hasFocusRing).toBe(true);

    // Focused node must be in the central safe region of the viewport
    const nodeInSafeZone = await page.evaluate((id) => {
      for (const node of document.querySelectorAll('g.node')) {
        if (node.__data__?.id === id) {
          const rect = node.getBoundingClientRect();
          const cx = (rect.left + rect.right) / 2;
          const cy = (rect.top + rect.bottom) / 2;
          const vw = window.innerWidth, vh = window.innerHeight;
          return cx > vw * 0.1 && cx < vw * 0.9 && cy > vh * 0.05 && cy < vh * 0.95;
        }
      }
      return false;
    }, tappedId);
    expect(nodeInSafeZone).toBe(true);

    // Route strip must be non-empty (at least one focus event recorded)
    const routeText = await page.locator('#route').textContent();
    expect(routeText?.replace('route is empty', '').trim().length).toBeGreaterThan(0);

    // Map must be full-height and panel hidden
    const mapWrap = page.locator('#mapWrap');
    await expect(mapWrap).toBeVisible();
    const box = await mapWrap.boundingBox();
    expect(box?.height).toBeGreaterThan(400);
    await expect(page.locator('.panel')).not.toBeVisible();

    // Tap Read again — same object must reopen
    await page.locator('[data-mobile="read"]').click();
    await page.waitForTimeout(800);
    const readMeta2 = await page.locator('#reader .meta').textContent();
    expect(readMeta2).toContain(tappedId);
  });

  test('12. No console NaN errors on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    const nanErrors = [];
    page.on('pageerror', e => {
      if (e.message.includes('NaN')) nanErrors.push(e.message);
    });
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('NaN')) {
        nanErrors.push(msg.text());
      }
    });

    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Tap a node → Read
    await page.locator('.node-hit').first().click({ force: true });
    await page.waitForTimeout(800);

    // Return to field
    await page.locator('[data-mobile="field"]').click();
    await page.waitForTimeout(800);

    expect(nanErrors).toHaveLength(0);
  });

  test('13. No SVG line attributes receive NaN', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Tap a node to trigger focus/aperture
    await page.locator('.node-hit').first().click({ force: true });
    await page.waitForTimeout(800);

    // Return to field
    await page.locator('[data-mobile="field"]').click();
    await page.waitForTimeout(800);

    const nanLineCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#graphSvg line')).filter(l => {
        return ['x1','y1','x2','y2'].some(attr => {
          const v = l.getAttribute(attr);
          return v !== null && !isFinite(parseFloat(v));
        });
      }).length;
    });

    expect(nanLineCount).toBe(0);
  });

  test('14. No phantom edges drawn to origin (0,0)', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Tap node + return to field to stress the geometry update path
    await page.locator('.node-hit').first().click({ force: true });
    await page.waitForTimeout(800);
    await page.locator('[data-mobile="field"]').click();
    await page.waitForTimeout(800);

    // No line should have both endpoints at exact SVG origin (0,0) —
    // this was the phantom-edge artifact produced by the old safeCoord(NaN)→0 pattern.
    const phantomCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#graphSvg line')).filter(l => {
        const x1 = l.getAttribute('x1'), y1 = l.getAttribute('y1');
        const x2 = l.getAttribute('x2'), y2 = l.getAttribute('y2');
        // Degenerate line: both endpoints exactly at pixel origin
        return x1 === '0' && y1 === '0' && x2 === '0' && y2 === '0';
      }).length;
    });
    expect(phantomCount).toBe(0);

    // Additionally: every line that has attributes set must have finite, non-zero geometry
    const invalidLineCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#graphSvg line')).filter(l => {
        const attrs = ['x1','y1','x2','y2'].map(a => l.getAttribute(a)).filter(v => v !== null);
        if (attrs.length === 0) return false; // unset is acceptable
        return attrs.some(v => !isFinite(parseFloat(v)));
      }).length;
    });
    expect(invalidLineCount).toBe(0);
  });
});

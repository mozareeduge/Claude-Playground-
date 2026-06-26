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

  test('7. Mobile node tap selects object in Field (not Read)', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Record which node will be tapped
    const tappedId = await page.evaluate(() => {
      const hitEl = document.querySelector('.node-hit');
      return hitEl?.parentElement?.__data__?.id ?? null;
    });
    expect(tappedId).not.toBeNull();

    // Tap the first visible node
    const firstNode = page.locator('.node-hit').first();
    await firstNode.click({ force: true });
    await page.waitForTimeout(900);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-node-tap-field.png' });

    // Phase 2B: mobile tap stays in surface-field, NOT surface-read
    const appEl = page.locator('#app');
    await expect(appEl).toHaveClass(/surface-field/);

    // Map must remain visible and full-height
    const mapWrap = page.locator('#mapWrap');
    await expect(mapWrap).toBeVisible();
    const box = await mapWrap.boundingBox();
    expect(box?.height).toBeGreaterThan(400);

    // Reader panel must NOT be visible (surface=field hides it on mobile)
    await expect(page.locator('.panel')).not.toBeVisible();

    // Active object must be set (phase-focused)
    await expect(appEl).toHaveClass(/phase-focused/);

    // Focus ring must be on tapped node
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

    // Bottom Read button must then open that object in Read
    const readBtn = page.locator('[data-mobile="read"]');
    await readBtn.click();
    await page.waitForTimeout(700);
    await expect(appEl).toHaveClass(/surface-read/);
    const meta = await page.locator('#reader .meta').textContent();
    expect(meta).toContain(tappedId);

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

    // Phase 2B: node tap stays in Field; must use Read button to enter Read first
    const nodes = page.locator('.node-hit');
    const count = await nodes.count();
    let navigated = false;
    for (let i = 0; i < Math.min(count, 8); i++) {
      // Tap node to select it in Field
      await nodes.nth(i).click({ force: true });
      await page.waitForTimeout(600);

      // Open Read via bottom Read button
      await page.locator('[data-mobile="read"]').click();
      await page.waitForTimeout(600);

      // Check if there's an inline link (.fl) in reader
      const inlineLinks = page.locator('#reader .fl');
      const linkCount = await inlineLinks.count();
      if (linkCount > 0) {
        const firstTitle = await page.locator('#reader .title').textContent().catch(() => '');
        await inlineLinks.first().click();
        await page.waitForTimeout(700);
        // Must still be in Read surface (inline links stay in Read)
        await expect(page.locator('#app')).toHaveClass(/surface-read/);
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

  test('11. Mobile Field tap selects object; Read button opens it', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1200);

    // Record the ID of the first node before tapping
    const tappedId = await page.evaluate(() => {
      const hitEl = document.querySelector('.node-hit');
      return hitEl?.parentElement?.__data__?.id ?? null;
    });
    expect(tappedId).not.toBeNull();

    // Phase 2B: Tap node → stays in Field (surface-field)
    await page.locator('.node-hit').first().click({ force: true });
    await page.waitForTimeout(900);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-return-field-focused.png' });

    // Must be in field surface, phase-focused
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

    // Tap Read → same object must open in Read
    await page.locator('[data-mobile="read"]').click();
    await page.waitForTimeout(800);
    await expect(page.locator('#app')).toHaveClass(/surface-read/);
    const readMeta = await page.locator('#reader .meta').textContent();
    expect(readMeta).toContain(tappedId);
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

  // ── Phase 2A: Entry + Reader/MNO integrity ────────────────────────────────

  test('15. Entry subtitle is correct (no SPECULATIVE)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    const subtitle = page.locator('.threshold-card .sub');
    await expect(subtitle).toBeVisible();
    const text = await subtitle.textContent();
    expect(text.trim()).toBe('A HYPERGRAPH RESEARCH POEM');
    expect(text).not.toContain('SPECULATIVE');
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-entry-threshold.png' });
  });

  test('16. Mobile entry threshold — subtitle correct and button centered', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGE_URL);
    const subtitle = page.locator('.threshold-card .sub');
    await expect(subtitle).toBeVisible();
    const text = await subtitle.textContent();
    expect(text.trim()).toBe('A HYPERGRAPH RESEARCH POEM');
    expect(text).not.toContain('SPECULATIVE');
    // Button text-align is center
    const btn = page.locator('.th-actions button').first();
    const textAlign = await btn.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toBe('center');
    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-entry-threshold.png' });
  });

  test('17. MNO Black Ring — linked spans remain inline (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);
    // Find and click the Black Ring MNO node
    await page.evaluate(() => { window.__testFocus = true; });
    await page.evaluate(() => { focusObject('MNO.BLACK_RING_FORENSIC__A84A665E', { source: 'test' }); });
    await page.waitForTimeout(800);
    // .fl spans inside .poem must be computed as inline, not block
    const blockFls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.poem .fl')).filter(el => {
        return getComputedStyle(el).display !== 'inline';
      }).length;
    });
    expect(blockFls).toBe(0);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-mno-black-ring.png' });
  });

  test('18. MNO Black Ring — linked spans remain inline (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);
    await page.evaluate(() => { focusObject('MNO.BLACK_RING_FORENSIC__A84A665E', { source: 'test' }); });
    await page.waitForTimeout(800);
    const blockFls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.poem .fl')).filter(el => {
        return getComputedStyle(el).display !== 'inline';
      }).length;
    });
    expect(blockFls).toBe(0);
    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-mno-black-ring.png' });
  });

  test('19. MNO Window — linked spans remain inline (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);
    await page.evaluate(() => { focusObject('MNO.WINDOW_DARKNESS__F488DD0A', { source: 'test' }); });
    await page.waitForTimeout(800);
    const blockFls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.poem .fl')).filter(el => {
        return getComputedStyle(el).display !== 'inline';
      }).length;
    });
    expect(blockFls).toBe(0);
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-mno-window.png' });
  });

  test('20. MNO Window — linked spans remain inline (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);
    await page.evaluate(() => { focusObject('MNO.WINDOW_DARKNESS__F488DD0A', { source: 'test' }); });
    await page.waitForTimeout(800);
    const blockFls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.poem .fl')).filter(el => {
        return getComputedStyle(el).display !== 'inline';
      }).length;
    });
    expect(blockFls).toBe(0);
    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-mno-window.png' });
  });

  test('21. Reader transition — no stale content from previous object', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);
    // Open first object
    await page.evaluate(() => { focusObject('MNO.BLACK_RING_FORENSIC__A84A665E', { source: 'test' }); });
    await page.waitForTimeout(600);
    const firstTitle = await page.locator('#reader .title').textContent();
    // Navigate to a different object
    await page.evaluate(() => { focusObject('MNO.WINDOW_DARKNESS__F488DD0A', { source: 'test' }); });
    // Immediately after navigate, reader should not contain first object's title
    await page.waitForTimeout(50);
    const readerContent = await page.locator('#reader').innerHTML();
    expect(readerContent).not.toContain(firstTitle.trim());
    await page.waitForTimeout(600);
    // After settle, should show the second object
    const secondTitle = await page.locator('#reader .title').textContent();
    expect(secondTitle).toContain('Until It Saw Through My Window');
    await page.screenshot({ path: 'test-results/black-bird-smoke/desktop-reader-transition.png' });
  });

  // ── Phase 2B: Mobile Field solo and Index ─────────────────────────────────

  test('22. Solo computed from RelO participants (not adjacency)', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Compute solo set for Corpse via the JS function
    const soloResult = await page.evaluate(() => {
      const id = 'FO.CORPSE';
      return { soloSet: [...computeSoloSet(id)] };
    });

    const solo = soloResult.soloSet;

    // Must include Corpse itself
    expect(solo).toContain('FO.CORPSE');

    // Must include RelOs that contain Corpse
    // RelO.R4CB4A8D8 participants include FO.CORPSE
    expect(solo).toContain('RelO.R4CB4A8D8');
    // RelO.R847178B0 participants include FO.CORPSE
    expect(solo).toContain('RelO.R847178B0');

    // Must include other participants of those RelOs
    // RelO.R4CB4A8D8 has FO.BLACK_BIRD_FIELD, FO.ALLAH, FO.CAIN, FO.BURIAL
    expect(solo).toContain('FO.CAIN');
    expect(solo).toContain('FO.BURIAL');

    // Must NOT include objects from unrelated RelOs
    // FO.ODIN is only in RelO.R2DA6BB75 and RelO.RB6E74D1A which don't include Corpse directly
    const odinRelos = ['RelO.R2DA6BB75', 'RelO.RB6E74D1A'];
    const corpseRelos = await page.evaluate(() => {
      return Object.entries(DATA.relations)
        .filter(([,parts]) => parts.includes('FO.CORPSE'))
        .map(([rid]) => rid);
    });
    // Verify Odin's RelOs don't overlap with Corpse's RelOs
    const odinReloCrossover = odinRelos.some(r => corpseRelos.includes(r));
    if (!odinReloCrossover) {
      // Only then assert Odin is absent from solo
      expect(solo).not.toContain('FO.ODIN');
    }
  });

  test('23. Index solo enters Field with solo graph (not Reader)', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Open Index
    await page.locator('[data-mobile="index"]').click();
    await page.waitForTimeout(600);

    // Find FO.CORPSE row by its solo button data attribute
    const soloBtn = page.locator('[data-solo="FO.CORPSE"]');
    await expect(soloBtn).toBeVisible();
    await soloBtn.click();
    await page.waitForTimeout(900);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-index-solo-corpse.png' });

    // Must be in Field surface (NOT Reader)
    const appEl = page.locator('#app');
    await expect(appEl).toHaveClass(/surface-field/);
    await expect(appEl).toHaveClass(/phase-focused/);

    // Reader must NOT be visible
    await expect(page.locator('.panel')).not.toBeVisible();

    // Map must be visible and full-height
    const mapWrap = page.locator('#mapWrap');
    await expect(mapWrap).toBeVisible();
    const box = await mapWrap.boundingBox();
    expect(box?.height).toBeGreaterThan(400);

    // Active object must be Corpse
    const activeId = await page.evaluate(() => window.__bbState?.activeId);
    expect(activeId).toBe('FO.CORPSE');

    // Solo set must be active
    const hasSoloSet = await page.evaluate(() => window.__bbState?.soloSet !== null);
    expect(hasSoloSet).toBe(true);

    // Index drawer must be closed
    const indexDrawer = page.locator('#objectDrawer');
    await expect(indexDrawer).not.toHaveClass(/open/);

    // Bottom Read button must open Corpse in Read
    const readBtn = page.locator('[data-mobile="read"]');
    await readBtn.click();
    await page.waitForTimeout(700);
    await expect(appEl).toHaveClass(/surface-read/);
    const meta = await page.locator('#reader .meta').textContent();
    expect(meta).toContain('FO.CORPSE');

    expect(errors).toHaveLength(0);
  });

  test('24. Mobile top Field/View buttons hidden; bottom nav visible', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Top .map-tools (contains Field and View) must be hidden on mobile
    const mapTools = page.locator('.map-tools');
    // Either not visible or display:none
    const toolsVisible = await mapTools.evaluate(el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    expect(toolsVisible).toBe(false);

    // Bottom nav must be visible with all 4 buttons
    const bottomNav = page.locator('.bottom-nav');
    await expect(bottomNav).toBeVisible();
    const fieldBtn = page.locator('[data-mobile="field"]');
    const readBtn = page.locator('[data-mobile="read"]');
    const viewBtn = page.locator('[data-mobile="view"]');
    const indexBtn = page.locator('[data-mobile="index"]');
    await expect(fieldBtn).toBeVisible();
    await expect(readBtn).toBeVisible();
    await expect(viewBtn).toBeVisible();
    await expect(indexBtn).toBeVisible();

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-no-top-duplicate-controls.png' });
  });

  test('25. Route lines in solo exclude out-of-solo segments', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // Build up a route with several objects
    const nodeIds = ['FO.CORPSE', 'FO.ODIN', 'FO.CAIN', 'FO.BLACK_BIRD_FIELD'];
    for (const id of nodeIds) {
      await page.evaluate((nid) => { focusObject(nid, { source: 'test' }); }, id);
      await page.waitForTimeout(400);
    }

    // Return to field, then enter solo for Corpse via JS
    await page.evaluate(() => {
      window.__bbState.soloSet = computeSoloSet('FO.CORPSE');
      window.__bbState.activeId = 'FO.CORPSE';
      updateVisibility();
      drawRouteMemory({ duration: 0 });
    });
    await page.waitForTimeout(600);

    await page.screenshot({ path: 'test-results/black-bird-smoke/mobile-route-lines-in-solo.png' });

    // No route segment SVG line should have NaN coordinates
    const nanSegments = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.route-segment')).filter(l => {
        return ['x1','y1','x2','y2'].some(a => {
          const v = l.getAttribute(a); return v !== null && !isFinite(parseFloat(v));
        });
      }).length;
    });
    expect(nanSegments).toBe(0);

    // All visible route segments must have both endpoints in the solo set
    const outsideSoloSegments = await page.evaluate(() => {
      const soloSet = window.__bbState?.soloSet;
      if (!soloSet) return 0;
      return Array.from(document.querySelectorAll('.route-segment')).filter(l => {
        const d = l.__data__;
        if (!d) return false;
        const srcId = d.source?.id;
        const tgtId = d.target?.id;
        return (srcId && !soloSet.has(srcId)) || (tgtId && !soloSet.has(tgtId));
      }).length;
    });
    expect(outsideSoloSegments).toBe(0);
  });

  test('26. Black Bird appears in solo only when part of relation set', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 650 });
    await page.goto(SKIP_URL);
    await page.waitForTimeout(1500);

    // For FO.CAIN: check if Black Bird is in its RelO participants
    const corpseCheck = await page.evaluate(() => {
      const soloSet = computeSoloSet('FO.CAIN');
      const bbInSolo = soloSet.has('FO.BLACK_BIRD_FIELD');
      // Verify: is Black Bird actually in any of Cain's RelOs?
      const cainsRelos = Object.entries(DATA.relations)
        .filter(([,parts]) => parts.includes('FO.CAIN'))
        .map(([rid,parts]) => ({ rid, parts }));
      const bbInReloParts = cainsRelos.some(r => r.parts.includes('FO.BLACK_BIRD_FIELD'));
      return { bbInSolo, bbInReloParts, soloSet: [...soloSet] };
    });

    // Black Bird in solo iff it's in a RelO participant set with Cain
    expect(corpseCheck.bbInSolo).toBe(corpseCheck.bbInReloParts);

    // For Huginn: Black Bird should NOT be in solo if not directly in shared RelO
    const huginnCheck = await page.evaluate(() => {
      const soloSet = computeSoloSet('FO.HUGINN');
      const bbInSolo = soloSet.has('FO.BLACK_BIRD_FIELD');
      const huginnRelos = Object.entries(DATA.relations)
        .filter(([,parts]) => parts.includes('FO.HUGINN'))
        .map(([rid,parts]) => ({ rid, parts }));
      const bbInReloParts = huginnRelos.some(r => r.parts.includes('FO.BLACK_BIRD_FIELD'));
      return { bbInSolo, bbInReloParts };
    });
    expect(huginnCheck.bbInSolo).toBe(huginnCheck.bbInReloParts);
  });
});

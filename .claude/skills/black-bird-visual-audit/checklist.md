# Black Bird Visual Audit Checklist

## Viewports

| Name         | Width | Height |
|---|---|---|
| mobile       | 390   | 844    |
| short-phone  | 375   | 667    |
| desktop      | 1440  | 900    |

Mobile UA: `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1`
Desktop UA: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36`

## Exact node targeting

Never use label text to locate graph nodes. Always use D3 `__data__` on `g.node` elements:

```js
// Find and click exact node
const nodes = [...document.querySelectorAll('g.node, g[class*="node"]')];
for (const g of nodes) {
  if (g.__data__ && g.__data__.id === 'FO.ALLAH') {
    g.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    break;
  }
}
```

Node IDs to target:
- `FO.ALLAH`
- `FO.CORPSE`
- `FO.BLACK_BIRD_FIELD`
- `MNO.BLACK_RING_FORENSIC__A84A665E`
- `MNO.WINDOW_DARKNESS__F488DD0A`

## Exact solo targeting

Never use fuzzy row matching. Always use `[data-solo="<id>"]`:

```js
document.querySelector('[data-solo="FO.CORPSE"]').click();
document.querySelector('[data-solo="FO.ALLAH"]').click();
document.querySelector('[data-solo="FO.ODIN"]').click();
document.querySelector('[data-solo="FO.GOD"]').click();
```

## State assertion before every screenshot

Read `window.__bbState` before each shot:

```js
const s = window.__bbState;
// record: s.phase, s.surface, s.activeId, s.soloSet, s.overlay
```

Also check visibility:
```js
// panel visible
const panel = document.querySelector('.panel, #panel, [class*="panel"]');
const panelVis = panel && panel.getBoundingClientRect().width > 0;

// mapWrap visible
const map = document.querySelector('#mapWrap, .map-wrap, #map');
const mapVis = map && map.getBoundingClientRect().width > 0;
```

## Surface contract (final — post Phase 2B)

- node tap stays in Field (`surface=field`)
- no preview sheet required or expected
- bottom Read opens active object (`surface=read`)
- Index solo goes directly to Field (`surface=field`)

## Onboarding gate

Do NOT take field screenshots until:
- `window.__bbState.phase === 'focused'`
- `window.__bbState.activeId === 'FO.BLACK_BIRD_FIELD'`
- `.bottom-nav` is visible

Poll with 300ms intervals, 20s timeout.

## Screenshot flows

### Mobile 390×844

| Screenshot | Flow |
|---|---|
| `audit-mobile-entry.png` | threshold before Enter |
| `audit-mobile-nav.png` | after onboarding, check `.map-tools` hidden, `.bottom-nav` visible |
| `audit-mobile-allah-field.png` | after exact `FO.ALLAH` tap, assert surface=field |
| `audit-mobile-allah-read.png` | after bottom Read |
| `audit-mobile-corpse-field.png` | after exact `FO.CORPSE` tap, assert surface=field |
| `audit-mobile-corpse-read.png` | after bottom Read |
| `audit-mobile-solo-corpse.png` | after `[data-solo="FO.CORPSE"]` click, assert surface=field, activeId=FO.CORPSE |
| `audit-mobile-solo-corpse-read.png` | after Read from solo Corpse |
| `audit-mobile-solo-allah.png` | after `[data-solo="FO.ALLAH"]`, assert surface=field |
| `audit-mobile-solo-odin.png` | after `[data-solo="FO.ODIN"]`, assert surface=field |
| `audit-mobile-solo-god.png` | after `[data-solo="FO.GOD"]`, assert surface=field |
| `audit-mobile-mno-black-ring.png` | exact MNO node tap + Read |
| `audit-mobile-mno-window.png` | exact MNO node tap + Read |

### Mobile 375×667

| Screenshot | Flow |
|---|---|
| `audit-short-phone-field.png` | after onboarding |
| `audit-short-phone-read.png` | after Allah Read |

### Desktop 1440×900

| Screenshot | Flow |
|---|---|
| `audit-desktop-entry.png` | threshold |
| `audit-desktop-field.png` | after onboarding, assert panel=true AND mapWrap=true |
| `audit-desktop-mno-black-ring.png` | exact MNO node + reader open |
| `audit-desktop-mno-window.png` | exact MNO node + reader open |

## Issue classification

| Class | Meaning |
|---|---|
| reliable blocker | State assertion failed, wrong node activated, wrong surface, missing content |
| visual concern | Content correct, state correct, but layout/spacing/clipping is suboptimal |
| audit limitation | Could not test (network unreachable, environment constraint) |
| no issue | State and visual both pass |

## Known non-blocking concerns (do not flag as blockers)

From audit v2 (2026-06-26):
1. Solo sub-graphs sit in lower-center of mobile viewport — empty upper space
2. Dense label collision in solo views (tight but legible)
3. Corpse Read last RelO row partially clipped by bottom nav
4. Desktop full-field graph compact on large canvas

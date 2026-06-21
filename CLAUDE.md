# CLAUDE.md — The Black Bird

## Project identity

The Black Bird is a single-file D3/SVG speculative research poem interface. It is not a dashboard, product app, normal article, or generic graph explorer.

Core design principle: the interface should stage encounters with objects without explaining them away. Objects remain partial. Relations do not become conclusions. The route is a temporal history of focus changes, not an argument and not a breadcrumb.

## Current priority

Finish a stable nightly build before any large refactor.

Do not migrate to Vite, TypeScript, React, Svelte, or any other stack unless the user explicitly asks in a later round. The current working artifact is a single HTML file.

## Working rules for Claude Code

Use small scoped rounds. Do not make broad improvements. Do not fix unrelated things.

For each round:
1. Inspect the repo.
2. State the current main HTML file you found.
3. State the planned changes before editing.
4. Edit only the files allowed in the prompt.
5. Run the requested checks/tests.
6. Update `BLACK_BIRD_DECISIONS_CHANGELOG.md`.
7. Summarize files changed, commands run, and remaining uncertainty.

## Forbidden unless explicitly requested

- Do not rewrite the whole application.
- Do not split the single HTML file into modules yet.
- Do not change the object ontology: `RNO`, `MNO`, `FO`, `NameO`, `RefO`, `RelO`.
- Do not add representational icons for object types.
- Do not restore visible lens presets such as Poem, Research, Names, Sources, Relations, or Density.
- Do not reintroduce cluster labels such as burial, ravens, death, gathering, or window.
- Do not add documentation panels into the first onboarding flow.
- Do not make the graph a normal dashboard.
- Do not stack drawers, sheets, previews, and panels on top of each other.
- Do not change poem/research text unless the user directly asks.

## Interaction model

Think in governed states:

- `phase`: `threshold`, `onboarding`, `field`, `focused`
- `viewport`: `desktop`, `mobile`
- `surface`: `field`, `read`
- `overlay`: `null`, `view`, `index`, `sources`, `route`, `nodeSheet`, `edgeSheet`
- `activeId`: current focused object or `null`
- `routeEvents`: bounded sequence of committed focus events

Invalid combinations should be prevented. Examples:

- During `threshold`, no drawer, sheet, reader, or route should be active.
- During `onboarding`, graph-only field should be active; no reader and no route strip.
- On mobile `surface='field'`, graph owns the screen and gestures.
- On mobile `surface='read'`, reader owns the screen and scrolling.
- Only one overlay may be open at a time.

## Desktop flow

Desktop should keep graph + reader split after first focus.

Opening sequence:
1. Threshold.
2. Enter.
3. Graph-only onboarding sentences.
4. Black Bird becomes the first focus.
5. Reader pane enters.
6. Route begins.

Field action:
- Clears active focus.
- Keeps route memory.
- Keeps reader shell available on desktop.
- Fits the whole visible graph reliably.

## Mobile flow

Mobile must not be compressed desktop.

Mobile Field mode:
- Graph is the main surface.
- Reader hidden.
- Graph pan/zoom active.
- Node tap opens a preview sheet.
- Enter from sheet commits focus and moves to Read.

Mobile Read mode:
- Reader is the main surface.
- Graph hidden or visually secondary.
- Reader scrolls vertically.
- Bottom nav remains available.
- Read button should visibly switch to reader surface if an object is active.

## Route

Route is focus-history.

Rules:
- Hover/touch does not write to route.
- Enter/focus writes to route.
- Repeated objects are allowed and meaningful.
- Route may use an aperture in the top strip, with full route in a drawer.
- Route memory in graph is a temporal trace, not an ontological edge.

## Dense graph areas

Density is meaningful at distance, but should not block interaction.

Use local aperture behavior rather than permanent spacing:
- On focus, direct neighbors may breathe outward temporarily.
- Non-neighbors dim.
- Returning to Field closes the aperture.
- Do not make local aperture look like a new ontology.

## Testing priority

Use Playwright for smoke testing. Prefer Chromium only unless asked otherwise.

Tests should prefer resilient locators, behaviour checks, screenshots, console/page error capture, and bounding-box evidence. Avoid brittle pixel-perfect assertions.

Use `TESTING_REPORT.md` for results.

## Required project log

Always update `BLACK_BIRD_DECISIONS_CHANGELOG.md` after any change.

Every changelog entry should include:
- date/time if easy,
- base file,
- decision,
- changed files,
- commands run,
- known risks.

# QA Checklist — The Black Bird

Use this checklist for manual and automated review before any release.

## Threshold

- [ ] Threshold screen loads with Enter button visible
- [ ] No graph, reader, route, or overlays visible during threshold
- [ ] No console errors on load

## Onboarding

- [ ] Enter click transitions to onboarding (graph only, no reader)
- [ ] Onboarding sentences appear and complete
- [ ] No drawers, sheets, or route strip visible during onboarding

## Black Bird first focus

- [ ] Black Bird auto-focuses after onboarding
- [ ] Reader pane enters and shows Black Bird content
- [ ] Route strip shows Black Bird as first event
- [ ] Black Bird node has at least 80 px left margin, 110 px top margin in graph viewport

## Field refit

- [ ] Field button returns to graph-only view (desktop: reader shell remains)
- [ ] All nodes visible in viewport after Field refit (≥ 85% coverage)
- [ ] Field does not clear route memory

## Mobile Field surface

- [ ] Graph fills screen; reader is hidden
- [ ] Pan and zoom gesture active
- [ ] Bottom nav visible (Field / Read buttons)
- [ ] Node tap opens preview sheet

## Mobile Read surface

- [ ] Reader fills screen after switching from Field
- [ ] Graph hidden or secondary
- [ ] Reader scrolls vertically
- [ ] Bottom nav remains visible

## Overlays

- [ ] Only one overlay open at a time
- [ ] Opening a second overlay replaces the first
- [ ] Overlay closes cleanly on dismiss

## Reader scroll

- [ ] Reader content scrollable when content exceeds viewport height
- [ ] Scroll position resets on new focus

## Route

- [ ] Hover/touch does not write to route
- [ ] Enter/focus writes to route
- [ ] Consecutive same-object focuses produce a single route entry (deduplication)
- [ ] Repeated different objects each appear in route

## Console errors

- [ ] No page errors in any scenario
- [ ] No NaN SVG attribute errors
- [ ] Only expected noise: favicon 404

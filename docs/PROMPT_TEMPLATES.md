# Prompt Templates — The Black Bird

Short templates for common Claude Code rounds. Copy and adapt as needed.

---

## Plan only

```
Inspect the repo. State the current main HTML file. Propose a plan for [GOAL].
Do not edit any files. List changed files, risks, and open questions.
```

---

## Implement approved plan

```
The plan is approved. Implement [GOAL] against index.html only.
Do not change object data, ontology, poem/research text, or visual design.
Run npm test after edits. Update BLACK_BIRD_DECISIONS_CHANGELOG.md.
Report: files changed, commands run, test summary, remaining risks.
```

---

## Visual QA

```
Open index.html in a headed browser. Walk through:
threshold → enter → onboarding → Black Bird focus → Field refit.
Report what you see at each step. Capture screenshots. Note any layout issues.
Do not edit files unless directed.
```

---

## Mobile surface bug

```
On mobile viewport (400×650), [DESCRIBE BUG — e.g. "Field button does not switch to graph"].
Inspect index.html. Identify the cause. Propose a minimal fix.
Do not change desktop layout, object data, or text.
```

---

## Dense aperture

```
After focusing [NODE NAME], describe the local aperture behavior:
which neighbors breathe outward, how many nodes are individually selectable,
and whether any overlap blocks interaction.
Propose a targeted CSS/JS change if separation is below 4 non-overlapping nodes.
```

---

## Deployment check

```
Confirm index.html is self-contained and deployable:
- All assets inlined or loaded from CDN with a local fallback
- No broken references
- npm test passes
- No console errors on load
Report pass/fail for each item.
```

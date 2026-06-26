---
name: black-bird-task-plan
description: Generate a narrow implementation work order before coding. Takes a problem statement and produces a scoped plan. Does not implement anything.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
effort: medium
---

# Black Bird Task Plan

No writes. No edits. Plan output only.

## Usage

```
/black-bird-task-plan <problem statement>
```

Example:
```
/black-bird-task-plan solo subgraph sits in lower-center of mobile viewport leaving empty upper space
```

## Steps

### 1. Understand the problem

Read the problem statement. Do not expand scope. Do not propose unrelated improvements.

### 2. Locate relevant code

Search `index.html` for functions related to the stated problem:
```bash
grep -n "fitFocusFrame\|soloSet\|aperture\|solo\|fit\|zoom\|center" index.html | head -40
```

Read the surrounding function bodies to understand the current approach.

### 3. Inspect test coverage

```bash
grep -n "solo\|fit\|center" tests/black-bird-smoke.spec.js | head -20
```

### 4. Check changelog

```bash
tail -80 BLACK_BIRD_DECISIONS_CHANGELOG.md
```

## Output format

```
TASK PLAN
=========
problem:
  <1–3 sentence summary of the problem>

must not change:
  - index.html artwork/prose/ontology
  - tests/ (unless adding new coverage)
  - package.json / package-lock.json
  - test-results/ screenshots (except expected new baselines)
  - <any other relevant forbidden items>

allowed files:
  - index.html (scoped to: <exact function names>)
  - tests/black-bird-smoke.spec.js (only if new test needed)
  - BLACK_BIRD_DECISIONS_CHANGELOG.md (required update)
  - TESTING_REPORT.md (required update)

forbidden files:
  - <specific files to leave untouched for this task>

branch name:
  claude/<short-slug>

PR title:
  <title>

implementation objective:
  <exactly what to change and why — one paragraph, no ambiguity>

exact code target:
  <file>:<line range or function name>

tests to add/update:
  <test name or "none if existing coverage is sufficient">

visual screenshots required:
  <list from visual audit checklist, or "none">

self-audit checklist:
  [ ] test:data passes
  [ ] no forbidden files changed
  [ ] no ontology/prose changed
  [ ] no dependency files changed
  [ ] changelog updated
  [ ] visual audit run if UI changed

merge policy:
  One PR. Small scope. Do not bundle unrelated fixes.
  Run /black-bird-pr-review before merge.
  Run /black-bird-live-check <sha> after merge.
```

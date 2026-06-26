---
name: black-bird-pr-review
description: Review current branch or a PR number before merge. Checks scope drift, forbidden files, dependency changes, ontology/prose drift, stale reports, and CI status. No writes.
disable-model-invocation: true
context: fork
agent: black-bird-pr-reviewer
allowed-tools: Bash, Read, Grep, Glob
effort: medium
---

# Black Bird PR Review

No writes. No edits. Report and verdict only.

## Usage

```
/black-bird-pr-review           # reviews current branch vs main
/black-bird-pr-review 12        # reviews PR #12 (requires gh)
```

## Checks

### 1. Branch and changed files

```bash
git branch --show-current
git log --oneline main..HEAD
git diff --name-only main...HEAD
```

### 2. Forbidden file check

Flag (do not auto-fix) if any changed file matches:
- `index.html`
- `package.json` / `package-lock.json`
- `tests/**`
- `test-results/**`
- `vendor/**`
- `.github/workflows/**`
- any `*.html` that is not listed in the PR as intentionally changed

### 3. Dependency drift

```bash
git diff main...HEAD -- package.json package-lock.json
```
Flag any added/removed/changed dependencies.

### 4. Ontology and prose drift

```bash
git diff main...HEAD -- index.html | grep -E '"RNO\.|"MNO\.|"FO\.|"NameO\.|"RefO\.|"RelO\.' | head -20
git diff main...HEAD -- index.html | grep -E '"body":|"label":' | head -20
```
Flag any changes to node labels, prose bodies, or relation definitions unless the PR explicitly states ontology changes were approved.

### 5. Stale claims check

Read `BLACK_BIRD_DECISIONS_CHANGELOG.md` and `TESTING_REPORT.md` if they exist.
Check whether the PR body (if available) makes claims about test results, screenshot baselines, or bug fixes that differ from what the changelog and test report show.

### 6. Data validation

```bash
npm run test:data
```
Must PASS. If FAIL, block merge.

### 7. CI status (if `gh` available)

```bash
gh pr checks <number> 2>/dev/null || gh run list --limit 5 2>/dev/null
```
Report any failing workflow runs. If `gh` is unavailable, note it.

### 8. PR body review (if PR number supplied)

```bash
gh pr view <number> 2>/dev/null
```
Check:
- Does the PR body accurately describe what changed?
- Are forbidden files mentioned without justification?
- Are test results or screenshot states described accurately?

## Output format

```
PR REVIEW REPORT
================
branch:           <name>
head SHA:         <sha>
commits vs main:  <N>
changed files:    <list>

CHECKS
------
forbidden files:        none / FLAGGED: <list>
dependency changes:     none / FLAGGED: <diff>
ontology/prose drift:   none / FLAGGED: <details>
stale claims:           none / FLAGGED: <details>
test:data:              PASS / FAIL
CI status:              passing / failing / unavailable

VERDICT
-------
merge-ready: yes / no
blocker:     <exact reason if no>
action:      <what to ask Claude to fix, if anything>
```

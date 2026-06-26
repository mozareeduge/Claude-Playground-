---
name: black-bird-preflight
description: Manual preflight check before any implementation or audit. Reports only — never fixes anything.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
effort: low
---

# Black Bird Preflight

Report the following. Do not fix anything. Do not write files.

## 1. Branch and commit

```bash
git branch --show-current
git log --oneline -1
git rev-parse HEAD
git status --short
```

Report:
- current branch
- HEAD SHA (full)
- whether branch is ahead/behind origin
- dirty working tree (yes/no)

## 2. Changed files since main

```bash
git diff --name-only main...HEAD 2>/dev/null || git diff --name-only origin/main...HEAD 2>/dev/null
```

Flag any changes to:
- `index.html` — artwork/app, must not change without explicit instruction
- `package.json` / `package-lock.json` — dependency files
- `tests/**` — test files
- `test-results/**` — screenshot baselines
- files matching `*.html` other than index.html
- any file matching patterns in the forbidden list in CLAUDE.md

## 3. Available npm scripts

```bash
node -e "const p=require('./package.json'); Object.entries(p.scripts||{}).forEach(([k,v])=>console.log(k+': '+v))"
```

## 4. Data integrity

```bash
npm run test:data
```

Report: PASS / FAIL. If FAIL, print full output.

## 5. Live Pages check (optional)

If a cache-bust SHA is supplied as an argument (e.g. `/black-bird-preflight abc1234`):
- construct URL: `https://mozareeduge.github.io/Claude-Playground-/?v=<sha>`
- attempt: `curl -s -o /dev/null -w "%{http_code}" --max-time 8 "<url>"`
- if http_code is 200: report "Pages reachable"
- if connection refused / timeout / non-200: report exactly why; do not claim live verification passed

If no SHA supplied, skip live check and note it was skipped.

## Output format

```
PREFLIGHT REPORT
================
branch:         <name>
HEAD SHA:       <full sha>
vs origin/main: <ahead N / behind N / up to date>
dirty tree:     yes / no
changed files:  <list or "none">

flags:
  index.html changed:      yes / no
  package files changed:   yes / no
  test files changed:      yes / no
  baseline screenshots:    yes / no

npm scripts:    <list>
test:data:      PASS / FAIL

live check:     skipped / PASS / FAIL <reason>
```

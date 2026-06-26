---
name: black-bird-live-check
description: Check GitHub Pages deployment status and live URL reachability after a merge. Never equates local tests with live verification.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
effort: low
---

# Black Bird Live Check

No writes. Report only.

## Usage

```
/black-bird-live-check                  # uses current main HEAD SHA
/black-bird-live-check abc1234          # uses supplied SHA
```

## Steps

### 1. Determine SHA

If a SHA argument was supplied, use it.  
Otherwise:
```bash
git log --oneline -1 origin/main
```

### 2. Construct URL

```
https://mozareeduge.github.io/Claude-Playground-/?v=<sha>
```

### 3. GitHub Actions / deployment check

```bash
gh run list --workflow=playwright-smoke.yml --limit 5 2>/dev/null
gh run list --limit 5 2>/dev/null
```
Report: latest run status, SHA, timestamp.  
If `gh` unavailable, note it.

### 4. HTTP reachability

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 10 "<url>"
```

- 200 → Pages serving
- non-200 / timeout → state exact error; do not claim live verification passed
- `ERR_CONNECTION_REFUSED` / tunnel blocked → state "Live URL unreachable from this environment. Pages status unverified."

### 5. Source token check (only if reachable)

```bash
curl -s --max-time 15 "<url>" | grep -c "THE BLACK BIRD" 2>/dev/null
```
If count > 0: report "Expected content token found."  
If 0 or unreachable: do not claim content verified.

## Verification tiers

Report each tier separately. Never collapse them:

| Tier | What it confirms |
|---|---|
| source verified | `git log` shows correct SHA on main |
| GitHub Actions verified | `gh run list` shows passing CI for that SHA |
| Pages deployment verified | HTTP 200 from the cache-bust URL |
| live browser behavior verified | Playwright or manual test against the live URL — NOT this skill |

## Output format

```
LIVE CHECK REPORT
=================
sha:                    <full sha>
url:                    https://mozareeduge.github.io/Claude-Playground-/?v=<sha>

source verified:        yes
gh actions verified:    yes / no / unavailable
pages http status:      200 / <error>
pages deployment:       verified / unverified (<reason>)
content token found:    yes / no / untested

NOTE: Live browser behavior is NOT verified by this skill.
      Run /black-bird-visual-audit against the live URL for full verification.
```

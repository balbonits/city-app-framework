---
description: Approve how the pages look now as the baseline. After that, /city-app:ui:check (and npm test, when it runs the UI checks) fails when a page looks different, naming the page and screen size, with a diff image. Use after a visual change the human wanted.
argument-hint: "[--pages=/,/about]"
allowed-tools: Bash(node *), Read, Glob, Grep, Edit
---

# Approve the UI baseline

Arguments: $ARGUMENTS

## 1. Save the baseline

Run the UI check with `--approve`, for every page, or only the pages in the arguments. Use the same `--start` and `--url` as `/city-app:ui:check`:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/ui-check.mjs" --approve --start 'PORT={port} npm start' --url 'http://localhost:{port}' --pages <pages>
```

If the project has its own `scripts/ui-check.mjs` (from `--add-test`), the same flags work there. It saves one screenshot per page and screen size to `.ui-baselines/`.

## 2. Keep it out of git

Screenshots differ between machines (fonts, rendering), so make sure `.ui-baselines/` is in `.gitignore`, unless the human wants to share them.

## 3. Report

Show the human the saved screenshots, and tell them: from now on a page that looks different fails the UI check with a diff image, and after a change they wanted, run this again.

Approve only what the human asked for, or the pages you changed on purpose while doing what they asked. Never approve just to make a failing check pass; if a page changed that you didn't mean to change, find out why.

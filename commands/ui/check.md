---
description: Check the pages you changed for accessibility problems, console errors, and layouts wider than the screen, at phone, tablet and desktop sizes. Pass/fail checks with fix-it messages, plus screenshots. Use after UI changes. --add-test makes npm test run them, so the finish gate enforces them.
argument-hint: "[--pages=/,/about] [--add-test]"
allowed-tools: Bash(node *), Bash(npm test *), Bash(npx playwright install *), Read, Glob, Grep, Edit, Write
---

# Check the UI

Arguments: $ARGUMENTS

## 1. Make sure the tools are there

The checks need `playwright` and `axe-core` as dev dependencies. If `package.json` doesn't list them, say why they're needed and run `npm install --save-dev playwright axe-core`; the guard shows the human an Allow/Deny prompt for new packages. If the browser is missing, run `npx playwright install chromium`.

## 2. Pick the pages and the server

- **Pages:** the ones your change touched, from `git diff` (routes, HTML files, components a page uses). If the arguments list pages (`--pages=/,/about`), use those. If unsure, check `/`.
- **Server:** the script that serves the app, from `package.json` (`dev`, `start` or `preview`). Write `{port}` where the port goes and the script picks a free one: `--start 'npm run dev -- --port {port}' --url 'http://localhost:{port}'` for Vite, or `--start 'PORT={port} npm start' --url 'http://localhost:{port}'`. If the human already has the app running, pass only `--url`.

## 3. Run the checks

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/ui-check.mjs" --start '<command>' --url <url> --pages <pages>
```

If the project already has `test/ui.test.js` (from `--add-test`), `npm test` runs the same checks. Each ✗ line names the page, the problem and how to fix it; `[phone]` means it only happens at that size. Look at the screenshots it lists too: the checks catch broken things, not ugly ones.

Fix what it finds in the code, not in the check: don't silence errors, don't add `aria-hidden` to dodge a rule, don't remove content. Run it again until it passes. If a finding looks wrong, tell the human instead.

## 4. Make it stick (`--add-test`)

With `--add-test`, or when the human wants every change checked, put the checks in `npm test` so the finish gate runs them:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/ui-check.mjs" --add-test --start '<command>' --url <url> --pages <every page>
```

It copies the script to `scripts/ui-check.mjs` and adds `test/ui.test.js`, never overwriting. If the project's tests use Vitest or Jest instead of `node --test`, write the same test in that runner. Run `npm test` once to confirm.

Finish with what passed, what you fixed, and anything in the screenshots the human should look at.

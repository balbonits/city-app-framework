---
description: Check that every color comes from a design token (var(--name)) instead of being written out in CSS, inline styles or element.style. Fails with file:line fix-it messages. --add-test puts it in npm test, so the finish gate enforces it.
argument-hint: "[--add-test]"
allowed-tools: Bash(node *), Bash(npm test *), Read, Glob, Grep, Edit, Write
---

# Check design tokens

Arguments: $ARGUMENTS

Colors may only be written out where a token is defined (a custom property such as `--danger: #b3261e`, usually in `:root`). Everywhere else they come from `var(--danger)`. That keeps themes, dark mode and contrast fixes in one place.

## 1. Run the check

From the project root:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/tokens-check.mjs"
```

It reads CSS files, `style` attributes in markup, and `element.style` in scripts. It skips `node_modules`, build output, tests and top-level `scripts/`.

## 2. Fix what it finds

For each line it reports, use an existing token that matches. If none does, add one to the tokens (for example in `:root`, and in the dark theme too if there is one), then use it. Check that text colors still have enough contrast (`/city-app:ui:check` tests that). Don't hide colors from the check with tricks such as building color strings at runtime.

## 3. Make it stick (`--add-test`)

With `--add-test`, or when the human wants it enforced, put the check in `npm test`:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/tokens-check.mjs" --add-test
```

It copies the script to `scripts/tokens-check.mjs` and adds `test/tokens.test.js`, never overwriting. If the project's tests use Vitest or Jest instead of `node --test`, write the same test in that runner. Run `npm test` once, then say what you fixed.

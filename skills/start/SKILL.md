---
description: Start a new app or feature from a short spec, tests first. Saves the spec to docs/spec.md, turns each requirement into a failing acceptance test, then builds until they all pass. Use when the human describes something new to build in a few sentences ("build me...", "start a...").
argument-hint: "[--tests-only] [the spec, in a few sentences]"
---

# Start from a spec, tests first

The spec: $ARGUMENTS (if empty, use what the human just asked for).

A few sentences are enough for today's agents to build a small app (tested: 4 of 4 runs). What's missing is proof. This turns the spec into acceptance tests before any code, so "done" means the tests pass, and the finish gate holds the build to them.

## 1. Write the spec down

Save `docs/spec.md` with the spec as the human gave it, then a **Requirements** list: one line per checkable requirement (commands or screens, inputs, outputs, formats, ordering, edge cases the spec states). Don't add features the spec doesn't ask for. If something important is unclear, take the simplest reading and list it under **Assumptions**.

## 2. Write failing acceptance tests

Write one test per requirement in `test/acceptance.test.js` (or the project's own test folder and runner), named after the requirement. Test through the real entry point (run the CLI, call the public function, load the page), not internals. Then run `npm test` and check that each one fails because the feature is missing, not because of a mistake in the test.

If the arguments include `--tests-only`, stop here: show the human the requirements and the failing tests.

## 3. Build until they pass

Write the smallest code that makes every acceptance test pass. Don't change an acceptance test to make it pass; if one looks wrong, say so. Add unit tests for tricky logic as usual, and run `npm test` at the end.

## 4. Report

Say which requirements pass, any assumptions you made, and where the spec and tests live.

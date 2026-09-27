---
description: Set up this project for AI coding agents. Installs AGENTS.md (with CLAUDE.md importing it) and the safety hooks, then fills AGENTS.md from what the repo shows. Safe to re-run; never overwrites existing files. Use --check to only report what's missing.
disable-model-invocation: true
argument-hint: "[--check]"
allowed-tools: Bash(node *), Bash(npm test *), Read, Glob, Grep, Edit
---

# Set up this project

Arguments: $ARGUMENTS

If the arguments include `--check`, only run this from the project root, show the human its output, and stop without changing anything:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/install.mjs" . --check
```

Otherwise, do the steps below.

## 1. Install the kit

From the project root, run:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/install.mjs" .
```

It adds whatever is missing: `AGENTS.md`, `CLAUDE.md` (a single `@AGENTS.md` line, so Claude loads AGENTS.md), and two hooks in `.claude/` (a guard that asks the human before new dependencies or deleting tests, and blocks force-push and deploys; a gate that won't let an agent finish while `npm test` fails). It never overwrites a file; it merges its hooks into an existing `.claude/settings.json` and adds `@AGENTS.md` to an existing `CLAUDE.md`.

If the command fails (for example, the shell is unavailable or blocked), stop and tell the human what failed. Don't recreate the kit files by hand: a half-installed kit looks set up but isn't.

## 2. Fill in AGENTS.md

Only if it still has `{{...}}` placeholders. Read `package.json`, the README, config files (`vite.config.*`, `tsconfig.json`, `.nvmrc`, `.env.example`) and the top-level folders. Then:

- **Title and first line:** the project name and one sentence on what it is, from `package.json` or the README.
- **Commands:** the real scripts (dev, test, build, lint, typecheck) with a few words each. If there is no `test` script, say so: the finish gate needs one.
- **Layout:** only what the tree doesn't make obvious (generated folders not to edit, where state or API clients live). Delete the section if there's nothing.
- **Gotchas:** things an agent would get wrong: required env vars, the Node version, path aliases, unwritten rules you can see in the code. Leave the placeholder hint if you found none.

Keep the file under about 40 lines. Don't restate what a linter or formatter already enforces. Leave the "Working agreement" section as it is.

## 3. Check it works

- Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/install.mjs" . --check`. Every line should say `ok`; fix anything that says `missing`.
- Run `npm test` once. If it fails now, tell the human: the gate will block every finish until tests pass.

## 4. Report

In 3-5 lines: files added or updated, what you filled in, anything the human should check. Suggest committing the files so every session, local or cloud, gets them. Mention that `/city-app:lesson` turns future corrections into tests or rules.

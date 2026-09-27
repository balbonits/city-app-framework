---
description: Re-test the AGENTS.md rules saved by /city-app:rules:test, for example after a model update, and cut the ones the agent no longer needs. Shows the plan first and runs nothing until you say yes.
argument-hint: "[--runs=3] [--full] [--model=<id>]"
disable-model-invocation: true
allowed-tools: Bash(node *), Bash(npm test *), Read, Glob, Grep
---

# Prune rules

Arguments: $ARGUMENTS

A rule that made a difference on one model can be dead weight on the next. This re-runs each saved rule's task without the rule. If the agent now gets it right anyway, the rule is a candidate to cut.

## 1. Show the plan (free)

From the project root, run the script without `--yes`. It starts no sessions: it lists the saved rules with their last results, the Gotchas lines that were never tested, and how many test sessions a real run takes.

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/rules-prune.mjs" --runs 3
```

Add `--full` to re-test both with and without each rule (twice the sessions), or `--model <id>` to test a specific model. Show the human the output. If no rules are saved yet, suggest `/city-app:rules:test` for the rules that matter most, and stop.

## 2. Ask before running

Ask with this sentence, filling in the number from the plan: "This is going to use a lot of your usage (N test sessions). Are you sure you're okay with it?" Never mention prices. Then stop and wait for a yes.

## 3. Run, then suggest cuts

After a yes, run the same command with `--yes` added. When it finishes, show the human each rule's result and suggestion in plain words: cut it, keep it, make it a test instead (`/city-app:lesson`), or unclear.

## 4. Cut only what the human approves

Ask which suggested cuts to make. For each approved one, run:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/rules-prune.mjs" --cut '<rule>'
```

It removes the line from its file and marks the rule as cut in `docs/rule-tests.json`. Run `npm test` once, then say what was cut and how many test sessions ran, in one or two sentences.

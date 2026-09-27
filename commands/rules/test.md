---
description: A/B-test one AGENTS.md rule on this project. Runs the same small task with and without the rule in throwaway copies and scores each run with a check command, so you know whether the rule changes what the agent does. Shows the plan first and runs nothing until you say yes.
argument-hint: "[rule text] [--task=\"...\"] [--check=\"...\"] [--runs=3]"
disable-model-invocation: true
allowed-tools: Bash(node *), Read, Glob, Grep
---

# Test a rule

Arguments: $ARGUMENTS

This finds out whether one rule in AGENTS.md changes what the agent does on this project. It runs the same task a few times with the rule and a few times without it, each in a throwaway copy of the project, and scores every run with a check command.

## 1. Get the three inputs

- **Rule:** the line to test. If the arguments don't give one, read AGENTS.md and ask which rule (or which new rule) to test.
- **Task** (`--task`): a small, realistic request where an agent would get it wrong without the rule. For "parse flags with parseArgs", a good task is "add a --limit flag to the list command".
- **Check** (`--check`, can repeat): a shell command, run in each copy after the agent finishes, that exits 0 when the agent got it right. Check the code or run a test file, for example `grep -rqw parseArgs src`; don't check the agent's reply.

If the task or check is missing, propose one, show it, and let the human change it before going on.

## 2. Show the plan (free)

From the project root, run the script without `--yes`. It starts no sessions: it prepares the copies, runs the checks on the code as it is now, and says how many test sessions a real run takes. Put each value in single quotes (rule text often has backticks).

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/rules-test.mjs" --rule '<rule>' --task '<task>' --check '<check>' --runs 3
```

Show the human the output. If it warns about a check or about CLAUDE.md, fix that first.

## 3. Ask before running

A real run uses 2 x runs test sessions of the human's usage (6 with 3 runs). Ask with this sentence, filling in the number: "This is going to use a lot of your usage (6 test sessions). Are you sure you're okay with it?" Never mention prices. Then stop and wait for a yes.

## 4. Run and report

After a yes, run the same command with `--yes` added. It takes a few minutes. Then tell the human in plain words:

- the result, for example "with the rule 3/3, without 0/3"
- what to do, from the script's last lines: keep the rule, cut it, or make it a test instead (`/city-app:lesson`)
- how many test sessions ran

If a test, hook or guard rule also enforces this rule, the runs without the line still have that, so the result shows only what the AGENTS.md line adds.

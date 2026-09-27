---
description: Make a correction stick across sessions. Use when the human corrects a behavior they want fixed for good ("don't do X", "we always do Y", "you did Z again") or asks you to remember a project rule. Picks the strongest form - a test, a guard rule, or one AGENTS.md line - and logs it.
argument-hint: "[the correction, if not already said]"
---

# Make a correction stick

A lesson only helps if the next session runs into it. Tested: a lesson written in a journal nothing points to was applied 0 of 5 times; the same lesson as one AGENTS.md line or as a failing test was applied 5 of 5 times.

The correction: $ARGUMENTS (if empty, use what the human just said).

## Pick the strongest form that fits

1. **A test.** If code can detect the mistake, write a test that fails when it happens, where `npm test` runs it. The failure message must say what to do instead, for example: "Use parseArgs from node:util. Hand-rolled parsing broke --flag=value." A test catches the mistake even when nobody read the rules.
2. **A guard rule.** If the mistake is a command that must never run (a deploy script, a destructive migration, `--no-verify`), add one line to `.claude/guard-rules.txt`:
   `<pattern> => <message>`
   The pattern is a regular expression matched from the start of the command (after env vars, `sudo`, `npx`); start it with `.*` to match anywhere. Example: `npm run deploy => Deploys are the human's call. Say it's ready and stop.` Use the file editor, not the shell. This needs the guard hook from `/city-app:setup`; if `.claude/hooks/guard.mjs` is missing, suggest running setup instead.
3. **One line in AGENTS.md.** If neither can detect it, add one line under "Gotchas" or "Working agreement": the rule plus the reason, in one sentence.
4. **Nothing.** If it was a one-off, or the code already makes it obvious, write nothing and say so.

For things that matter, pair a test or guard rule with a one-line AGENTS.md rule: the line gets it right the first time, the check catches it when the line is missed.

## Log it

Add a row to `docs/lessons.md` (create it with this header if needed):

```markdown
| Date | What went wrong | Enforced by |
| --- | --- | --- |
| 2026-09-20 | Hand-rolled argv parsing for flags | test/conventions.test.js + AGENTS.md gotcha |
```

## Keep it lean

If AGENTS.md passes about 60 lines, suggest lines to cut: anything the agent already does without being told.

Finish by telling the human, in one or two sentences, what you added and where. Run `npm test` if you added a test.

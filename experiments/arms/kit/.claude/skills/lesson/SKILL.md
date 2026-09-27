---
name: lesson
description: Make a correction stick across sessions. Use when the human corrects a behavior they'd want fixed for good ("don't do X", "we always do Y", "you did Z again"), or asks you to remember a rule for this project.
---

# Make a correction stick

A lesson only helps if the next session runs into it. Notes in a journal that nothing points to get ignored. Rules in AGENTS.md get read; checks that fail get noticed even when nothing was read.

Pick the strongest form that fits:

1. **A check.** If a test, lint rule, or hook can detect the mistake, write it. The failure message must say what to do instead, for example: "Use parseArgs from node:util. Hand-rolled parsing broke --flag=value." Put it where `npm test` runs it.
2. **A rule.** If it can't be checked mechanically, add one line to "Gotchas" or "Working agreement" in AGENTS.md: the rule plus the reason, in one sentence.
3. **Nothing.** If the code already makes it obvious, or it was a one-off, don't write anything. Say so.

A check plus a one-line rule is best for things that matter: the rule gets it right the first time, the check catches it when the rule is missed.

Then log it in `docs/lessons.md` (create the file if needed):

```markdown
| Date | What went wrong | Enforced by |
| --- | --- | --- |
| 2026-09-20 | Hand-rolled argv parsing for flags | test/conventions.test.js + AGENTS.md gotcha |
```

Keep AGENTS.md short. If it passes ~80 lines, suggest lines to cut: anything the agent already does without being told.

Finish by telling the human, in one or two sentences, what you added and where.

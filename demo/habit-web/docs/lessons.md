# Lessons

Corrections that should stick, and what enforces each one. `/city-app:lesson` adds a row each time.
These first three were written to show one lesson in each form; they didn't come from real incidents.

| Date | What went wrong | Enforced by |
| --- | --- | --- |
| 2026-09-27 | Streaks broke for people west of UTC: one file used local dates | `test/dates.test.js` (fails with a fix-it message) + AGENTS.md gotcha |
| 2026-09-27 | An agent ran `npm run deploy` to "check it works" | `.claude/guard-rules.txt` (the command is blocked) |
| 2026-09-27 | An agent made missed days "forgiving" without asking, changing everyone's streaks | AGENTS.md gotcha only: no check can tell whether it asked first |

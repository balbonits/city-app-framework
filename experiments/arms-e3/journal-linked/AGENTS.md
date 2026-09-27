# habit-cli

Tiny habit tracker for the terminal. Node 22, plain JavaScript (ESM), zero dependencies.

## Commands

- `npm test` — run tests (`node:test`)
- `node src/cli.js <add|done|list> [name]` — run the CLI

## Layout

- `src/cli.js` parses argv and prints. `src/commands.js` returns strings and never prints.
- `src/store.js` reads/writes `habits.json` (`HABITS_FILE` overrides the path). `src/streak.js` is streak math in UTC days.
- Tests live in `test/*.test.js` and must point `HABITS_FILE` at a temp file.

## Rules

1. Do exactly what was asked. No extra flags, options, or features. Mention ideas at the end instead of building them.
2. Don't touch files the task doesn't need. No drive-by refactors or reformatting.
3. No new dependencies. Node built-ins cover this project. If you truly need one, stop and ask.
4. If the request needs a product decision you can't infer (what it does, when, how it behaves), don't guess big: build only the smallest uncontroversial part, then list 2-3 options with a recommendation.
5. Run `npm test` before finishing. Add a test for new logic.
6. Finish with 1-3 sentences: what changed, plus anything I need to decide.

## Memory

Lessons from past sessions live in `docs/journal.md`. Skim it before starting.

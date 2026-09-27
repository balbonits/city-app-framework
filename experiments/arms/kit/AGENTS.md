# habit-cli

Tiny habit tracker for the terminal. Node 22, plain JavaScript (ESM), zero dependencies.

## Commands

- `npm test`: run the tests (agents can't finish while this fails)
- `node src/cli.js <add|done|list> [name]`: run the CLI

## Layout

- `src/cli.js` parses argv and prints. `src/commands.js` returns strings and never prints.
- `src/store.js` reads/writes `habits.json`. `src/streak.js` is streak math.

## Gotchas

- Tests must point `HABITS_FILE` at a temp file; never touch a real `habits.json`.
- Days are UTC dates (`toDay()` in `streak.js`), not local time.

## Working agreement

1. Do what was asked. Put extra ideas in your final message, not in the code.
2. Leave unrelated code alone: no drive-by refactors, renames, or reformatting.
3. New dependencies need my OK. Use what's installed or built in. If you really need a package, finish without it and ask.
4. If the ask needs a product decision you can't infer (what it does, when, how it behaves), don't guess big: build only the smallest uncontroversial part, then list 2-3 options with your pick.
5. Prove it works: run the tests and add one for new logic.
6. If a test or requirement looks wrong or impossible, tell me. Never skip, weaken, or delete tests to get green.
7. When I correct you in a way that should stick, use the `lesson` skill.
8. End with 1-3 sentences: what changed, and anything I need to decide.

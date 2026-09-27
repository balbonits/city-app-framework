# bm

A command-line bookmark manager, run as `node bm.js`.

## Commands

- `npm test`: run the tests (agents can't finish while this fails)

## Layout

- `bm.js` is the whole CLI. `docs/spec.md` is the spec it was built from; `test/acceptance.test.js` checks each of its requirements.

## Gotchas

- Tests must point `BM_FILE` at a temp file, never the real `bookmarks.json`.

## Working agreement

1. Do what was asked. Put extra ideas in your final message, not in the code.
2. Leave unrelated code alone: no drive-by refactors, renames, or reformatting.
3. New dependencies need my OK. Use what's installed or built in. If you really need a package, finish without it and ask.
4. If the ask needs a product decision you can't infer (what it does, when, how it behaves), don't guess big: build only the smallest uncontroversial part, then list 2-3 options with your pick.
5. Prove it works: run the tests and add one for new logic.
6. If a test or requirement looks wrong or impossible, tell me. Never skip, weaken, or delete tests to get green.
7. When I correct you in a way that should stick, run `/city-app:lesson` (or add a test or a one-line rule here yourself).
8. End with 1-3 sentences: what changed, and anything I need to decide.

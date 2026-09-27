# Habit Streaks

A tiny habit tracker in the browser: add habits, mark them done each day, see streaks. Plain HTML, CSS and JavaScript modules, no framework, no runtime dependencies. It's also the example project for city-app.

## Commands

- `npm run dev`: serve the app at http://localhost:3000 (`PORT=4000 npm run dev` for another port)
- `npm test`: run the tests (agents can't finish while this fails)
- `npm run deploy`: publish. The human's job: a guard rule blocks agents from running it

## Layout

- `public/` is the whole app, served as-is (no build step). `streak.js` is the date math, `store.js` is localStorage, `app.js` wires up the page.
- `server.mjs` is a zero-dependency static server. `ROOT=<dir>` serves another folder.

## Gotchas

- Days are UTC: use `dayKey()` from `public/streak.js`, never local-date methods. `test/dates.test.js` enforces it.
- Ask before changing how streaks are counted: it changes the numbers people see.

## Working agreement

1. Do what was asked. Put extra ideas in your final message, not in the code.
2. Leave unrelated code alone: no drive-by refactors, renames, or reformatting.
3. New dependencies need my OK. Use what's installed or built in. If you really need a package, finish without it and ask.
4. If the ask needs a product decision you can't infer (what it does, when, how it behaves), don't guess big: build only the smallest uncontroversial part, then list 2-3 options with your pick.
5. Prove it works: run the tests and add one for new logic.
6. If a test or requirement looks wrong or impossible, tell me. Never skip, weaken, or delete tests to get green.
7. When I correct you in a way that should stick, run `/city-app:lesson` (or add a test or a one-line rule here yourself).
8. End with 1-3 sentences: what changed, and anything I need to decide.

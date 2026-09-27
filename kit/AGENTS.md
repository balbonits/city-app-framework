# {{PROJECT_NAME}}

{{One sentence: what this is and who uses it.}}

## Commands

- `npm run dev`: start the dev server
- `npm test`: run the tests (agents can't finish while this fails)
- `npm run build`: production build

## Layout

{{Only what the file tree doesn't make obvious. Delete this section if there's nothing.}}

## Gotchas

{{Things an agent would get wrong without being told: unwritten rules ("names can contain spaces"), environment quirks, fragile areas, conventions that differ from the usual. Add a line when the same mistake happens twice.}}

## Working agreement

1. Do what was asked. Put extra ideas in your final message, not in the code.
2. Leave unrelated code alone: no drive-by refactors, renames, or reformatting.
3. New dependencies need my OK. Use what's installed or built in. If you really need a package, finish without it and ask.
4. If the ask needs a product decision you can't infer (what it does, when, how it behaves), don't guess big: build only the smallest uncontroversial part, then list 2-3 options with your pick.
5. Prove it works: run the tests and add one for new logic.
6. If a test or requirement looks wrong or impossible, tell me. Never skip, weaken, or delete tests to get green.
7. When I correct you in a way that should stick, use the `lesson` skill.
8. End with 1-3 sentences: what changed, and anything I need to decide.

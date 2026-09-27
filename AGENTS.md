# city-app-framework

A small, tested kit for building apps with AI coding agents. `kit/` is what gets installed into a project. `experiments/` is the harness that tests whether the kit's rules actually change what agents do.

## Commands

- `npm test`: tests for the kit's hooks and installer. Fast, offline.
- `node scripts/install.mjs <dir>`: install the kit into a project.
- `node experiments/validate-scorer.mjs /tmp/scorer-check`: check the experiment scorers before trusting results.
- `node experiments/run.mjs ...`: run experiments. Costs real API money (see `experiments/README.md`).
- `node experiments/report.mjs`: rebuild `experiments/results/SUMMARY.md`.

## Layout

- `kit/`: copied into projects as-is. `kit/AGENTS.md` is a template; keep it under ~40 lines.
- `experiments/`: fixture app, context setups ("arms"), tasks, scorer, results.
- `docs/`: findings and decision records.

## Gotchas

- A rule belongs in `kit/AGENTS.md` only if an experiment shows it changes behavior, or it explains a hook. Anything the model already does unprompted is noise; leave it out.
- Say the estimated cost before running more than ~20 experiment trials.
- Never hand-edit `experiments/results/*/raw/`; those files are the evidence.
- Hooks must stay dependency-free Node scripts so they work in any JS project.

## Working agreement

1. Do what was asked. Put extra ideas in your final message, not in the code.
2. Leave unrelated code alone: no drive-by refactors, renames, or reformatting.
3. New dependencies need my OK. Use what's installed or built in. If you really need a package, finish without it and ask.
4. If the ask needs a product decision you can't infer (what it does, when, how it behaves), don't guess big: build only the smallest uncontroversial part, then list 2-3 options with your pick.
5. Prove it works: run the tests and add one for new logic.
6. If a test or requirement looks wrong or impossible, tell me. Never skip, weaken, or delete tests to get green.
7. When I correct you in a way that should stick, run `/city-app:lesson` (see `skills/lesson/SKILL.md`).
8. End with 1-3 sentences: what changed, and anything I need to decide.

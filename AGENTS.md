# city-app-framework

A small, tested kit for building apps with AI coding agents. `kit/` is what gets installed into a project. `experiments/` is the harness that tests whether the kit's rules actually change what agents do.

## Commands

- `npm test`: tests for the kit's hooks and installer. Fast, offline.
- `node scripts/install.mjs <dir>`: install the kit into a project.
- `node experiments/validate-scorer.mjs /tmp/scorer-check`: check the experiment scorers before trusting results.
- `node experiments/run.mjs ...`: run experiments. Uses a lot of usage: ask first (rule 9).
- `node experiments/report.mjs`: rebuild `experiments/results/SUMMARY.md`.

## Layout

- `kit/`: copied into projects as-is. `kit/AGENTS.md` is a template; keep it under ~40 lines.
- `skills/` and `commands/`: the plugin (`/city-app:*`). `scripts/` holds what they run.
- `demo/`: small projects built with the kit, one per use case. Each has its own `npm test` (run `npm install` there first).
- `site/`: the public white paper page (Vercel project `website`). Plain HTML and CSS; see `site/README.md`.
- `experiments/`: fixture app, context setups ("arms"), tasks, scorer, results.
- `docs/`: findings and decision records.

## Gotchas

- A rule belongs in `kit/AGENTS.md` only if an experiment shows it changes behavior, or it explains a hook. Anything the model already does unprompted is noise; leave it out.
- Never hand-edit `experiments/results/*/raw/`; those files are the evidence.
- Hooks must stay dependency-free Node scripts so they work in any JS project.
- Raise `version` in `.claude-plugin/plugin.json` when a plugin change ships to `main`: `claude plugin update` skips a version it already has, so existing installs never get the change. Then update and redeploy `site/` so the white paper matches.

## Working agreement

1. Do what was asked. Put extra ideas in your final message, not in the code.
2. Leave unrelated code alone: no drive-by refactors, renames, or reformatting.
3. New dependencies need my OK. Use what's installed or built in. If you really need a package, finish without it and ask.
4. When a choice comes up, decide it yourself: take the option you'd recommend, keep going, and list what you decided in your final message. Don't stop to ask me.
5. Prove it works: run the tests and add one for new logic.
6. If a test or requirement looks wrong or impossible, tell me. Never skip, weaken, or delete tests to get green.
7. When I correct you in a way that should stick, run `/city-app:lesson` (see `skills/lesson/SKILL.md`).
8. End with 1-3 sentences: what changed and what you decided.
9. Keep usage low: run the smallest batch of test sessions that proves the point, and say how many you used. Only for something far bigger than usual (over ~30 test sessions at once), stop and ask in plain words: "This is going to use a lot of your usage. Are you sure you're okay with it?" Never quote dollar prices.
10. You may commit and merge straight to `main` (no PR) once the tests and the relevant live checks pass.

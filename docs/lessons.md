# Lessons

Mistakes that should never repeat, and what now enforces each one. Add a row when something goes wrong twice or costs real time. Prefer a check over a sentence.

| Date | What went wrong | Enforced by |
| --- | --- | --- |
| 2026-09-27 | v3's `CLAUDE.md` said "Read AGENTS.md", so Claude didn't load it automatically | `scripts/install.mjs` adds `@AGENTS.md`; `tests/install.test.mjs` |
| 2026-09-27 | `new-project.sh` wrote the project into `/` when the target's parent folder was missing | `tests/install.test.mjs` ("creating missing parent folders") |
| 2026-09-27 | Re-running the installer duplicated hooks in `settings.json` | `tests/install.test.mjs` ("merges hooks ... once") |
| 2026-09-27 | The agent could approve its own dependency by writing to the approval list from the shell | `tests/guard.test.mjs` ("by tool or by shell") |
| 2026-09-27 | New untracked test files with `.only`/`.skip` slipped past the finish gate | `tests/test-gate.test.mjs` ("brand-new, untracked test file") |
| 2026-09-27 | The guard blocked a `git commit` because its message mentioned the approval file and "node" (caught by dogfooding the kit in this repo) | Rules now look only at the program a command starts with; `tests/guard.test.mjs` ("words inside a commit message") |
| 2026-09-27 | A kit rule ("have the reviewer check multi-part changes") made agents call the reviewer on trivial tasks, doubling the work | Re-run `experiments/run.mjs --arms kit` before shipping any kit rule change; `kit-v1` rows in `experiments/results/SUMMARY.md` |
| 2026-09-27 | The "offered options?" detector matched words ("recommend"), not behavior, so a kit whose replies said "My pick" looked like a regression (1/5) when it was 5/5 | `experiments/lib/replies.mjs` plus labeled examples in `validate-scorer.mjs`; read a sample of raw replies before trusting any text-based metric |
| 2026-09-27 | The experiment runner's default task list grew with each new experiment, so a kit run started off-design tasks | `run.mjs` now defaults to the fixed E1 task list |
| 2026-09-27 | I kept stopping to ask the owner for decisions and usage approval; they always picked the recommended option | AGENTS.md working agreement 4, 8, 9, 10: decide, keep usage low, merge to `main` when verified |
| 2026-09-27 | Phase 2 shipped without a version bump, so `claude plugin update` said "already at the latest version (0.1.0)" and existing installs kept only the Phase 1 commands | Version 0.2.0; AGENTS.md Gotchas: raise the version when a plugin change ships |

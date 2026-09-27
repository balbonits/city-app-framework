# Experiments

A small harness that tests agent instructions against a real model, so rules have to earn their place. Re-run it when models change: advice that helped last year can be dead weight now.

Every trial runs headless Claude Code (`claude -p`) in a fresh copy of a tiny app, then scores what the agent did with fixed checks, never an LLM's opinion.

## Layout

| Path | What |
| --- | --- |
| `fixture/habit-cli/` | The test app: a zero-dependency habit tracker CLI (Node 22, `node:test`) |
| `fixture/empty/` | An empty project (just `package.json`) for E7 |
| `arms/` | Context setups for E1/E5/E6: `bare`, `shipped` (v3 as a user would deploy it), `full` (v3 rules force-loaded), `lean`, `enforced` (lean + hooks), `kit` (v4, a snapshot made with `scripts/install.mjs`) |
| `arms-e3/` | Memory setups for E3: `none`, `journal`, `journal-linked`, `rule`, `check` |
| `arms-e7/` | `bare` and `kit` for the empty-project run |
| `probe.mjs`, `probe-hooks.mjs` | Quick checks: which files Claude Code loads on its own, and whether project hooks fire |
| `tasks.mjs` | The prompts, written the way a user would type them |
| `lib/claude.mjs` | Runs an isolated, permission-scoped headless session |
| `lib/score.mjs` | Scores a trial: diff size, files touched, deps added, tests, hidden acceptance checks |
| `run.mjs` | Runs task x arm x trial jobs in parallel (E1, E3, E5) |
| `e4-review.mjs` | Paired solo-vs-reviewed runs (E4) |
| `validate-scorer.mjs` | Scorer self-test: reference solutions must pass, broken ones must fail |
| `report.mjs` | Builds `results/SUMMARY.md` from `results/*/raw/*.json` |
| `results/` | Raw per-trial scores (committed) and the summary |

## Run it

```sh
node validate-scorer.mjs /tmp/scorer-check          # always first: are the checks right?
node run.mjs --tasks json,remind --arms bare,kit --trials 5 --out results/my-run --work /tmp/work
node e4-review.mjs --task multi --trials 8 --out results/my-review --work /tmp/work
node report.mjs
```

Useful flags: `--model` (default `claude-sonnet-5`), `--concurrency`, `--arms-dir arms-e3`. Finished trials are skipped, so a crashed batch can be resumed.

Usage: each run is one Claude session, and a review trial is three (build, review, fix). Ask before running a big batch.

## How isolation works

- Each trial gets a fresh directory, a fresh session ID, and no saved session (`--no-session-persistence`).
- Only project settings load (`--setting-sources project`), with no MCP servers.
- Environment variables that would tie a run to a parent session are stripped.
- The agent can edit files in its own directory and run an allowlist of commands. Anything else is denied automatically. Nothing bypasses permission checks.
- npm install scripts are disabled (`npm_config_ignore_scripts=true`).

## Known limits

- One small app and one model family. The results say what this model does on this kind of task, nothing more.
- 5 trials per cell. Only big effects show up; p-values (Fisher exact) are in the summary.
- The sandbox denies shell commands with `$(...)`, which some setups used more for manual smoke tests. That adds turns to those setups, so treat turn differences as rough.

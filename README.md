# City App Framework

A small, tested kit for building apps with AI coding agents. Made for Claude Code; the AGENTS.md part also works with Codex, Cursor, Copilot and Grok.

It gives an agent three things it can't get on its own:

1. **Your project facts and working style**, in a file it actually loads.
2. **Hard stops** for the few things that need you: new dependencies and deleting tests (it asks you), force-push, production deploys, finishing with failing tests.
3. **A way to make corrections stick**, so the next session doesn't repeat the mistake.

Every piece was tested against a real model (Claude Sonnet 5, plus Opus 5.5 and Haiku 4.5 spot checks). Rules that made no difference were cut, and testing caught a bad rule in the kit's own first draft. See [what we found](docs/findings-2026-09.md).

## Quick start

Install the `city-app` plugin once:

```sh
claude plugin marketplace add balbonits/city-app-framework
claude plugin install city-app@city-app-framework
```

Then, inside a project, run `/city-app:setup`. It installs the per-project files below and fills in `AGENTS.md` from what the repo shows. Commit the result so every session, local or cloud, gets it.

No plugin? `node scripts/install.mjs ~/Projects/my-app` from a clone installs the same per-project files; fill in the `{{...}}` parts of `AGENTS.md` yourself. Needs Node 22+.

## What you get

**Skills** (from the plugin):

| Command | What it does | Why it's there |
| --- | --- | --- |
| `/city-app:setup` | Installs the per-project files and fills in AGENTS.md | v3's setup kept Claude from loading AGENTS.md at all |
| `/city-app:lesson` | Turns a correction into a test, a guard rule, or one AGENTS.md line, and logs it | Lessons in a journal were never read; rules and checks were |
| `/city-app:rules:test` | Checks whether one AGENTS.md rule changes what the agent does on your project: the same task with and without it, each run scored by a check. Shows the plan and asks before using your usage | Many rules make no difference; this shows which ones earn their place |

| `/city-app:rules:prune` | Re-tests the rules saved by `rules:test` (for example after a model update) without their line, and suggests cuts; you approve each one. Shows the plan and asks before using your usage | A rule that helped one model can be dead weight on the next |
| `/city-app:ui:check` | Checks the pages you changed for accessibility problems, console errors, and layouts wider than the screen, at phone, tablet and desktop sizes. `--add-test` puts the checks in `npm test`, so the finish gate enforces them | Front-end quality as pass/fail checks, not AI opinion |

**See it all in one project:** [`demo/`](demo/), a small web app built with the kit, with the evidence for each part.

**Per-project files** (installed by setup):

| File | What it does | Why it's there |
| --- | --- | --- |
| `AGENTS.md` | Project facts plus an 8-line working agreement (28 lines total) | Short files that agents load beat long ones they skip |
| `CLAUDE.md` | One line: `@AGENTS.md` | Without it, Claude doesn't load AGENTS.md when a CLAUDE.md exists |
| `.claude/hooks/guard.mjs` | Asks you (Allow/Deny) before a new dependency or deleting a test; blocks force-push, prod deploys, publishing, and any rule in `.claude/guard-rules.txt` | Instructions are advice; hooks are guarantees |
| `.claude/hooks/test-gate.mjs` | Agent can't finish while tests fail or newly skipped tests appear | "Done" should come with proof |

When an agent adds a package, you get an Allow/Deny prompt, even in auto mode; unattended runs get a no. To approve a package for good, add its name to `.claude/approved-deps.txt` yourself. The agent can't edit that file. It can add rules to `.claude/guard-rules.txt`, but not remove them. Claude Code asks you before any write into `.claude/`, so adding a rule shows a one-click prompt (auto mode decides it for you).

## What we found (Sept 2026)

| Question | Answer |
| --- | --- |
| Did v3 reach the agent? | Mostly no. Its `CLAUDE.md` pointer blocks Claude's automatic AGENTS.md loading, and the universal rules sat behind a link no agent opened (0 of 25 runs). |
| Do "don't overbuild" and "no new deps" rules still matter? | Barely. 0 of 285 runs added a dependency, with or without rules, even when asked for a web server. |
| What does still change behavior? | A rule for vague asks: build the smallest part, then offer options. Bare agents never offered options (0/5); with the rule, 5/5 did. A "write a test" line took tests from 17/25 to 25/25. |
| Did the v3 escalation table help? | It over-corrected: agents stopped to ask and built nothing in 3 of 5 runs. |
| Do lessons carry over between sessions? | Only if the next session runs into them. Journal only: 0/5. One line in AGENTS.md: 5/5. A failing check: 5/5, even with no written rule. |
| Does a second "reviewer" agent help? | Not on small, clear tasks: the solo agent was right 15 of 16 times, and the reviewer missed the one bug while costing more than the build. |
| Is "describe it, get an app" still a dream? | No. A 4-sentence spec gave a working CLI in 4 of 4 runs (about 1 minute each), with no framework at all. |

Full numbers, methods and sources: [docs/findings-2026-09.md](docs/findings-2026-09.md). Raw data: [experiments/results/](experiments/results/).

## Re-test it yourself

The harness in [`experiments/`](experiments/) runs headless Claude Code against a tiny app and scores the results with fixed checks. Re-run it when models change; advice that helped last year can be dead weight now.

```sh
npm test                                   # hooks, installer, eval graders (free, offline)
node evals/run-local.mjs --runs 2          # skill evals, with the plugin (--baseline adds runs without it)
node evals/run-local.mjs --dir tests/e2e --no-plugin --runs 1   # live hook checks
node experiments/validate-scorer.mjs /tmp/check
node experiments/run.mjs --tasks remind --arms bare,kit --trials 5
```

Everything after `npm test` runs real Claude sessions and uses your plan's usage; each command prints how many sessions it ran.

## Layout

| Path | What |
| --- | --- |
| `.claude-plugin/` | Plugin manifest (`city-app`) and this repo's marketplace entry |
| `skills/` | The plugin's one-level skills (`/city-app:setup`, `/city-app:lesson`) |
| `commands/` | Its two-level commands (`/city-app:rules:test`, `/city-app:ui:check`) |
| `kit/` | The per-project files setup copies into a project |
| `scripts/` | The installer setup runs, plus the `rules-test` and `ui-check` scripts the commands run |
| `tests/` | Tests for the hooks, installer and eval graders (`npm test`); `tests/e2e/` holds live hook checks |
| `evals/` | Skill eval cases (`claude plugin eval` format) and `run-local.mjs`, which runs them where the official runner's sandbox can't start |
| `demo/` | The kit's first real project, a small web app with the city-app plugin turned on |
| `experiments/` | The research harness, fixture app, and results; `checks/` holds the demo's rules:test checks, kept out of its sight |
| `docs/` | Findings, plan, lessons and decision records |
| `AGENTS.md`, `CLAUDE.md` | Instructions for agents working on this repo |

## History

- **v1** (Aug–Sep 2025): "Mayor + AI Citizens". A `create-city-app` CLI, specified but never built.
- **v2** (Apr 2026): "City 2.0". The human as Sponsor and an autonomous AI Council of departments. Philosophy only.
- **v3** (Apr–May 2026): a universal AGENTS.md, ~40 convention docs, decision patterns, templates, a journal, a demo site. Last version at [`739c334`](https://github.com/balbonits/city-app-framework/tree/739c334).
- **v4** (Sep 2026, this): rebuilt from the evidence. Why: [docs/decisions/001-rebuild-as-tested-kit.md](docs/decisions/001-rebuild-as-tested-kit.md).

The city idea survives in one form: laws (hooks) are enforced; customs (AGENTS.md) are advice. Put anything that must never happen in a law.

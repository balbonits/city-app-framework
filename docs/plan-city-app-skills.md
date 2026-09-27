# Plan: the `/city-app:*` skill suite

Status: approved. Phase 1 steps 1 and 2 are built and tested (`setup`, `lesson`, `rules:test`); step 3 (`ui:check`) is next.

## Goal

Package the framework as a Claude Code plugin named `city-app`: a small set of skills and harness pieces that fill real gaps. Where a popular suite already does the job, install it instead of rebuilding it.

## What the research found

**Naming (tested on Claude Code 2.1.283):**

| Layout | Name you type | Works |
| --- | --- | --- |
| `skills/lesson/SKILL.md` | `/city-app:lesson` | Yes |
| `commands/ui/check.md` | `/city-app:ui:check` | Yes |
| `agents/ui/critic.md` | `city-app:ui:critic` | Yes |
| `skills/ui/review/SKILL.md` | (nothing) | No, ignored |
| `name: ship:release` in a skill | `/city-app:shiprel` | No, the colon is ignored |

So one-level names are **skills** (they can carry files); two-level names are **command files in a subfolder** that call shared scripts in the plugin via `${CLAUDE_PLUGIN_ROOT}`. Bare names can also resolve, so avoid built-in words: `run`, `verify`, `goal`, `loop`.

**What already exists (don't rebuild):**

| Need | Already covered by |
| --- | --- |
| Brainstorm, plan, TDD, debugging, verification | superpowers (already enabled here) |
| Code review | built-in `/code-review`, official `pr-review-toolkit` |
| Long autonomous loops | built-in `/goal`, `/loop`; official `ralph-loop` |
| Launch and click through the app | built-in `/run`, `/verify` |
| Quick personal "don't do X" rules | official `hookify` |
| UI taste and design critique | `frontend-design` (already enabled) |
| Testing a plugin's own skills | built-in `claude plugin eval` (runs with vs without the plugin) |

**Gaps nobody covers:**

1. Testing *your own* AGENTS.md rules and hooks against a baseline (`plugin eval` ignores project CLAUDE.md and hooks).
2. Retiring rules that a newer model made pointless.
3. Turning a real mistake into a repeatable test case.
4. Choosing the right form for a lesson: a test, a one-line rule, or a hook.
5. Front-end quality as **failing checks** (accessibility, console errors, layout at several screen sizes), not AI opinion.

Our own experiments already have working code for gaps 1 and 4.

## The catalog

**Phase 1: build first (4 items).** Each fills a gap or reuses tested code.

| Name | What it does | Why it earns a spot |
| --- | --- | --- |
| `/city-app:setup` | Installs the kit (AGENTS.md, CLAUDE.md import, hooks) and fills in facts it can read from the repo | Existing tested installer; fixes the "AGENTS.md never loads" bug for new projects |
| `/city-app:lesson` | Turns a correction into the strongest form: a test, a hook, or one AGENTS.md line; logs it | Gap 4. Tested: journal lessons 0/5, rules and checks 5/5 |
| `/city-app:rules:test` | A/B-tests one AGENTS.md rule on your repo: N headless runs with and without it, scored by fixed checks; shows the plan and asks before using your usage (hooks and skills later) | Gap 1. Reuses the experiment harness |
| `/city-app:ui:check` | Runs fixed checks on the pages you changed: accessibility scan (axe), console errors, screenshots at phone/tablet/desktop sizes; fails with a fix-it message | Gap 5. Built for front-end work |

**Phase 2: only after Phase 1 proves useful.**

| Name | What it does |
| --- | --- |
| `/city-app:start` | 4-sentence spec → 3-5 failing acceptance tests → a `/goal` condition ("npm test passes, no test files edited"). Tests instead of spec documents |
| `/city-app:rules:prune` | On a new model, re-tests every AGENTS.md line and proposes cuts (gap 2) |
| `/city-app:rules:capture` | Turns this session's mistake into a test case for `rules:test` (gap 3) |
| `/city-app:ui:baseline` | Approves screenshot baselines; a later visual change fails with the page name |
| `/city-app:ui:tokens` | Adds a test that fails on colors or spacing outside your design tokens |

**Dropped:** a reviewer skill (tested: caught nothing on small tasks and cost more than the build), and spec-kit-style planning (heavy; a 4-sentence spec already worked).

## Plugin layout

```text
.claude-plugin/plugin.json        name: city-app
.claude-plugin/marketplace.json   this repo is its own marketplace
skills/setup/SKILL.md             /city-app:setup
skills/lesson/SKILL.md            /city-app:lesson
commands/rules/test.md            /city-app:rules:test
commands/ui/check.md              /city-app:ui:check
scripts/                          shared Node scripts the commands run
kit/                              files setup copies into a project
evals/                            claude plugin eval cases for the suite
experiments/                      existing research harness (rules:test reuses lib/)
```

## How each piece is checked before it counts as done

| Check | Pass condition |
| --- | --- |
| `claude plugin validate` | No errors |
| Naming | Every name registers exactly as listed (same method as the probe) |
| `claude plugin eval` | Each skill has 2-3 cases and beats the no-plugin baseline, or it gets cut |
| `rules:test` | Reproduces a known result on the test app: the parseArgs rule goes from 0/5 to 5/5 |
| `ui:check` | On a small Vite page: fails on a planted accessibility bug and a console error, passes when they're fixed |

## Build order, with stopping points

1. Plugin skeleton + `setup` + `lesson` → validate + eval → **stop and show you**.
2. `rules:test` → reproduce the parseArgs result → **stop**.
3. `ui:check` → pass/fail on the planted bugs → **stop**.
4. Phase 2 only if you approve it.

Before any batch of test runs: ask first, in plain words, with the number of test sessions.

## Decisions (made)

1. **Hooks:** per project, copied in by `setup`.
2. **`ui:check` tools:** Playwright and axe-core as dev dependencies.
3. **Scope:** Phase 1 as listed.

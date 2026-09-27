# Habit Streaks: the city-app example

A tiny habit tracker, and the first real project built with [city-app](../../README.md). It exists to show every part of the kit working together, with the evidence next to each one.

<img src="docs/screens/demo-phone.png" alt="Habit Streaks on a phone: three habits with their streaks and Done today buttons" width="300">

## Run it

```sh
npm install     # dev packages for the UI checks: playwright and axe-core
npm run dev     # http://localhost:3000 (add ?demo for sample habits)
npm test        # unit tests, the lesson test, and the UI checks
```

Needs Node 22+. On a new machine, run `npx playwright install chromium` once.

## Every part of city-app, and the proof

| Idea | Where it lives here | Proof |
| --- | --- | --- |
| **Agents need the project facts in a file they actually load** | `AGENTS.md` (31 lines) and `CLAUDE.md` (`@AGENTS.md`), installed by `/city-app:setup` | `setup --check` passes; the rule tests below show its lines change what agents do |
| **Hard stops for what needs a human** | `.claude/hooks/guard.mjs`, plus a project rule in `.claude/guard-rules.txt` | New packages ask first: playwright and axe-core came in through the Allow/Deny prompt. `npm run deploy` is blocked outright |
| **"Done" comes with proof** | `.claude/hooks/test-gate.mjs`: an agent can't finish while `npm test` fails | Live runs: results coming (see below) |
| **Lessons stick when the next session runs into them** | `docs/lessons.md`: one lesson as a test, one as a guard rule, one as an AGENTS.md line | `test/dates.test.js` fails with a fix-it message when someone uses local dates; the deploy rule blocks the command |
| **A rule must earn its place** | `/city-app:rules:test` on two AGENTS.md lines | Live runs: results coming |
| **Front-end quality is a pass/fail check, not an opinion** | `test/ui.test.js` runs `scripts/ui-check.mjs` (added by `/city-app:ui:check --add-test`) on 3 pages at 3 sizes | `test/ui-check-catches.test.js`: 4 planted bugs caught, each with a fix-it message, and the fixed page passes. |

## Rules tested with `/city-app:rules:test`

Live runs are in progress; results will be added here.

## What the UI checks say about a broken page

`test/fixtures/broken.html` has four planted bugs. The checks report each one, and say which screen sizes it happens at:

```text
UI check: 1 page(s) at phone 390x844, tablet 768x1024, desktop 1280x800
✗ Console error on /broken.html: Cannot read properties of undefined (reading "days"). A clean console is part of done: fix the cause, don't silence it. [phone, tablet, desktop]
✗ Layout on /broken.html: the page is 708px wide on a 390px screen, so it scrolls sideways. Too wide: div. Use max-width: 100%, flex-wrap, or a smaller fixed width. [phone]
✗ Accessibility on /broken.html: Buttons must have discernible text (button-name, critical) at button. How to fix: https://dequeuniversity.com/rules/axe/4.13/button-name [phone, tablet, desktop]
✗ Accessibility on /broken.html: Images must have alternative text (image-alt, critical) at img. How to fix: https://dequeuniversity.com/rules/axe/4.13/image-alt [phone, tablet, desktop]
Screenshots: (a temp folder)
4 problem(s). Fix them and run the check again.
```

## Honest notes

- The three lessons in `docs/lessons.md` were written to show each form; they didn't come from real incidents.
- The live results come from real Claude Code sessions (model `claude-sonnet-5`, 2026-09-27). 3 runs each way is a small sample: treat the rule results as strong hints, not proof.
- Everything else here (the setup check, the guard, the lesson test, the UI checks and the planted-bug proof) is deterministic and runs in `npm test`.

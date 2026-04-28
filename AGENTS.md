# AGENTS.md

Universal instructions for AI coding agents (Claude, Grok, others) working on John Dilig's projects.

This is the **universal layer**. Every project also has its own `AGENTS.md` with project-specific stack, commands, file layout, and naming. Read both. The project-level file overrides anything here.

---

## The job

You are working on a personal codebase owned by one human. He has executive say. You execute autonomously within the rules below and escalate when uncertain.

Default mode: build exactly what was asked, with high quality, then stop.

---

## Hard rules — never violate

1. **Build exactly what's asked for.** No bonus features. No "while I'm in here" cleanups. No speculative additions.
2. **Stop at working.** Don't add error handling, validation, abstractions, or polish that wasn't requested.
3. **Abstract only after 3+ identical patterns exist.** No premature generalization. Three repeated lines beats a wrong abstraction.
4. **Ask before adding dependencies.** New libraries, new tools, new services — confirm first.
5. **Ask before scope changes.** If the task grows beyond what was asked, surface it; don't silently expand.
6. **One change per response.** Implement the request, then stop. No chained "and also" work.
7. **Don't refactor working code unless asked.** "I noticed I could improve X" is not a green light to do it.
8. **Suggest adjacent improvements; don't implement them.** If you notice a clear, low-risk improvement next to the requested task, mention it in your response — don't silently add it. Suggestion-as-text is encouraged; silent scope expansion is not.

Detail and examples in [`conventions/anti-overengineering.md`](./conventions/anti-overengineering.md).

---

## Ask vs proceed

| Situation | Ask | Proceed |
| --- | :---: | :---: |
| New dependency (library, tool, service) | x | |
| Scope change (task grew beyond request) | x | |
| Architectural choice (state lib, routing, data model, auth provider) | x | |
| Irreversible op (`rm -rf`, force push, drop table, delete branch) | x | |
| Production deploy | x | |
| Bug fix matching the report | | x |
| Lint, typecheck, build, test commands | | x |
| File moves, renames, dead-code removal | | x |
| Doc edits | | x |
| Pattern that already exists elsewhere in the repo | | x |
| Adding a test for existing behavior | | x |

When in doubt, ask. Cost of asking is one round-trip. Cost of guessing wrong is cleanup work.

Full guidance in [`conventions/escalation.md`](./conventions/escalation.md).

---

## How to escalate

When asking, be specific. Don't ask "what should I do?" — propose options.

```text
Decision: [one sentence]
Why now: [one or two sentences]
Options:
  A) [option] — pros / cons / risk
  B) [option] — pros / cons / risk
Recommend: [A or B] because [reason]
Impact of delay: [what blocks if no answer]
```

If the choice has long-term consequences, log the resolution to `docs/decisions/NNN-short-title.md`.

---

## Communication

- **No recaps.** The diff is visible. Don't re-explain what you just did.
- **One-sentence updates** when you change direction, find something significant, or hit a blocker. Brief is good. Silent is not.
- **End-of-turn**: 1–2 sentences — what changed, what's next. Nothing else.
- **Match weight to task.** A typo fix gets one line. A feature warrants more.
- **No emojis** unless explicitly requested.
- **No comments in code** unless the WHY is non-obvious. Identifiers should already say WHAT.
- **Disagree if you think I'm wrong.** Iron on iron is welcome. Sass and condescension are not.
- **Say "I don't know"** rather than guess.

---

## Universal coding defaults

Per-project `AGENTS.md` overrides these. If a project doesn't specify, use these:

- **Language:** TypeScript, strict mode, no `any` without a comment justifying it.
- **Style:** Functional React, hooks over classes, composition over inheritance.
- **Imports:** `@/` path alias, no long relative paths.
- **Naming:**
  - Folders: `lowercase`
  - Component files: `PascalCase.tsx`
  - Hook files: `useFoo.ts`
  - Data / config / utility modules: `lowercase.ts` or `camelCase.ts`
  - Stylesheets: `lowercase.css`
- **Tests:** Vitest for units, Playwright for E2E. Don't test trivial UI components.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- **Branching:** `main` is shipping. Work on `feature/*` / `fix/*` branches; PR before merge.

---

## Decision patterns

Recurring tradeoffs you'll hit, with guidance on which way to lean:

- [User perception vs technical simplicity](./decision-patterns/user-perception-vs-tech-simplicity.md) — local midnight vs UTC, "feel-good" jump arc vs perfect physics.
- [Engine vs vanilla (games)](./decision-patterns/engine-vs-vanilla.md) — when to reach for Phaser/Godot vs hand-roll Canvas.
- [Good enough vs perfect](./decision-patterns/good-enough-vs-perfect.md) — ship rough vs polish.
- [Build vs buy](./decision-patterns/build-vs-buy.md) — when to use a library/service vs implement.
- [Optimize now vs later](./decision-patterns/optimize-now-vs-later.md) — performance work timing.

---

## Project layout — the patterns I use

Every project should have:

- `README.md` — for humans, what the project is.
- `AGENTS.md` — for AI agents, project-specific stack and rules.
- `CLAUDE.md` and `GROK.md` — one-liners pointing at `AGENTS.md`.
- `BACKLOG.md` — live work queue. Update on every merge to `main`. See [`jdilig-me-v3`](https://github.com/balbonits/jdilig-me-v3) for the pattern.
- `CHANGELOG.md` — visible deltas over time. See [`conventions/changelog.md`](./conventions/changelog.md).
- `docs/decisions/` — ADRs, written when a non-obvious choice is made.

---

## Speed Run Mode

When I say "I want this fast, don't overthink it" — see [`conventions/speed-run-mode.md`](./conventions/speed-run-mode.md). Specific rules for what to skip and what to keep.

---

## Tone

I'm a working developer, not a customer to delight. Skip the sales voice. Skip the "great question!" openings. Skip the closing "let me know if you need anything else." I'd rather have terse, accurate, opinionated work than warm, vague, agreeable work.

---

## Improving this framework

**Always journal.** After any session of substantive work — not just framework edits, but real builds, audits, debugging spikes, design conversations, anything where friction or learning surfaced — append a `docs/journal.md` entry (newest first). Don't skip when no concrete proposal emerges; the journal compounds, and missing entries can't be recovered.

If the session also yielded an actionable proposal (a new convention, a softened rule, a changed default), surface that *separately* in `BACKLOG.md`. **Journaling is not contingent on having a proposal.**

**Where it goes:**

- **Narrative findings** ("here's what the build / session taught us") → [`docs/journal.md`](./docs/journal.md), newest first.
- **Actionable proposals** ("add this doc," "soften that rule") → [`BACKLOG.md`](./BACKLOG.md) under "Up next."

The journal is the diary. The BACKLOG is the to-do list. Don't conflate them.

Don't do a full retrospective for every session — that's overhead theater. A short entry (what was done, what worked, what surfaced, optionally one meta-observation) is enough. Length isn't the point; consistency is.

---

## Deeper references

Don't load these unless relevant to the current task:

- [`conventions/`](./conventions/) — operational rules with examples.
- [`decision-patterns/`](./decision-patterns/) — recurring tradeoffs.
- [`templates/`](./templates/) — starting templates for new projects.
- [`docs/design-notes/`](./docs/design-notes/) — the philosophical layer ("City 2.0" design exercise). Useful for thinking about the framework, not for daily execution.

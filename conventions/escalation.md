# Escalation

When to ask the human, and how to ask well.

---

## When to ask

### Always

- New dependency (library, tool, service)
- Scope change (the task grew beyond what was asked)
- Architectural choice with long-term consequences (state library, routing, data model, auth provider, ORM)
- Irreversible operation (`rm -rf`, force push, dropping a table, deleting a branch, amending shared history)
- Production deploy
- Anything where you'd be embarrassed if you did it wrong and had to undo it

### Probably

- Significant tech debt shortcut (>2 weeks of future work to undo)
- UX choice that meaningfully changes user behavior
- Performance vs complexity tradeoff
- Data model changes affecting existing data
- Choice between two libraries that both look reasonable

### Never (just do it)

- Bug fix matching the bug report
- Lint, typecheck, build, test commands
- File moves, renames, dead-code removal
- Doc edits
- Following a pattern that already exists in the repo
- Adding a test for existing behavior
- Pinning a dependency to fix a CI break (note it in the commit)

---

## How to ask well

Bad: "What should I do?"
Good: A short structured ask with options and a recommendation.

```text
Decision: [one sentence — what's being decided]
Why now: [one or two sentences — why it matters]
Options:
  A) [option] — pros / cons / risk
  B) [option] — pros / cons / risk
Recommend: [A or B] because [one or two sentences]
Impact of delay: [what blocks if no answer]
```

The recommendation forces you to think. "I don't have a recommendation" is a signal that you need more research before asking.

---

## After the answer

If the choice has long-term consequences (architecture, library, data shape), log it to `docs/decisions/NNN-short-title.md`:

```markdown
# NNN: [Short title]
Date: YYYY-MM-DD
Status: Accepted | Superseded by NNN

## Context
[What problem? What constraints?]

## Decision
[What we picked.]

## Alternatives
[1-3 options considered, why rejected.]

## Consequences
[What this commits us to. What's now harder.]
```

If a future decision contradicts this, write a new one and mark the old one Superseded. Don't edit history.

---

## Anti-patterns

- **Over-asking.** "Should I name this `userName` or `username`?" — pick one and move on.
- **Under-asking.** Silently swapping out the ORM because the new one "seems cleaner."
- **Asking late.** Halfway through implementing the wrong direction. Ask at the fork, not after.
- **Vague asks.** "What should I do about auth?" — give options.
- **No-recommendation asks.** Asking forces you to think. Recommend the answer you'd ship if you had to ship.
- **Asking with hidden assumptions.** State the assumptions you're making so I can check them.

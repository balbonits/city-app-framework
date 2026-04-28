# Speed Run Mode

When the human says "I want this fast, don't overthink it" — relax the standards as follows. Speed Run is for personal tools, prototypes, and throwaways. Don't apply it to anything user-facing or with data that matters.

---

## What you can skip

- **Full test coverage.** Aim for ~60% on core logic. Skip UI tests entirely.
- **Accessibility audit.** Basic keyboard navigation is enough. Don't skip semantic HTML — it's free.
- **Schema versioning.** Acceptable if the project is throwaway or personal-only.
- **Error boundaries and loading states.** Skip for tiny scopes. The error will be visible, that's fine for a prototype.
- **Detailed documentation.** Inline comments only where non-obvious.
- **ADRs in `docs/decisions/`.** Note tradeoffs in commit messages instead.
- **Performance optimization.** Ship the slow version. Optimize if you keep using it.

---

## What you must keep

- **Core functionality works end-to-end.** The thing actually does what was asked.
- **No crashes on the happy path.**
- **Auto-save / persistence** if applicable. Don't make me lose work to save you 10 minutes.
- **Dark mode** if it has a UI. Non-negotiable preference.
- **Responsive layout** (mobile-first).
- **Anti-overengineering rules still apply.** "Fast" doesn't mean "sloppy abstraction." It means less scope, not worse code.
- **Sensible commit history.** Even speed runs should be reviewable.

---

## After the speed run

If the project becomes important (used daily, shared, evolving), schedule a "harden it" pass:

1. Add tests around the riskiest logic
2. Add schema migration if the data shape will evolve
3. Run an a11y pass
4. Write a few decision notes for the choices made under speed pressure
5. Audit dependencies — speed runs sometimes pull in libraries that aren't actually needed

If the project stays small and stays useful, leave it alone. Code that works and isn't being changed doesn't need polishing.

---

## Signals that Speed Run Mode is wrong

- The project will store user data that matters.
- More than one person will use it.
- It's user-facing in any way you'd be embarrassed about.
- It's going to live for a year+.
- It's going to be referenced as an example of how I build.

In any of those cases, don't speed-run. Build properly.

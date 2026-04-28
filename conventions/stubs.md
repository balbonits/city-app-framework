# Stubs

Living ledger of integration stubs, hardcoded values, and blocked tasks tracked in a `STUBS.md` at the repo root. Each entry has a **file path**, **line number**, and a **"Remove when…"** exit criterion.

This is for the placeholders that compile but lie — the gap between "code that runs" and "code that's actually finished."

---

## When to use this

Adopt a `STUBS.md` if your project has more than ~3 stubs, hardcoded values, or partially-wired integrations. Below that threshold, code TODOs are fine.

Always adopt it for projects that:

- Integrate with a backend not yet shipped.
- Use third-party services in sandbox/test mode.
- Live behind feature flags awaiting a real cutover.

---

## Format

```markdown
# STUBS

## [Domain or area]

### `path/to/file.ts:LINE` — Brief description

[1-3 sentences of context: why is this stubbed, what's the real version supposed to do?]

**Remove when:** [Exit criterion — "backend ships X", "decision Y is made", "feature Z lands."]
```

---

## Example

```markdown
# STUBS

## Auth

### `src/hooks/useAuth.ts:45` — Hardcoded admin role for current user

Token refresh isn't wired up yet, so we're returning `role: 'admin'` for every authenticated user. The real version reads role from JWT claims.

**Remove when:** Backend issues JWTs with `role` claim AND refresh-token rotation lands.

## Events

### `src/pages/EventPublic.tsx:314` — `performerSlug` hardcoded to `'john-dilig'`

Backend currently returns `selectedPerformer` as an ID string instead of a populated object. Page needs the slug to build the URL.

**Remove when:** Backend populates `selectedPerformer` as a full object with `slug` field.
```

---

## Why a file (not just `// TODO`)

- **Code TODOs hide.** A `// TODO` next to one of fifty stubs disappears under noise. A central ledger surfaces them.
- **Reviewers see the surface area.** "How much of this is real?" is answerable in seconds.
- **Removal is intentional.** Each entry has a closing condition. Without one, the stub is at risk of becoming permanent fixture.

---

## What goes in / what doesn't

**In:** hardcoded values waiting for real data, mocked API responses, stubbed integrations, feature flags awaiting backend, blocked tasks waiting on another team or decision.

**Not in:** known bugs (use the issue tracker), tech debt without a removal trigger (use `BACKLOG.md`), missing features that are explicitly future work (use `BACKLOG.md`), comments explaining tricky code (those stay in the code).

---

## Splitting

If frontend and backend stubs accumulate independently, split into `FE_STUBS.md` and `BE_STUBS.md`. Otherwise one file is fine — split when scrolling becomes friction, not preemptively.

---

## Lifecycle

When a stub is resolved:

1. Remove the entry from `STUBS.md`.
2. The commit message should reference what it resolved: `feat: real performer slug from backend (resolves STUBS.md/Events)`.
3. If the resolution introduces a *new* stub elsewhere, add that entry in the same commit.

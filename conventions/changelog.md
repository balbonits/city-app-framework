# Changelog

Every project should maintain a `CHANGELOG.md` at the repo root tracking visible deltas over time.

The format follows [Keep a Changelog](https://keepachangelog.com), with one project-specific refinement: the **two-commit cycle**, to handle the chicken-egg of including a commit hash in its own message.

---

## Format

```markdown
# Changelog

## [Unreleased]

### Added
- New feature one. ([abc1234](commit-link))

### Changed
- Behavior change. ([def5678](commit-link))

### Fixed
- Bug fix. ([ghi9012](commit-link))

## [1.2.0] - 2026-04-28

### Added
- ...
```

Sections: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`. Skip sections with no entries — don't render empty headings.

---

## The two-commit cycle

You can't include a commit's own SHA in its own message — the SHA isn't computed yet. Naively trying creates an infinite loop: commit A documents itself, commit B documents A, commit C documents B, forever.

**The solve: pair every work commit with a documentation commit.**

| Commit | Purpose | What changes |
| --- | --- | --- |
| A | The actual work | Feature / fix code |
| B | Documents A in the CHANGELOG | `CHANGELOG.md` only, references A's hash |

Don't write a commit C documenting B. The cycle ends after one round-trip per work commit.

A typical sequence:

```text
abc1234  feat: add login form
def5678  docs: changelog entry for abc1234

ghi9012  fix: prevent stale token reads
jkl3456  docs: changelog entry for ghi9012
```

If multiple work commits ship together (e.g. as one PR), one CHANGELOG entry per PR is fine — list each commit hash inline.

---

## What goes in / what doesn't

**In:** user-visible changes, behavior changes, breaking changes, new features, bug fixes, deprecations, removals, security fixes.

**Not in:** refactors that don't change behavior, internal renames, comment-only edits, doc updates, tooling tweaks. These belong in commit history but not the CHANGELOG. The CHANGELOG is for changes someone *using* the project would notice.

---

## When to skip

- **Single-commit project.** If every change is a release, the README is enough.
- **Throwaway prototypes.** Speed Run Mode skips this.
- **Solo project, no users yet.** Optional; the git log is the changelog. Adopt one when the project gains other consumers (humans or services).

When you do adopt it, do so retroactively — write a single `## [0.1.0]` entry summarizing what's there and start the discipline going forward.

---

## Why this and not "release notes"

Release notes are for releases. The CHANGELOG covers the full continuous deltas, which is what someone using main, a beta channel, or following commits actually needs. Release notes can be derived from the CHANGELOG by selecting the entries between two version tags.

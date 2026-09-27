# 001: Rebuild as a small, tested kit

Date: 2026-09-27
Status: Accepted

## Context

v3 (May 2026) was an AGENTS.md framework: a universal rules file, ~40 convention docs, decision-pattern docs, templates, a journal, and a demo site. Four months later:

- Claude Code, Codex, Cursor, Copilot and Grok all read AGENTS.md natively, and project scaffolders (create-next-app) generate it.
- The "Sponsor states intent, a council of agents builds it" loop from v2 now ships in products (Claude Code `/goal`, Projects, workflows; Factory Missions; Devin; Gas Town, which even has a "Mayor").
- Controlled studies found context files rarely raise task success; they mostly change cost and specific behaviors.

We tested v3 directly (see `docs/findings-2026-09.md`):

- Its `CLAUDE.md` pointer ("Read AGENTS.md") stops Claude Code from loading AGENTS.md automatically; its universal rules sat behind a GitHub link no agent fetched (0 of 25 runs).
- With the rules force-loaded, the anti-overbuild and no-new-deps rules showed no effect: the bare model already behaved.
- Its escalation table made agents stop and ask instead of building, even when they judged the delay harmless (3 of 5 runs).
- Its journal never reached the next session: 0 of 5 runs read it, so 0 of 5 applied its lesson.

## Decision

Replace v3 with:

1. A 28-line AGENTS.md template (project facts plus an 8-line working agreement), loaded through `CLAUDE.md` = `@AGENTS.md`.
2. Hooks for the few things that must never happen without a human: new dependencies, force-push, production deploys, deleting tests, finishing with red tests or newly skipped tests.
3. A `reviewer` subagent the human can call on request (it caught nothing on small tasks, so it is not a default step), and a `lesson` skill that turns corrections into checks or one-line rules.
4. An installer script and tests for all of the above.
5. The experiment harness, kept in the repo so every rule can be re-tested when models change.

Everything else (conventions, decision patterns, templates, design notes, journal, demo site) is removed from the working tree. It stays in git history at commit `739c334`.

## Alternatives

- **Keep v3 and patch the bugs.** Fixing the import and inlining the rules still leaves ~5,000 lines of mostly redundant or unreachable guidance. Rejected.
- **Build the v2 autonomy layer for real.** Now a commodity with better-funded implementations, and role-based councils have the weakest evidence of any multi-agent design. Rejected.
- **Ship as a Claude Code plugin now.** Nice for updates, but copy-in files work everywhere (local, cloud sessions, other agents) and are easy to test. Deferred to BACKLOG.

## Consequences

- The framework is small enough to read in five minutes, and every rule points to evidence or to a hook.
- Results come from one model family on one small app; they should be re-run on new models and on a front-end fixture before being treated as general.
- The Vercel demo site (`examples/website/`) is gone from the tree. If a Vercel project builds from that folder on `main`, its next build will fail until the project is unlinked or pointed elsewhere; the current deployment stays up.

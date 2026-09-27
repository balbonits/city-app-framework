# BACKLOG

Next steps, most useful first. Each one should end with an experiment result, not just a doc.

## Up next

- **Add a React + Vite fixture to the harness.** The current test app is a tiny Node CLI. Re-run the key tasks (an ambiguous feature ask, a dependency-tempting ask, a lesson) on a front-end app, since that's the real workload.
- **Run the suite on each new model release.** Drop any kit rule that stops showing an effect; add one when a new failure shows up twice. Keep the results folder per model and date.
- **Add CI.** Run `npm test` (hooks and installer) on every PR with GitHub Actions.
- **Measure the reviewer on genuinely hard work.** On the small tasks tested so far, the solo agent was already right and the reviewer only added cost. Try a multi-file feature or a bug hunt where solo agents fail often.

## Considered, deferred

- **Ship the kit as a Claude Code plugin** (hooks, reviewer, lesson skill) so updates reach every project at once. Deferred until copy-in files cause real drift across projects; copy-in works everywhere today, including cloud sessions and other agents.
- **Bring back the UI design rules** (v3 `conventions/ui-design/`, in git history at `739c334`) as a skill, and test them against Anthropic's `frontend-design` plugin with screenshot-based scoring. Worth it only if the test shows a visible difference.
- **Auto-capture lessons** (an agent proposes a check after every correction without being asked). Deferred: a human approving each lesson is the main defense against bad or poisoned memory.

## Recently shipped

- v4 rebuild: kit, installer, tests, experiment harness, findings (`docs/findings-2026-09.md`, `docs/decisions/001-rebuild-as-tested-kit.md`).

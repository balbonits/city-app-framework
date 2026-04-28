# BACKLOG

Proposed improvements to the universal framework layer — `AGENTS.md`, `conventions/`, `decision-patterns/`, `templates/`. Per the "Improving this framework" rule in `AGENTS.md`: agents propose, human decides.

Updated whenever a session surfaces real friction worth fixing.

---

## Up next

- **Add `conventions/design-tokens.md`.** Document the Tailwind v4 + tokens.css pattern verbatim: `@theme inline` self-reference, cascade layer order (`@layer tokens, theme, base, components, utilities;`), `[data-theme]` flip with `@custom-variant dark`, FOUC-prevention inline script in `index.html`. Surfaced building `examples/website/`. Without this doc, every UI project reinvents the pattern (often badly).

- **Expand `templates/project-AGENTS.md`** with sections for: theme system, public assets (favicon, OG image, `theme-color` meta), deployment platform specifics (Vercel project name, env vars, custom domain), SEO meta tags. Surfaced building `examples/website/` — had to add all these sections ad-hoc.

- **Clarify the "no recaps" rule in `AGENTS.md`.** Currently too binary. Distinguish in-flight narration (avoid: "I edited X. I edited Y. I committed.") from end-of-task summary (allowed: a brief report after multi-step work the human didn't watch). Surfaced when finishing a long autonomous build.

- **Add an "Auto-mode contract" section to `AGENTS.md`.** When the human says "auto mode, don't call me until done," some rules need re-stating: prod deploys still escalate, irreversible ops still escalate, "ask vs proceed" still applies. The current AGENTS.md leaves this implicit. Surfaced when Vercel `--prod --yes` got blocked — correctly — but the framework hadn't said it would.

- **Add guidance on "ambiguous-ask product decisions."** "Build exactly what's asked" handles clear asks; the "ask vs proceed" table handles escalation. Neither covers what to do when the ask is underspecified ("build a website") but auto-mode means you can't ask. Current answer: make decisions, document via ADRs. Worth saying so explicitly.

## Considered, deferred

- **Per-agent (Claude vs Grok) phrasing notes.** Grok flagged that current rules tilt toward how Claude responds. Could split or annotate. Deferred until we see specific friction in real Grok usage; speculative now.

- **Mandatory post-mortem after every project.** Briefly considered restoring the v2 ceremony. Rejected: the lightweight "propose one concrete improvement" rule covers 90% of the value with 10% of the overhead. Don't bring back the formal retrospective unless real projects start losing learnings.

- **A `conventions/git-workflow.md`.** Conventional commits already covered in `AGENTS.md`. ADRs covered in `conventions/escalation.md`. BACKLOG hygiene covered in per-project AGENTS template. Adding a separate git doc would mostly restate what's already documented elsewhere.

- **Restoring the Sponsor + 7-department Council structure.** Decided collaboratively (with Grok): the "How we work" paragraph in `README.md` covers the relational framing without the theater. Departments stay in `docs/design-notes/`.

## Recently shipped

- **Universal AGENTS.md + operational conventions + decision-patterns + templates.** Bulk slim-down of the v2 framework, replacing the philosophical 22-doc structure with operational rules. ([`bc29600`](https://github.com/balbonits/city-app-framework/commit/bc29600))
- **Grok's review feedback applied.** Proactive-suggestion rule (#8), "How we work" in README, "Improving this framework" section, softened decision-patterns prose. ([`17f17ad`](https://github.com/balbonits/city-app-framework/commit/17f17ad))
- **First dogfood — `examples/website/`** with full per-project doc set, deployed to Vercel. Survived first contact: stack alignment worked, ADR pattern worked, anti-overengineering held. ([`2293b14`](https://github.com/balbonits/city-app-framework/commit/2293b14))

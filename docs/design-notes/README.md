# Design Notes

Earlier iterations of this framework. Preserved for reference, not loaded by AI agents in daily execution.

## What's here

The "City 2.0" philosophical design exercise (April 2026):

- **`00_OVERVIEW.md`** — The pitch.
- **`01_VISION_AND_PRINCIPLES.md`** — The 8 Constitutional Principles.
- **`02_GOVERNANCE_MODEL.md`** — Sponsor + AI Council with 7 departments.
- **`03_OPERATING_SYSTEM.md`** — 5-layer architecture, scaling tiers (Village → Metropolis), project lifecycle.
- **`04_BLUEPRINT_FOR_AI.md`** — Operating manual for AI agents inside the system.
- **`AI_PROMPT_LIBRARY.md`** — Reusable prompt templates.
- **`CONVENTIONS.md`** — Living conventions doc (the operational bits were extracted into the top-level `conventions/` directory).
- **`DECISION_FRAMEWORK.md`** — Decision-making process and patterns (operational patterns were extracted into top-level `decision-patterns/`).
- **`DEV_JOURNAL.md`** — Project journal of the framework design itself.
- **`ESCALATION_PROTOCOL.md`** — When and how to escalate (slimmed into top-level `conventions/escalation.md`).
- **`GAME_CONVENTIONS.md`** — Game-specific patterns.
- **`GLOSSARY.md`** — Index of terms and patterns.
- **`MONOREPO_CONVENTIONS.md`** — Turborepo + pnpm workspace conventions.
- **`PHILOSOPHY.md`** — The OS vs Framework two-layer model.
- **`PROJECT_STRUCTURE.md`** — Canonical folder layout.
- **`QUICKSTART.md`** — How a Sponsor onboards into a new City 2.0 project.
- **`SCOPE_AND_FOCUS.md`** — What City 2.0 covers and doesn't.
- **`SECURITY_AND_COMPLIANCE.md`** — Mandatory security/compliance rules.
- **`SIMULATION_*.md`** — Four written-out thought experiments (habit tracker, fast notes app, endless runner game, SaaS suite).

## Why preserved

The thinking in these docs informed what got promoted into the operational layer. The metaphors (Sponsor + Council, 8 Principles, scaling tiers) didn't survive the slim-down because they don't operationalize well into agent behavior — but the *intent* behind them did. Where you see a rule in the top-level `AGENTS.md` or `conventions/`, there's usually a longer rationale here.

The simulations are also useful as design exercises for new project types — not as evidence the framework "works," but as ways to surface what kinds of decisions a framework needs to answer.

## Why not loaded by default

These are 22 files, ~210KB of prose. Loading them into agent context every session would burn through the budget on philosophy when the agent should be reading code and operational rules. The slim top-level `AGENTS.md` + targeted `conventions/` files give better first-prompt alignment per token.

If a question genuinely needs the philosophical layer ("how should I think about scaling tiers for this new monorepo project?"), an agent can pull the relevant `design-notes/` file on demand.

# The City 2.0 — Operating System

## Overview

This document defines the **practical operating system** — how The City 2.0 actually works day-to-day, from project start to continuous improvement.

The system is designed so that an AI can largely **self-guide** once the Sponsor provides initial intent.

**Note on Adaptability**: The Operating System layer works across all project types and sizes — from small personal tools (Village) to full app suites (Metropolis) and even games. The Framework layer (conventions, prompts, structure) can be relaxed for speed (see "Speed Run Mode" in `CONVENTIONS.md`) or extended for new domains (see `GAME_CONVENTIONS.md` and `MONOREPO_CONVENTIONS.md`).

---

## The 5-Layer Architecture (Practical View)

| Layer | Name                  | What It Contains                                      | Who Maintains It          | Update Frequency |
|-------|-----------------------|-------------------------------------------------------|---------------------------|------------------|
| 0     | Constitution          | The 8 non-negotiable principles                       | Human Sponsor (only)      | Rare             |
| 1     | Sponsor Intent        | Project vision, success criteria, constraints         | Human Sponsor             | At kickoff + major changes |
| 2     | Living Codex          | Evolving conventions, patterns, preferences, standards| AI Council (Knowledge dept) | After every project |
| 3     | Project Context       | Architecture decisions, user stories, technical notes | AI Council                | Continuously     |
| 4     | Execution & Monitoring| Code, tests, docs, CI/CD, health dashboards           | AI Council                | Continuously     |

---

## Project Lifecycle (Autonomous Flow)

### Phase 0: Sponsor Intent Capture (Human + AI)
**Duration**: 15–45 minutes

The Sponsor provides:
- High-level vision (3–8 sentences)
- Success criteria (what "done well" looks like)
- Any hard constraints (tech stack, timeline, target users, compliance needs)
- Optional: Reference projects or examples

The AI Council (Strategy department) then produces:
- A **Project Charter** (1–2 pages)
- Proposed architecture and tech choices
- Risk assessment
- Estimated complexity tier (Village / Town / City / Metropolis)

**Gate 1**: Sponsor approves the Project Charter (or iterates).

---

### Phase 1: Autonomous Planning & Setup (AI Council)
**Duration**: 1–4 hours (depending on complexity)

The Council:
- Creates the full project scaffolding (folder structure, configs, CI/CD)
- Sets up `.ai/` context directories with rich initial context
- Writes the initial test suite skeleton (TDD approach)
- Establishes monitoring and health dashboards
- Populates the Project Context layer with decisions and rationale

**No human involvement** unless an escalation gate is triggered.

**Speed Run Mode Note**: When the Sponsor explicitly prioritizes speed ("I want this fast, don't overthink it"), the Council can relax certain conventions (see `CONVENTIONS.md` 8.8). The core functionality, auto-save/persistence, and basic responsiveness are still required — but full testing, accessibility audits, and detailed documentation can be deferred.

---

### Phase 2: Iterative Building (Mostly Autonomous)
**Duration**: Days to weeks

For each major feature or milestone:

1. **Strategy** decomposes the work into clear, testable increments
2. **Engineering + Quality** work in parallel (code + tests written together)
3. **Design** ensures UX consistency
4. **Operations** prepares deployment and monitoring
5. **Review** performs continuous internal audit

**Human Touchpoints** (only when needed):
- Mid-project check-in (optional, Sponsor-initiated)
- Escalation gates (see Governance Model)

---

### Phase 3: Quality Gate & Release (AI Council + Sponsor)
**Duration**: 2–8 hours

Before any major release:
- The Council runs a full **Pre-Release Audit** (code quality, security, accessibility, performance, alignment with intent)
- Produces a **Release Report** with:
  - What was built
  - How it aligns with original vision
  - Known limitations and technical debt
  - Recommended next steps
- **Gate 2**: Sponsor reviews the Release Report and approves deployment (or requests changes)

---

### Phase 4: Post-Mortem & System Improvement (AI Council)
**Duration**: 1–3 hours (automated + synthesis)

After every significant milestone or project completion:

1. **Knowledge** department leads a structured retrospective
2. The Council identifies:
   - What worked exceptionally well
   - What caused friction or rework
   - Patterns that should be codified
   - Gaps in the Living Codex
3. Proposed updates to conventions, prompts, or governance are generated
4. **Gate 3** (optional): Sponsor reviews and approves major convention changes

The system **must** produce at least one concrete improvement to itself after every project.

---

## Scaling Tiers (Automatic Complexity Adjustment)

The system detects project size and adjusts its own overhead:

| Tier        | Typical Scope                     | Active Departments | Context Depth | Review Rigor | Human Touchpoints |
|-------------|-----------------------------------|--------------------|---------------|--------------|-------------------|
| **Village** | Scripts, CLI tools, small utilities | 2–3               | Light         | Medium       | Minimal (often just final approval) |
| **Town**    | Small-medium apps, personal tools | 4–5               | Standard      | High         | 2–3 gates         |
| **City**    | Full applications, SaaS MVPs      | 6–7               | Rich          | Very High    | 3–4 gates         |
| **Metropolis** | Large platforms, monorepos     | 7+ + specialists  | Very Rich     | Maximum      | Strategic oversight only |

The AI Council chooses the tier during Phase 0 and can propose upgrades if scope grows.

---

## Daily / Feature Workflow (Autonomous Mode)

When the Sponsor says: *"Add user profile editing with avatar upload and email verification"*

The AI Council executes the following loop with minimal human input:

1. **Strategy** reads full context → produces implementation plan + test strategy
2. **Engineering** implements the feature (following Codex)
3. **Quality** writes/updates tests first, then validates
4. **Design** ensures component fits existing patterns
5. **Review** audits for security, accessibility, performance, and convention compliance
6. If all checks pass → change is committed with full rationale in commit message
7. If any check fails or uncertainty exists → escalation or self-correction

The Sponsor only sees the result (or an escalation request).

---

## Self-Improvement Engine

This is the most important differentiator of City 2.0.

After every project, the Knowledge department produces:

- **Delta Report**: What changed in the system's behavior or output quality
- **Convention Proposals**: Specific updates to the Living Codex
- **Prompt Improvements**: Refined prompt templates based on what worked
- **Governance Adjustments**: Recommendations for escalation thresholds or role definitions

These are not suggestions — the system is **required** to implement approved improvements before starting the next project.

Over time, this creates a **compounding advantage**: each project makes the next one faster, higher quality, and more aligned with the Sponsor's preferences.

---

## File Structure (Standard)

Every City 2.0 project contains:

```
/project-root/
├── .ai/                          # AI Council context (never delete)
│   ├── MASTER_CONTEXT.md         # Project-wide understanding
│   ├── SPONSOR_INTENT.md         # Original vision + updates
│   ├── LIVING_CODEX.md           # Current conventions (synced from global)
│   ├── DECISIONS.md              # Architecture and trade-off log
│   ├── departments/              # Role-specific context
│   └── retrospectives/           # Post-mortem outputs
├── src/                          # Application code
├── tests/                        # Test suite (comprehensive)
├── docs/                         # Human-readable documentation
├── .github/                      # CI/CD, issue templates, PR templates
├── city.config.json              # City 2.0 project configuration
└── README.md                     # Sponsor-facing overview
```

---

## Tool Integration (2026 Native)

The system is designed to work seamlessly with:

- **Claude Projects / Claude Code** — Primary reasoning and planning engine
- **Cursor** — Deep codebase editing and context awareness
- **GitHub Copilot Workspace** — Task decomposition and multi-file edits
- **Linear / Jira** — Issue tracking with AI-generated tickets
- **Vercel / Railway / Fly.io** — One-command deployments with health checks

All prompts and workflows are optimized for these tools.

---

## Anti-Patterns the System Must Avoid

- Treating every project as "City" tier when "Town" would suffice
- Allowing context files to become stale or bloated
- Escalating too frequently (wasting Sponsor time)
- Escalating too rarely (hiding problems)
- Failing to feed learnings back into the Living Codex
- Optimizing for AI convenience rather than Sponsor intent

---

*This operating system is designed to be executable by AI agents with high fidelity. The goal is not to constrain creativity, but to channel it toward consistent, high-quality, autonomous execution.*
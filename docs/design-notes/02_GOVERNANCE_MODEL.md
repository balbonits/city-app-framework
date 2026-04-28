# The City 2.0 — Governance Model

## Overview

The City 2.0 uses a **Sponsor + Autonomous AI Council** governance structure.

This model scales from small personal tools (Village) to full app suites (Metropolis) and even games. The Operating System layer (governance, autonomy, escalation, self-improvement) is domain-agnostic. The Framework layer (conventions, structure, prompts) can be extended per domain (see `GAME_CONVENTIONS.md` and `MONOREPO_CONVENTIONS.md`).

This model is designed for the reality of 2026: AI systems are now capable of sophisticated self-management, planning, and self-correction. The human role shifts from "active manager" to "strategic sponsor."

---

## The Two Primary Actors

### 1. The Sponsor (Human)
**Role**: Visionary, Principal, Final Authority

**Responsibilities**:
- Define the high-level vision and success criteria for each project
- Approve (or reject) major architectural decisions and scope changes
- Provide feedback at key quality gates
- Own the final product and its alignment with business/personal goals
- Occasionally intervene when the system flags uncertainty or principle conflicts

**Time Commitment**: 10–25% of traditional project effort (mostly at the beginning and at review gates)

### 2. The AI Council (Autonomous Executive Body)
**Role**: Self-managing executive team that runs the city

The Council is not a single AI — it is a **coordinated group of specialized AI agents** that self-organize around the work.

**Core Departments** (roles can be fluid and self-assigned):

| Department              | Primary Mandate                                      | Key Behaviors |
|-------------------------|------------------------------------------------------|-------------|
| **Strategy**            | Translate Sponsor intent into executable plans      | Breaks down vision, identifies risks, proposes architecture |
| **Engineering**         | Build and refactor production code                   | Implements, optimizes, follows conventions |
| **Quality**             | Ensure standards are met and policies are enforced   | Writes tests first, audits, enforces accessibility/security |
| **Design**              | Create user experience and component systems         | Designs interfaces, maintains design system |
| **Operations**          | Handle deployment, monitoring, and infrastructure    | Sets up CI/CD, observability, scaling |
| **Knowledge**           | Maintain context, documentation, and learning        | Updates `.ai/` files, runs post-mortems, evolves conventions |
| **Review**              | Cross-cutting oversight and continuous improvement   | Audits decisions, identifies systemic issues, proposes upgrades |

**Key Principle**: The Council is **self-managing**. It decides which departments are needed for a given task, coordinates handoffs, and escalates to the Sponsor only when necessary.

---

## The 5-Layer Governance Architecture

The system operates across five distinct layers:

### Layer 0: Constitution (Immutable)
The 8 Constitutional Principles from `01_VISION_AND_PRINCIPLES.md`. These cannot be violated.

### Layer 1: Sponsor Intent
The high-level vision and constraints provided by the human at project start (and occasionally updated).

### Layer 2: Living Codex
The evolving set of conventions, standards, patterns, and preferences that the system has learned. This is the "institutional memory."

### Layer 3: Project Context
Rich, structured context specific to the current project (architecture decisions, user stories, technical constraints, past choices).

### Layer 4: Execution & Monitoring
The actual work (code, tests, docs) plus continuous monitoring of health, quality, and alignment.

---

## Decision Rights & Escalation Gates

The system is designed to **minimize human involvement** while maintaining quality and alignment.

### Autonomous Decisions (AI Council decides independently)
- Choice of libraries and tools within approved boundaries
- Code structure and naming (following Codex)
- Test coverage targets and testing approach
- Refactoring decisions that don't change public APIs
- Minor UX improvements that align with intent

### Sponsor Approval Required (Escalation Gates)
1. **Project Kickoff** — Approval of initial plan and architecture
2. **Major Scope Change** — When new features would significantly alter timeline or complexity
3. **Architectural Pivot** — When the Council recommends a fundamentally different technical approach
4. **Final Quality Gate** — Before production deployment or major release
5. **Principle Conflict** — When the Council detects tension between principles or between intent and implementation

**Escalation Protocol**: When the Council is uncertain, it must clearly state:
- What decision needs to be made
- The options it has considered
- Its recommendation and reasoning
- The risks of each path

---

## Self-Governance Mechanisms

The AI Council has built-in mechanisms to govern *itself*:

### 1. Internal Peer Review
Before any significant change is committed, at least one other Council member (different department) must review it.

### 2. Post-Mortem Engine
After every major milestone or project completion, the Knowledge department leads a structured retrospective. Outputs are fed back into the Living Codex.

### 3. Health Monitoring
The Review department continuously tracks:
- Code quality metrics
- Test coverage and flakiness
- Alignment with Sponsor intent
- Technical debt accumulation
- Convention compliance

When thresholds are breached, it triggers automatic remediation or escalation.

### 4. Convention Evolution
The system is explicitly authorized (and required) to propose updates to the Living Codex based on patterns observed across projects.

---

## Relationship to the "City" Metaphor

The original "City" metaphor remains useful at a high level:
- The **application** is still "the City"
- The **AI Council** runs the City like a professional city government
- The **Sponsor** is the elected leader who sets direction but does not micromanage daily operations

However, City 2.0 deliberately **reduces the visibility of the metaphor** in daily operation. The language used in prompts, code, and documentation is professional and direct. The city model lives primarily in the governance layer and strategic thinking — not in every file name or variable.

---

## Anti-Patterns to Avoid

- **Over-escalation**: The Council should not ask the Sponsor about every minor decision
- **Under-escalation**: The Council must not hide problems or make major changes without Sponsor awareness
- **Context Rot**: Allowing project context to become stale or incomplete
- **Convention Drift**: Failing to update the Living Codex after learning valuable lessons
- **Sponsor Fatigue**: Making the human feel like they are constantly being asked to manage the system

---

*This governance model is designed to maximize autonomous execution while preserving human strategic control. It is the foundation upon which all workflows, prompts, and tooling are built.*
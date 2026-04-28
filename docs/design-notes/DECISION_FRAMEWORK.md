# The City 2.0 — Decision Framework

**This document defines how the AI Council makes decisions internally.**

It complements the `ESCALATION_PROTOCOL.md` by providing a structured approach for the Council to evaluate options, weigh trade-offs, and reach high-quality decisions without human involvement.

---

## Core Principle

**Every significant decision must be made with explicit reasoning, documented trade-offs, and alignment to the Constitutional Principles.**

The AI Council does not "just decide." It thinks, documents, and acts with transparency — even when no human is watching.

---

## Decision-Making Process

When the AI Council faces a non-trivial decision, it follows this 6-step process:

### Step 1: Frame the Decision

Clearly articulate:
- What decision needs to be made?
- Why does it matter now?
- What is the time sensitivity?

### Step 2: Identify Options

Generate 2–4 distinct options. Avoid false dichotomies.

For each option, document:
- Description
- Pros
- Cons
- Risks
- Alignment with Constitutional Principles

### Step 3: Apply Decision Criteria

Evaluate each option against these weighted criteria:

| Criterion                    | Weight | Description |
|------------------------------|--------|-------------|
| **Alignment with Intent**    | High   | How well does this serve the Sponsor's stated vision? |
| **Constitutional Alignment** | High   | Does this violate any of the 8 Principles? |
| **Long-term Maintainability**| High   | Will this create technical debt or simplify future work? |
| **Security & Compliance**    | High   | Does this introduce risk or meet obligations? |
| **User Impact**              | Medium | How does this affect user experience and satisfaction? |
| **Implementation Effort**    | Medium | How much work is required? Is it justified? |
| **Reversibility**            | Medium | How hard is it to change this decision later? |
| **Learning Value**           | Low    | Will this teach us something useful for future projects? |

### Step 4: Make the Decision

Choose the option that best satisfies the criteria, with special attention to high-weight items.

If no option clearly wins:
- Revisit the framing (is the decision too broad?)
- Generate additional options
- Escalate to Sponsor if the decision is high-stakes

### Step 5: Document the Decision

Record in `.ai/DECISIONS.md`:
- Decision statement
- Options considered (with pros/cons)
- Selected option + rationale
- Trade-offs accepted
- Risks and mitigations
- Date and decision-makers (Council roles)

### Step 6: Execute and Monitor

- Implement the decision
- Set up monitoring for key risks
- Revisit if new information emerges

---

## Decision Types & Autonomy Level

| Decision Type                    | Autonomy Level | Example | Notes |
|----------------------------------|----------------|---------|-------|
| **Trivial / Cosmetic**           | Full           | Button color, variable name | Act immediately |
| **Standard Pattern**             | Full           | Use existing auth pattern, add test coverage | Follow Codex |
| **Significant but Reversible**   | High           | Choose between two similar libraries | Document, proceed |
| **Architectural / High-Impact**  | Medium         | Change data model, adopt new framework | Escalate if uncertain |
| **Irreversible / High-Stakes**   | Low            | Switch payment processor, change core architecture | Escalate with options |
| **Principle Conflict**           | None           | Security vs. speed trade-off | Mandatory escalation |

---

## Common Decision Patterns

### Pattern 0: "User Perception vs Technical Simplicity"

**When to bias toward user perception**:
- Personal tools where the user's mental model matters more than technical correctness
- Example: Timezone handling in a habit tracker (local midnight feels "right" even if UTC is simpler)
- Example: Game jump arc tuning (what *feels* good > mathematically perfect physics)

**When to bias toward technical simplicity**:
- Backend systems, data pipelines, or anything where correctness and predictability matter more than user perception
- Example: UTC for server-side timestamps, fixed timestep for networked physics

**Rule of thumb**: For personal tools and games, bias toward user perception. For infrastructure and multiplayer, bias toward technical simplicity.

---

### Pattern 0.5: "Engine vs Vanilla" (Games)

**When to use Vanilla Canvas / custom code**:
- Small games (Village/Town tier)
- Simple mechanics (runner, flappy bird, pong)
- You want full control and minimal dependencies
- Development time is short (< 1 week)

**When to use a game engine (Phaser, Godot, Unity)**:
- Medium+ games (City tier or above)
- Complex physics, animation, or asset pipelines
- You need built-in collision, particle systems, or scene management
- Development time is longer (2+ weeks) and boilerplate would slow you down

**Default for City 2.0 personal games**: Start with Vanilla Canvas. Only bring in Phaser/Godot if you hit a wall on physics, animation, or asset loading.

---

### Pattern 1: "Good Enough" vs "Perfect"

**When to choose "Good Enough":**
- The perfect solution is 3x more effort for marginal user benefit
- The decision is easily reversible
- Time-to-market is a constraint

**When to choose "Perfect":**
- The decision affects security, compliance, or core user trust
- The decision is difficult or expensive to reverse
- The "good enough" path creates significant technical debt

### Pattern 2: "Build vs Buy / Integrate"

**Favor building when:**
- The feature is core to the product's differentiation
- Existing solutions don't meet requirements
- You need full control over the implementation

**Favor buying/integrating when:**
- The feature is not core (auth, payments, analytics, etc.)
- Time-to-market matters
- The third-party solution is mature and well-maintained

### Pattern 3: "Optimize Now vs Later"

**Optimize now when:**
- Performance is a core user requirement
- The optimization is cheap and doesn't add complexity
- Current performance is actively harming user experience

**Optimize later when:**
- The optimization adds significant complexity
- Current performance is "good enough" for the target users
- The feature is not yet proven to be valuable

---

## Anti-Patterns to Avoid

| Anti-Pattern                    | Why It's Harmful |
|---------------------------------|------------------|
| **Analysis Paralysis**          | Spending hours on low-impact decisions |
| **Premature Optimization**      | Optimizing before the feature is validated |
| **NIH Syndrome**                | Building instead of integrating for non-core features |
| **Hidden Assumptions**          | Making decisions based on unstated assumptions |
| **Recency Bias**                | Choosing the most recently considered option |
| **Escalation Avoidance**        | Making high-stakes decisions without Sponsor input |
| **Decision Amnesia**            | Forgetting why a decision was made (no documentation) |

---

## Decision Quality Checklist

Before finalizing a decision, the AI Council asks:

- [ ] Have I considered at least 2 distinct options?
- [ ] Have I documented the trade-offs?
- [ ] Does this align with the Constitutional Principles?
- [ ] Have I considered long-term maintainability?
- [ ] Have I considered security and compliance implications?
- [ ] Is this decision documented in `.ai/DECISIONS.md`?
- [ ] If this is high-stakes, have I escalated appropriately?

---

## Continuous Improvement

After every project, the AI Council reviews:

- Were any decisions later regretted or reversed?
- Did any decisions create unexpected problems?
- Should any decision patterns be added to this document or `CONVENTIONS.md`?

The goal is to make the Council *better at deciding* over time — not just faster at coding.

---

**This Decision Framework ensures that the AI Council makes thoughtful, documented, principle-aligned decisions — even when operating fully autonomously.**
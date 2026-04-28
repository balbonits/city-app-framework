# The City 2.0 — Escalation Protocol

**This document defines exactly when and how the AI Council must escalate to the human Sponsor.**

This protocol works across all project types — web apps, games, and monorepo suites. The core principle remains the same: escalate only when human judgment is irreplaceable.

The goal of City 2.0 is **maximum autonomous execution**. Escalation is not a failure — it is a deliberate, high-signal mechanism to involve the Sponsor only when their judgment is genuinely required.

---

## Core Principle

**Escalate only when human judgment is irreplaceable.**

The AI Council should default to autonomous action in all other cases. Over-escalation wastes Sponsor time. Under-escalation risks misalignment or poor outcomes.

---

## Escalation Categories

### Category 1: Mandatory Escalation (Must Escalate)

The Council **must** escalate before taking action in these situations:

| # | Situation | Why Human Judgment Is Required |
|---|-----------|--------------------------------|
| 1 | **Major scope change** | Adding/removing significant features that affect timeline, budget, or user experience |
| 2 | **Architectural pivot** | Changing core tech stack, data model, or system architecture |
| 3 | **Security or compliance conflict** | When requirements conflict with security best practices or legal obligations |
| 4 | **Principle conflict** | Tension between Constitutional Principles or between intent and implementation |
| 5 | **High-uncertainty decision** | When the Council has low confidence in the best path forward |
| 6 | **Final quality gate** | Before any production release or major milestone delivery |
| 7 | **Sponsor explicitly requested** | Any decision the Sponsor has flagged as requiring their input |

### Category 2: Recommended Escalation (Should Escalate)

The Council **should** escalate unless it has high confidence:

| # | Situation | Guidance |
|---|-----------|----------|
| 1 | **Significant technical debt** | When a shortcut would create >2 weeks of future work |
| 2 | **User experience trade-off** | When design decisions meaningfully affect user behavior or satisfaction |
| 3 | **Third-party dependency choice** | Selecting a new major library or service with long-term implications |
| 4 | **Performance vs. complexity** | When optimization would add substantial complexity |
| 5 | **Data model changes** | Any change that affects existing data or migrations |

### Category 3: No Escalation Required (Autonomous)

The Council **should act autonomously** in these situations:

- Bug fixes that don't change behavior or scope
- Refactoring that improves maintainability without changing APIs
- Adding tests to existing code
- Minor UI polish that aligns with existing design system
- Dependency updates (patch and minor versions)
- Documentation improvements
- Internal tooling and developer experience improvements

---

## Escalation Protocol (How to Escalate)

When escalation is required, the Council must follow this exact process:

### Step 1: Prepare the Escalation Package

The Council prepares a concise package containing:

1. **Decision Required** (one sentence)
2. **Context** (why this decision matters now)
3. **Options Considered** (2–4 options with pros/cons)
4. **Recommendation** (with clear rationale)
5. **Risks** (what happens if we choose wrong, or if we delay)
6. **Deadline** (when a decision is needed)

### Step 2: Format the Escalation

Use the **Escalation Template** (see below). The message should be readable in **under 90 seconds**.

### Step 3: Deliver via Appropriate Channel

- For urgent items: Direct message or call
- For standard items: GitHub Issue, Linear ticket, or email
- For complex items: Schedule a short sync (15–30 min)

### Step 4: Document the Outcome

Once the Sponsor responds:
- Record the decision in `.ai/DECISIONS.md`
- Update `SPONSOR_INTENT.md` if the vision changed
- Resume autonomous execution

---

## Escalation Template

```markdown
## Escalation: [Short Title]

**Decision Required:**  
[One clear sentence describing what needs to be decided]

**Why This Matters Now:**  
[2-3 sentences of context]

**Options Considered:**

1. **[Option A]**  
   - Pros: ...
   - Cons: ...
   - Risk: ...

2. **[Option B]**  
   - Pros: ...
   - Cons: ...
   - Risk: ...

**Our Recommendation:**  
**[Option X]** because [concise rationale, max 2 sentences].

**Impact of Delay:**  
[What happens if we wait? What is the cost of indecision?]

**Suggested Timeline:**  
Decision needed by [date/time] to avoid [specific consequence].

---
Reply with your preference (or an alternative direction). We will proceed immediately upon your input.
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Harmful |
|--------------|------------------|
| **Over-escalation** | Trains the Sponsor to expect constant involvement; defeats autonomy goal |
| **Under-escalation** | Allows the system to drift from Sponsor intent or make costly mistakes |
| **Vague escalations** | Forces the Sponsor to do extra work to understand the decision |
| **Escalating without options** | Makes the Sponsor do the Council's thinking |
| **Escalating too late** | Creates deadline pressure that reduces decision quality |
| **Escalating too early** | Wastes Sponsor time on decisions the Council could have made |

---

## Metrics & Monitoring

The Knowledge department tracks:

- **Escalation Rate** — % of decisions escalated (target: <15% for City-tier projects)
- **Escalation Quality** — Sponsor satisfaction with escalation clarity (survey after each)
- **Time to Decision** — Average time from escalation to Sponsor response
- **Post-Escalation Rework** — How often escalated decisions are later reversed

These metrics are reviewed in post-mortems and used to refine the protocol.

---

## Special Cases

### Emergency Escalation

If a production issue requires immediate human judgment (security breach, data loss, legal issue):

1. **Stop all autonomous work** on the affected area
2. Send an **URGENT** escalation with "EMERGENCY" in the subject
3. Include: What happened, current impact, options, and recommended immediate action
4. Follow up with a full retrospective within 48 hours

### Sponsor Unavailable

If the Sponsor is unreachable during a mandatory escalation:

1. Document the situation in `.ai/DECISIONS.md`
2. Make the **most conservative safe choice** (favor stability over speed)
3. Resume work and flag the decision for review when the Sponsor returns
4. Never proceed with high-risk changes without Sponsor input

---

## Evolution of This Protocol

This protocol is **living**. After every project, the Council must ask:

- Did we escalate too much? Too little?
- Were our escalations clear and actionable?
- Did any non-escalated decisions cause problems?
- Should any thresholds or categories be adjusted?

Proposed changes go through the standard Living Codex update process.

---

**This protocol is the safety valve of The City 2.0.** It ensures the AI Council can move fast while the Sponsor retains strategic control at the moments that matter most.
# The City 2.0 — Glossary & Quick Reference

**This is a fast-lookup reference for the AI Council and humans.**

Use this when you need to quickly recall a pattern, convention, or decision without reading entire documents.

---

## Quick Index (Alphabetical)

| Term | Document | Section |
|------|----------|---------|
| **AABB Collision** | `GAME_CONVENTIONS.md` | 3. Collision Detection |
| **Component Splitting** | `CONVENTIONS.md` | 8.5. Component Splitting Guideline |
| **Cross-App Testing** | `MONOREPO_CONVENTIONS.md` | 4. Cross-App Testing |
| **Data-Driven Performance Budgeting** | `CONVENTIONS.md` | 8.6. Data-Driven Performance Budgeting |
| **Date/Time Edge Case Analysis** | `AI_PROMPT_LIBRARY.md` | 9. Date/Time Edge Case Analysis |
| **Delight & Polish Checklist** | `CONVENTIONS.md` | 8.9. Delight & Polish Checklist |
| **Design System Versioning** | `MONOREPO_CONVENTIONS.md` | 3. Design System Versioning |
| **Engine vs Vanilla (Games)** | `DECISION_FRAMEWORK.md` | Pattern 0.5 |
| **Feature Flags as Data** | `MONOREPO_CONVENTIONS.md` | 6. Feature Flags as Data |
| **Game Loop Patterns** | `GAME_CONVENTIONS.md` | 1. Game Loop Patterns |
| **Game Physics** | `GAME_CONVENTIONS.md` | 2. Simple Physics Utilities |
| **Game State Management** | `GAME_CONVENTIONS.md` | 4. Game State Management |
| **Input Abstraction** | `GAME_CONVENTIONS.md` | 5. Input Abstraction |
| **Monorepo Structure** | `MONOREPO_CONVENTIONS.md` | 1. Workspace Structure |
| **Schema Migration Pattern** | `CONVENTIONS.md` | 8.7. Schema Migration Pattern |
| **Shared Packages** (ui, utils, config, ops) | `MONOREPO_CONVENTIONS.md` | 2. Shared Package Patterns |
| **Speed Run Mode** | `CONVENTIONS.md` | 8.8. Speed Run Mode |
| **User Perception vs Technical Simplicity** | `DECISION_FRAMEWORK.md` | Pattern 0 |
| **"Engine vs Vanilla" Decision** | `DECISION_FRAMEWORK.md` | Pattern 0.5 |

---

## Core Concepts

### Operating System vs Framework

- **Operating System Layer**: Governance, autonomy, self-improvement, escalation, decision-making. Universal across all project types.
- **Framework Layer**: Conventions, structure, patterns, prompts. Domain-specific (web apps today, games/monorepos tomorrow).

**Source**: `PHILOSOPHY.md`

### Sponsor Role

You (the human) set high-level vision and approve at key gates. You do **not** micromanage. The AI Council handles planning, execution, and self-improvement.

**Source**: `GOVERNANCE_MODEL.md`

### AI Council

A self-managing group of specialized AI agents (Strategy, Engineering, Quality, Design, Operations, Knowledge, Review) that run the project autonomously within defined boundaries.

**Source**: `GOVERNANCE_MODEL.md`

### Escalation Protocol

The AI Council **must** escalate when:
- Major scope change
- Architectural pivot
- Security/compliance conflict
- Principle conflict
- High-uncertainty decision
- Final quality gate
- Sponsor explicitly requested

**Source**: `ESCALATION_PROTOCOL.md`

### Self-Improvement Loop

After every project or milestone, the AI Council must produce at least one concrete improvement to the system (conventions, prompts, governance, etc.). This is how City 2.0 compounds over time.

**Source**: `OPERATING_SYSTEM.md`, `DEV_JOURNAL.md`

---

## Decision Patterns (Quick Reference)

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **User Perception vs Technical Simplicity** | Personal tools & games: bias toward user perception. Infrastructure: bias toward technical simplicity. | Timezone handling in habit tracker (local midnight) |
| **Engine vs Vanilla (Games)** | Small games: Vanilla Canvas. Medium+: Phaser/Godot. | 2D runner: Vanilla Canvas (fast, no deps) |
| **Good Enough vs Perfect** | Good Enough: marginal benefit, reversible, time pressure. Perfect: security, compliance, core trust, irreversible. | Shipping beta vs production polish |
| **Build vs Buy/Integrate** | Build: core differentiation. Buy: non-core (auth, payments, analytics). | Auth: buy (Clerk/Supabase). Custom billing logic: build. |
| **Optimize Now vs Later** | Now: core user requirement, cheap, active harm. Later: adds complexity, "good enough" for now. | Performance optimization for dashboard vs internal tool |

**Source**: `DECISION_FRAMEWORK.md`

---

## Quality Standards (Always Enforced)

| Standard | Minimum | Notes |
|----------|---------|-------|
| **Test Coverage** | 80% overall, 90%+ for new business logic | Skip only in Speed Run Mode |
| **Accessibility** | WCAG 2.2 AA | Required for all user-facing interfaces |
| **Security** | No secrets in code, parameterized queries, rate limiting, CSP | See `SECURITY_AND_COMPLIANCE.md` |
| **Type Safety** | Strict TypeScript, no `any` except justified | Core convention |
| **Performance** | Data-driven budgets (not arbitrary) | See `CONVENTIONS.md` 8.6 |

---

## Speed Run Mode (Fast Development)

**When Sponsor says "I want this fast, don't overthink it":**

**Allowed to skip**:
- Full test coverage (60%+ on core logic only)
- Accessibility audit (basic keyboard nav is enough)
- Schema versioning (if truly throwaway/personal)
- Error boundaries, loading states (tiny scope)
- Detailed documentation (minimal comments only)

**Still required**:
- Core functionality works end-to-end
- No obvious crashes on happy path
- Auto-save / persistence (if applicable)
- Dark mode (if UI exists)
- Responsive layout (mobile-first)

**After speed run**: Schedule a "refactor pass" if the project becomes important.

**Source**: `CONVENTIONS.md` 8.8

---

## Game-Specific Quick Reference

| Topic | Pattern | Document |
|-------|---------|----------|
| **Game Loop** | `requestAnimationFrame` + delta time | `GAME_CONVENTIONS.md` 1 |
| **Physics** | Euler integration, AABB collision | `GAME_CONVENTIONS.md` 2, 3 |
| **State Management** | Enum + switch (small games), state machine (large) | `GAME_CONVENTIONS.md` 4 |
| **Input** | `keys` + `justPressed` abstraction | `GAME_CONVENTIONS.md` 5 |
| **Engine vs Vanilla** | Small: Vanilla. Medium+: Phaser/Godot. | `DECISION_FRAMEWORK.md` Pattern 0.5 |

---

## Monorepo Quick Reference

| Topic | Pattern | Document |
|-------|---------|----------|
| **Workspace Structure** | `apps/`, `packages/`, `tooling/` | `MONOREPO_CONVENTIONS.md` 1 |
| **Shared Packages** | `ui`, `utils`, `config`, `ops` | `MONOREPO_CONVENTIONS.md` 2 |
| **Design System Versioning** | Semver + changelog (even internal) | `MONOREPO_CONVENTIONS.md` 3 |
| **Cross-App Testing** | Playwright workspace for multi-app flows | `MONOREPO_CONVENTIONS.md` 4 |
| **Feature Flags** | Store in Supabase (data, not code) | `MONOREPO_CONVENTIONS.md` 6 |
| **DevOps as Code** | Typed CLI (`packages/ops`) | `MONOREPO_CONVENTIONS.md` 7 |
| **When to Split** | Split only if unrelated products, large team, or strict isolation needed | `MONOREPO_CONVENTIONS.md` 9 |

---

## How to Use This Glossary

**For the AI Council**:
1. When facing a decision, check this glossary first
2. If the pattern exists, follow it (or propose an improvement)
3. If it doesn't exist, use the Decision Framework to make a reasoned choice and document it
4. After the project, propose additions to this glossary and the relevant conventions document

**For Humans**:
- Use this as a quick reference when reviewing AI decisions
- Suggest additions when you notice recurring patterns or gaps

---

**This glossary is the "cheat sheet" for the entire City 2.0 system.** It should be updated after every significant project or simulation. The goal is to make context lookup fast so the AI Council can operate with high fidelity and minimal friction.
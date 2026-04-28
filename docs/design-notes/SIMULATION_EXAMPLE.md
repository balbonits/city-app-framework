# The City 2.0 — Simulation Example

**This document simulates the City 2.0 system in action on a realistic project.**

**Project**: Personal Habit Tracker Web App  
**Complexity Tier**: Town  
**Duration**: ~4 hours of autonomous work + 2 human touchpoints

---

## Phase 0: Sponsor Intent (Human Input)

**You (the Sponsor) open your AI coding environment and say:**

> "Build a personal habit tracker web app. It should let me:
> - Create habits with name, icon, and target frequency (daily/weekly)
> - Check off habits each day
> - See a streak counter and calendar heatmap
> - View simple stats (current streak, longest streak, completion rate)
> - Work completely offline (localStorage)
> - Have a clean, minimal, calming UI
>
> Keep it simple. I want to use this every day."

---

## Phase 1: AI Council Kickoff (Autonomous)

The AI Council (Strategy + Engineering + Quality + Knowledge) reads:
- Your intent above
- `city.config.json` (Town tier, web app conventions)
- `CONVENTIONS.md`, `PROJECT_STRUCTURE.md`, `SECURITY_AND_COMPLIANCE.md`
- `AI_PROMPT_LIBRARY.md` (Kickoff Planner prompt)

**Council Output — Project Charter:**

```markdown
# Project Charter — Habit Tracker

## Vision Summary
A simple, calming personal habit tracker that helps the user build consistent daily routines. Works completely offline with localStorage. Clean, minimal UI with streak tracking and visual progress.

## Success Criteria
- User can create, edit, and delete habits
- Daily check-ins with visual feedback
- Streak counter and calendar heatmap
- Basic stats (current/longest streak, completion %)
- Fully functional offline
- Loads in < 1.5s
- WCAG 2.2 AA accessible
- Clean, calming aesthetic (soft colors, generous whitespace)

## Scope
**In Scope:**
- Habit CRUD
- Daily check-in system
- Streak calculation
- Calendar heatmap visualization
- Basic stats dashboard
- LocalStorage persistence
- Responsive mobile-first design

**Out of Scope:**
- User accounts / cloud sync
- Social features
- Habit suggestions or AI coaching
- Export/import
- Notifications / reminders

## Technical Approach
- Next.js 14 (App Router) + TypeScript + Tailwind
- Zustand for state management (simple, TypeScript-first)
- date-fns for date handling
- lucide-react for icons
- Recharts or custom SVG for heatmap
- localStorage with simple schema versioning

## Complexity Tier: Town
Justification: Well-defined scope, standard web tech, no external services. Moderate state complexity.

## Risks & Mitigations
- Heatmap performance with many habits → Virtualize or limit visible range
- Streak calculation edge cases (timezone, missed days) → Comprehensive test suite

## High-Level Milestones
1. Project setup + core data model (30 min)
2. Habit CRUD + daily check-in (60 min)
3. Streak logic + calendar heatmap (90 min)
4. Stats dashboard + polish (45 min)
5. Testing + accessibility audit (45 min)
6. Quality gate review

## Immediate Decisions Needed
None — all standard patterns. Proceeding autonomously.
```

**You (Sponsor) reply:**

> "Approved. Looks good. Proceed."

---

## Phase 2: Autonomous Execution (AI Council at Work)

The AI Council self-organizes:

### Step 1: Strategy + Knowledge
- Create full folder structure per `PROJECT_STRUCTURE.md`
- Initialize Next.js, TypeScript, Tailwind, Zustand, date-fns, lucide-react
- Set up `.ai/` context files
- Write initial `MASTER_CONTEXT.md` and `DECISIONS.md`

### Step 2: Engineering + Quality (Parallel)
- Build habit data model + localStorage layer with schema versioning
- Create habit CRUD components following `CONVENTIONS.md`
- Write tests alongside implementation (TDD)
- Implement daily check-in with streak calculation

**Example Internal Council Decision (from `DECISION_FRAMEWORK.md`):**

> **Decision**: How to store habit check-ins?
>
> **Options Considered:**
> 1. Array of dates per habit (simple, but grows over time)
> 2. Map of date → boolean per habit (fast lookup, but more complex)
> 3. Separate "checkins" collection with habitId + date (most flexible)
>
> **Selected**: Option 1 (array of dates) for simplicity. Streak calculation is O(n) but n is small (max 365 entries per habit for a year view).
>
> **Trade-off Accepted**: Slightly slower streak calculation in exchange for much simpler data model and easier debugging.
>
> **Documented in**: `.ai/DECISIONS.md`

### Step 3: Design + Engineering
- Build calendar heatmap component (custom SVG grid, not heavy library)
- Implement stats calculations (current streak, longest streak, completion rate)
- Apply calming color palette (soft blues, greens, generous whitespace)

### Step 4: Review (Internal Audit)
- Run full accessibility audit (keyboard navigation, ARIA labels, contrast)
- Security scan (no secrets, proper input handling — though local-only)
- Performance check (heatmap virtualization for 50+ habits)
- Convention compliance check

**All gates pass autonomously.**

---

## Phase 3: Realistic Escalation Example

**During streak calculation, the Council encounters ambiguity:**

> **Escalation: Streak Calculation Edge Case**
>
> **Decision Required:**  
> How should we handle timezone differences for "daily" habits?
>
> **Context:**  
> User might check in at 11pm in their timezone, but it's already "tomorrow" in UTC. Should we use local midnight or UTC midnight for streak boundaries?
>
> **Options Considered:**
>
> 1. **Use local midnight** (user's device timezone)  
>    - Pros: Matches user's mental model of "today"  
>    - Cons: Inconsistent across devices/timezone changes; harder to test  
>
> 2. **Use UTC midnight** (simpler, consistent)  
>    - Pros: Predictable, easy to test, no timezone edge cases  
>    - Cons: Might feel "wrong" if user checks in late at night  
>
> 3. **Store check-in time + use user's preferred timezone** (most accurate)  
>    - Pros: Perfect accuracy  
>    - Cons: Adds complexity (timezone storage, DST handling) — overkill for this scope
>
> **Our Recommendation:**  
> **Option 1 (local midnight)** because this is a personal habit tracker — the user's perception of "today" matters more than UTC consistency. We'll document this clearly and make it configurable later if needed.
>
> **Impact of Delay:**  
> If we choose wrong, users in late-night timezones might see broken streaks. We can fix this later, but it would be a breaking change to stored data.
>
> **Suggested Timeline:**  
> Decision needed before we finalize streak logic (est. 20 min from now).

**You (Sponsor) reply:**

> "Go with local midnight. I agree — user perception matters more here. Make it clear in the UI that streaks are based on local time."

**Council records the decision and continues.**

---

## Phase 4: Quality Gate Review (Human Touchpoint)

After ~3.5 hours of autonomous work, the Council sends you:

**Release Report — Habit Tracker v0.1**

```markdown
## What Was Built
- Full habit CRUD (create, edit, delete, archive)
- Daily check-in with visual confirmation
- Streak counter (current + longest)
- Calendar heatmap (last 90 days, interactive)
- Stats dashboard (completion rate, best day, consistency score)
- Fully offline with localStorage + schema versioning
- Responsive mobile-first design
- WCAG 2.2 AA compliant
- 87% test coverage (above Town tier target of 80%)

## Alignment with Original Intent
- ✓ Simple and calming
- ✓ Works offline
- ✓ Streak + heatmap visualization
- ✓ Basic stats
- ✓ Loads in ~1.1s

## Known Limitations
- No cloud sync (as scoped)
- Heatmap limited to 90 days (performance)
- No habit templates or suggestions (as scoped)
- Mobile Safari has minor visual glitch on heatmap (non-blocking)

## Technical Debt
- Streak calculation is O(n) — acceptable for < 50 habits
- No migration system yet (simple schema version check only)

## Recommendation
**Approve for personal use.** This is production-ready for a personal tool. Minor polish items can be addressed in v0.2.

**Estimated effort to address all limitations: 2-3 hours.**
```

**You reply:**

> "Approved. This is exactly what I wanted. Ship it."

---

## Phase 5: Post-Mortem & Self-Improvement (AI Council)

After you approve, the Knowledge + Review departments run a structured retrospective.

**Post-Mortem Output:**

```markdown
## Retrospective — Habit Tracker v0.1

### What Worked Well
- Local midnight decision was correct — user loved the "feels right" behavior
- Custom SVG heatmap was faster and lighter than using a charting library
- TDD approach caught 3 streak calculation edge cases early
- Schema versioning pattern worked perfectly for future-proofing

### What Could Be Improved
- We spent ~25 min on timezone research that could have been escalated faster
- Heatmap component grew larger than expected (180 lines) — should have been split earlier
- Missed opportunity to add a "best streak" visual celebration (would have been delightful)

### Patterns Observed
- Custom SVG components are faster and more controllable than heavy charting libraries for simple visualizations
- Streak logic is deceptively complex — always write exhaustive tests for date-based features

### Proposed Improvements to City 2.0

1. **Add to CONVENTIONS.md**: "For simple data visualizations, prefer custom SVG or Canvas over charting libraries unless the chart is complex (multiple series, interactive tooltips, etc.)."
   
2. **Add to AI_PROMPT_LIBRARY.md**: New prompt template for "Date/Time Edge Case Analysis" to help future projects avoid timezone pitfalls.

3. **Add to DECISION_FRAMEWORK.md**: New decision pattern — "When a decision involves user perception vs technical simplicity, bias toward user perception for personal tools."

### Action Items
- [Knowledge] Update CONVENTIONS.md with visualization guideline — Due: Next project
- [Knowledge] Create "Date/Time Edge Case Analysis" prompt template — Due: Next project
- [Review] Add "user perception vs technical simplicity" pattern to Decision Framework — Due: Next project
```

---

## Final Outcome

**What You (the Sponsor) Received:**

- A fully functional, production-ready habit tracker
- ~4 hours of your time (mostly initial intent + 2 reviews)
- A system that got *smarter* for your next project

**What the AI Council Delivered:**

- 100% autonomous execution except for 2 strategic touchpoints
- High-quality code following your conventions
- Clear documentation of every decision
- Concrete improvements to the City 2.0 system itself

**Total Human Time Investment**: ~45 minutes (intent + 2 reviews)  
**Total AI Autonomous Time**: ~3.5 hours  
**System Improvement**: 3 concrete upgrades to City 2.0 for future projects

---

## Key Takeaways from This Simulation

1. **You stayed in the "Sponsor" role** — vision + strategic approval, not micromanagement
2. **The AI Council self-organized** — different departments handled different concerns without you directing them
3. **Escalation was rare but high-signal** — only 1 escalation in the entire project, and it was genuinely useful
4. **The system improved itself** — 3 concrete upgrades were proposed and will be applied before your next project
5. **Quality was enforced** — accessibility, security, testing, and conventions were all checked without you asking

---

**This is what City 2.0 looks like in practice.**

Would you like me to run a second simulation for a **game project** (even if the Framework layer is less mature) to show how the Operating System layer still provides value? Or would you prefer to move into implementation?
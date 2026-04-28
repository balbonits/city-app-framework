# The City 2.0 — Quickstart Guide

**Get started with The City 2.0 in under 30 minutes.**

This guide walks you through creating your first City 2.0 project and running your first autonomous development cycle.

---

## Prerequisites

- Node.js 20+ (or your preferred runtime)
- Git
- An AI coding environment (Claude Projects, Cursor, GitHub Copilot Workspace, or similar)
- 30–60 minutes of focused time

---

## Step 1: Create a New Project

```bash
mkdir my-first-city-app
cd my-first-city-app
git init
```

### Option A: Manual Setup (Recommended for First Time)

1. Copy the City 2.0 blueprint structure into your project
2. Create the `.ai/` directory with initial context files
3. Initialize `city.config.json`

### Option B: Use the City 2.0 CLI (Coming Soon)

```bash
npx create-city-app@latest my-first-city-app
cd my-first-city-app
```

---

## Step 2: Initialize the City Structure

Create the following files and folders:

```bash
mkdir -p .ai/departments .ai/retrospectives src/app src/features src/components/ui tests
touch .ai/MASTER_CONTEXT.md .ai/SPONSOR_INTENT.md .ai/LIVING_CODEX.md .ai/DECISIONS.md
touch city.config.json
```

### Initial `city.config.json`

```json
{
  "version": "2.0.0",
  "projectName": "my-first-city-app",
  "complexityTier": "town",
  "activeDepartments": ["strategy", "engineering", "quality", "knowledge", "review"],
  "escalationThresholds": {
    "maxAutonomousChanges": 10,
    "requireSponsorApprovalFor": ["architecture", "scope", "security"]
  },
  "qualityGates": {
    "minTestCoverage": 80,
    "requireA11yCheck": true,
    "requireSecurityScan": true
  }
}
```

---

## Step 3: Define Your Intent

Create `.ai/SPONSOR_INTENT.md` with your vision:

```markdown
# Sponsor Intent — my-first-city-app

## Vision
I want a simple task management app for personal use. It should let me:
- Create, edit, and delete tasks
- Mark tasks as complete
- Filter by status (all / active / completed)
- Persist data in localStorage

## Success Criteria
- Works offline
- Loads in under 1 second
- Accessible (WCAG 2.2 AA)
- Clean, minimal UI
- I can use it daily without frustration

## Constraints
- Use Next.js + TypeScript + Tailwind
- No backend (localStorage only)
- Must work on mobile
- Keep it under 500 lines of code if possible
```

---

## Step 4: Run the Kickoff Prompt

Open your AI coding environment and paste the **Project Kickoff Planner** prompt from `AI_PROMPT_LIBRARY.md`.

**Input:**
- Paste the contents of `SPONSOR_INTENT.md`
- Paste `city.config.json`
- Paste `CONVENTIONS.md` (or the most relevant sections)

**Expected Output:**
- A Project Charter with architecture recommendation, milestones, and risks
- Initial folder structure proposal
- Any immediate escalation questions

---

## Step 5: Review & Approve the Charter

Read the Project Charter. If it looks good, reply:

> "Approved. Proceed with Phase 1."

If you want changes, reply with specific feedback and ask the AI to revise.

---

## Step 6: Let the AI Council Work

Once approved, the AI Council will:

1. Create the full folder structure per `PROJECT_STRUCTURE.md`
2. Set up Next.js, TypeScript, Tailwind, testing, and CI
3. Write the initial implementation plan
4. Begin autonomous development

**Your role during this phase:**
- Monitor progress (optional)
- Respond to escalations (if any)
- Review the final quality gate when notified

---

## Step 7: Quality Gate Review

When the AI Council reaches a quality gate, you will receive:

- A **Release Report** summarizing what was built
- How it aligns with your original intent
- Known limitations and technical debt
- A recommendation to deploy or iterate

Reply with:
- `Approve` → AI proceeds to deployment / next phase
- `Request changes` → AI iterates on specific feedback
- `Questions` → Ask for clarification

---

## Step 8: Post-Mortem & Learning

After the project (or major milestone), the AI Council will run a post-mortem and propose improvements to:

- `CONVENTIONS.md`
- Prompt templates in `AI_PROMPT_LIBRARY.md`
- `ESCALATION_PROTOCOL.md`
- Any other relevant documents

Review and approve the proposed changes. This is how the system gets smarter for your *next* project.

---

## Common First-Project Issues

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| AI escalates too much | `complexityTier` set too high or `maxAutonomousChanges` too low | Lower the tier or increase the threshold |
| AI makes wrong assumptions | `SPONSOR_INTENT.md` was too vague | Add more specific success criteria and constraints |
| Too many quality gate reviews | Quality gates are too strict for a "Town" project | Adjust `qualityGates` in `city.config.json` |
| Context files get bloated | AI is not summarizing aggressively | Add explicit instructions in `MASTER_CONTEXT.md` updates |

---

## Tips for Success

1. **Start small** — Your first City 2.0 project should be a "Town" or "Village" tier project
2. **Be specific in your intent** — The more precise your vision, the better the autonomous output
3. **Trust the process** — Let the AI Council work without constant checking
4. **Review escalations carefully** — Your input at escalation points shapes the entire project
5. **Embrace the post-mortem** — This is where the real compounding value is created

---

## Your First 3 Projects (Recommended Path)

| Project | Tier | Goal | What You'll Learn |
|---------|------|------|-------------------|
| 1. Task app (this one) | Town | Learn the flow | How the AI Council operates, when it escalates |
| 2. Small SaaS landing + waitlist | Town | Add backend | How context carries across features |
| 3. Personal dashboard | City | Full stack | How the system handles complexity and self-improvement |

---

## Next Steps After This Quickstart

1. Read `00_OVERVIEW.md` and `01_VISION_AND_PRINCIPLES.md` for the full philosophy
2. Skim `CONVENTIONS.md` so you understand the standards the AI will follow
3. Try the system on a real (small) project
4. After the first project, review the post-mortem and approve improvements

---

**Welcome to The City 2.0.**

You are now ready to build software where **you state the vision, and the system handles the rest** — with high quality, full transparency, and continuous improvement.

If anything in this Quickstart is unclear, escalate it to the Knowledge department by opening an issue or asking in your AI environment.
# The City 2.0 — Fast & Efficient Simulation

**This simulation shows how City 2.0 behaves when the Sponsor prioritizes speed and efficiency over strict conventions.**

**Project**: Simple Markdown Note-Taking Web App  
**Complexity Tier**: Village (minimal scope)  
**Focus**: Get it working fast, don't over-engineer  
**Duration**: ~90 minutes autonomous work + 1 human touchpoint

---

## Phase 0: Sponsor Intent (Speed-Focused)

**You (the Sponsor) say:**

> "I need a dead-simple markdown note-taking app. Just a list of notes, click to edit in markdown, auto-save to localStorage. Dark mode toggle. That's it. I want this in under 2 hours. Don't overthink it."

**Key Signal**: "Don't overthink it" + time pressure → The AI Council should bias toward speed.

---

## Phase 1: Quick AI Council Planning (5 minutes)

The Council reads your intent and `city.config.json` (Village tier).

**Council Internal Decision** (using Decision Framework, but fast):

> **Decision**: Use a simple array of notes in localStorage, no schema versioning, no complex state management.
>
> **Rationale**: For a Village-tier personal tool with < 50 notes, over-engineering persistence is a waste. We can always add versioning later if needed.
>
> **Trade-off Accepted**: No migration path if we change the data model later. Acceptable for speed.

**No escalation** — this is a low-stakes decision.

**Quick Plan** (not a full Project Charter):

1. Next.js + TypeScript + Tailwind (fastest setup we know)
2. Simple note list + markdown editor (use `react-markdown` + `textarea` for speed)
3. localStorage with JSON
4. Dark mode with `next-themes` (one-line solution)
5. Auto-save on every keystroke (debounced)
6. Ship it

**You**: "Approved. Go fast."

---

## Phase 2: Fast Autonomous Execution (~75 minutes)

The AI Council moves quickly:

### Engineering (40 min)
- Scaffold Next.js app (standard template, minimal config)
- Create simple note data model: `{ id, title, content, updatedAt }`
- Build note list (clickable cards) + editor (split view: markdown input + preview)
- Wire up localStorage (load on mount, save on change with 500ms debounce)
- Add dark mode toggle (use `next-themes` — 3 lines of code)

### Design (20 min)
- Minimal UI: sidebar for notes, main area for editor
- Soft dark theme by default (calming, easy on eyes)
- No fancy animations, no loading states, no error boundaries
- Just make it work

### Quick Internal Review (15 min)
- Does it work? Yes.
- Does it crash on edge cases? Probably, but not critical for personal use.
- Is it accessible? Mostly (we skipped full audit for speed).
- Security? It's local-only, no external data.

**No escalation. No detailed documentation. No post-mortem.**

---

## Phase 3: Delivery (You Review)

**What You Receive** (after ~90 minutes total):

```markdown
## Fast Build Complete — Simple Notes App

**What Was Built**:
- Create, edit, delete notes
- Markdown preview (live)
- Auto-save to localStorage
- Dark mode toggle (persists)
- Search/filter notes by title
- Responsive (works on mobile)

**What Was Skipped** (for speed):
- No tests
- No accessibility audit
- No schema versioning
- No error handling for edge cases
- No loading states or animations
- No keyboard shortcuts beyond basic

**Known Issues**:
- If you have 100+ notes, it might get slow (no virtualization)
- No export/import
- No cloud sync (as scoped)
- Deleting a note has no confirmation

**Recommendation**: Good enough for personal daily use. If you need more features later, we can iterate.

**Time**: ~90 minutes autonomous + your review
```

**You**: "Perfect. This is exactly what I wanted, fast."

---

## Phase 4: Quick Reflection (5 minutes)

**Council Internal Note** (not a full post-mortem, just a quick capture):

```markdown
## Quick Reflection — Simple Notes App (Speed Run)

**What Worked**:
- Using `next-themes` for dark mode saved ~30 minutes vs custom implementation
- Simple array + localStorage was the right call — no need for schema versioning at this scale
- Skipping tests was acceptable for a personal tool (we can add later if it becomes important)

**What Could Be Faster Next Time**:
- We spent ~10 minutes deciding on the markdown preview library. Should have just picked `react-markdown` immediately (we know it works).
- The split-view editor could have been even simpler (just a textarea + preview div, no resizable panels).

**Pattern for Future Speed Runs**:
- For Village-tier personal tools: default to "good enough" patterns we already know
- Skip: tests, accessibility audit, schema versioning, error boundaries, loading states
- Keep: core functionality, auto-save, dark mode, responsive
- Bias toward: libraries we already trust (`next-themes`, `react-markdown`, `date-fns` if needed)

**Time Saved vs Full Process**: ~2.5 hours (no post-mortem, no detailed docs, no quality gates)
```

---

## Key Takeaways from This Fast Simulation

| Aspect | Full Process (Previous Sim) | Fast Process (This Sim) |
|--------|-----------------------------|-------------------------|
| **Human Time** | ~45 minutes | ~10 minutes |
| **AI Autonomous Time** | ~3.5 hours | ~90 minutes |
| **Escalations** | 1 (high-signal) | 0 |
| **Documentation** | Full (DECISIONS.md, post-mortem, charter) | Minimal (quick internal note) |
| **Quality Gates** | Full (a11y, security, testing, performance) | Minimal (just "does it work?") |
| **Self-Improvement** | 3 concrete upgrades | 1 pattern note (lighter) |
| **Outcome** | Production-ready with polish | Good-enough personal tool |

---

## When to Use Fast Mode vs Full Mode

**Use Fast Mode When**:
- Personal tools / internal utilities
- Prototypes / experiments
- You have a clear, small scope
- You're okay with technical debt (you can pay it later)
- Speed matters more than long-term maintainability

**Use Full Mode When**:
- Projects you'll use daily for months/years
- Anything with user data or security implications
- Projects where you'll want to iterate and add features
- You care about accessibility, performance, or code quality

**City 2.0 Supports Both** — the Operating System layer adapts. The Framework layer (conventions) can be "relaxed" for speed runs.

---

## What This Simulation Revealed

1. **The model scales down gracefully** — Even when you say "don't overthink it," the AI Council can still deliver high-quality results quickly.
2. **The Decision Framework still adds value** — Even in fast mode, the Council made a deliberate trade-off (no schema versioning) and documented it briefly.
3. **Self-improvement still happens** — Even the quick reflection captured a useful pattern for future speed runs.
4. **The Sponsor role becomes even more powerful** — With just 10 minutes of your time, you got a working tool. That's extreme leverage.

---

**This shows City 2.0 isn't just for "serious" projects — it can also be a fast personal tool generator when you want it to be.**
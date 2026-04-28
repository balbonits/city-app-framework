# The City 2.0 — Game Simulation

**This simulation tests how City 2.0 performs when building a game — a domain where the Framework layer (conventions, patterns, prompts) is less mature.**

**Project**: Simple 2D Endless Runner (web-based, Canvas + TypeScript)  
**Complexity Tier**: Town  
**Framework Maturity**: Low (our conventions are web-app-centric)  
**Duration**: ~2.5 hours autonomous + 2 human touchpoints

---

## Phase 0: Sponsor Intent

**You say:**

> "Build a simple endless runner game. Player runs automatically, tap/click to jump over obstacles. Score increases over time. Game over on collision. Restart button. Keep it simple — just one level, no power-ups, no menus. I want to play it in the browser."

**Key Signal**: Game domain — the AI Council will have to improvise on patterns it doesn't have strong conventions for.

---

## Phase 1: AI Council Planning (15 minutes)

The Council reads your intent and immediately recognizes a gap:

**Council Internal Discussion** (using Decision Framework):

> **Decision**: What game framework / approach should we use?
>
> **Options Considered**:
> 1. **Phaser 3** (mature 2D game framework, lots of built-in physics/collision)
>    - Pros: Fast development, handles physics/collision for us, good docs
>    - Cons: Adds a dependency, we have no "Phaser conventions" in our Framework
> 2. **Vanilla Canvas + TypeScript** (pure, no dependencies, full control)
>    - Pros: No external deps, we can build exactly what we need, aligns with "keep it simple"
>    - Cons: We have to implement physics, collision, game loop from scratch — more code, more bugs
> 3. **Three.js** (3D, overkill for 2D runner)
>    - Rejected immediately
>
> **Recommendation**: Option 2 (Vanilla Canvas + TypeScript) because:
> - Scope is small (one simple game mechanic)
> - Avoids dependency bloat for a personal project
> - We can implement a simple gravity/jump system in ~50 lines
>
> **Trade-off Accepted**: More code to write, higher bug risk, but keeps the project self-contained and simple.
>
> **Escalation?** No — this is a reasonable engineering decision within our autonomy for Town-tier projects. We have enough general programming knowledge to implement basic game physics.

**Quick Plan**:

1. HTML5 Canvas + TypeScript setup (Vite for fast dev)
2. Game loop (requestAnimationFrame)
3. Player with gravity, jump on click/space
4. Obstacles (simple rectangles moving left)
5. Collision detection (AABB)
6. Score (distance-based)
7. Game over + restart
8. Basic visuals (colored rectangles, no sprites)

**You**: "Approved. Let's see how this goes."

---

## Phase 2: Autonomous Execution (~2 hours)

The AI Council proceeds, but the lack of game-specific conventions shows:

### Engineering Challenges (and How the Council Handled Them)

**Challenge 1: Game Loop Architecture**
- The Council had to decide between `setInterval`, `requestAnimationFrame`, or a fixed timestep loop.
- **Decision**: `requestAnimationFrame` with delta time for smooth animation.
- **Internal Note**: "We should add a 'game loop patterns' section to `CONVENTIONS.md` — this is a recurring decision."

**Challenge 2: Physics & Collision**
- Had to implement gravity, velocity, and AABB collision from scratch.
- **Decision**: Simple Euler integration for physics, AABB for collision (fast, easy to debug).
- **Internal Note**: "This is boilerplate we shouldn't have to write every time. Future game projects need a 'simple physics utilities' module in the Framework."

**Challenge 3: State Management**
- Game has multiple states: Playing, Game Over, Paused (maybe).
- **Decision**: Simple enum + switch statement in the game loop (no Redux, no complex state machine — overkill for this scope).
- **Internal Note**: "For small games, a simple state enum works fine. For larger games, we'd need a proper state machine pattern."

### What Went Smoothly

- Canvas setup and rendering (the Council has strong web fundamentals)
- Input handling (click + spacebar jump)
- Score tracking and display
- Restart logic (reset all game state)

### What Was Harder Than Expected

- Collision felt "floaty" on first try — took 3 iterations to get the jump arc feeling right
- Game loop timing was tricky — initial version had inconsistent speeds on different refresh rates (fixed with delta time)

**No escalations** — the Council was able to solve these with general programming knowledge + the Decision Framework.

---

## Phase 3: Quality Gate (Light)

Since this is a personal game (not a product with users), the quality gate is lighter:

**Council Self-Review**:

- Does it work? Yes.
- Is it fun? Surprisingly yes — the jump arc feels good after tuning.
- Performance? 60fps on modern browsers, no issues.
- Code quality? Acceptable for a game prototype (some duplication, but not terrible).
- Accessibility? N/A (it's a game, not a UI tool).

**Minor Polish Added** (without escalation):
- High score persistence (localStorage)
- Simple particle effect on jump (3 small circles)
- "Game Over" screen with final score

**You review** (10 minutes):

> "This is fun! The jump feels good. One thing — can you make the obstacles spawn at random heights? It gets boring if they're all the same."

**Council**: "On it." (5 minutes fix)

---

## Phase 4: Post-Mortem & Self-Improvement (20 minutes)

This is where the value compounds — the Council reflects on building a game with an app-centric Framework.

**Post-Mortem Output**:

```markdown
## Post-Mortem — Endless Runner Game

### What Worked Well
- The Operating System layer (Decision Framework, autonomy, escalation protocol) worked *even without game-specific conventions*. The Council made reasonable trade-offs and documented them.
- Vanilla Canvas + TypeScript was the right call for this scope — kept the project simple and self-contained.
- Delta-time game loop prevented frame-rate dependent speed issues (good architectural decision).
- The Sponsor feedback loop ("make obstacles random height") was fast and effective.

### What Was Harder (Framework Gaps)
- **No game loop patterns** — We had to decide between `setInterval`, `requestAnimationFrame`, and fixed timestep from scratch. This should be a documented pattern.
- **No physics utilities** — Gravity, velocity, collision detection are common in games. We wrote ~40 lines of boilerplate that could be a reusable module.
- **No game state patterns** — Managing Playing/GameOver/Paused states was ad-hoc. A simple state machine pattern would help future games.
- **No asset loading patterns** — We used colored rectangles (fast), but if we wanted sprites/sounds, we'd need a loader pattern.
- **No input abstraction** — Click + spacebar was hardcoded. A simple input manager would make controls more flexible.

### Patterns Observed
- For small games (Town tier or below): Vanilla Canvas + simple game loop is faster than bringing in a full engine (Phaser, etc.) — less setup, fewer dependencies, more control.
- Game development has **recurring architectural decisions** (game loop, physics, state management, input, collision) that deserve their own convention section.
- "Fun factor" tuning (jump arc, obstacle placement) is hard to automate — this is where human feedback is most valuable.

### Proposed Improvements to City 2.0 (Game Framework Layer)

1. **Add to CONVENTIONS.md (or new GAME_CONVENTIONS.md)**:
   - Game loop patterns (requestAnimationFrame + delta time)
   - Simple physics utilities (gravity, velocity, AABB collision)
   - Game state management (enum + switch, or simple state machine)
   - Input abstraction (keyboard, mouse, touch)
   - For small games: Prefer vanilla Canvas over full engines unless you need built-in physics/collision

2. **Add to AI_PROMPT_LIBRARY.md**:
   - "Game Physics Implementation" prompt template
   - "Game Loop Architecture" prompt template
   - "Fun Factor Tuning" prompt (ask for human feedback on feel)

3. **Add to DECISION_FRAMEWORK.md**:
   - New decision pattern: "Engine vs Vanilla" — when to use a game engine vs build from scratch

4. **Future Work**:
   - Create `GAME_CONVENTIONS.md` with the above patterns
   - Create a "Simple Game Starter" template (Vite + Canvas + game loop boilerplate)
   - Consider Phaser as an alternative for larger games (with its own convention set)

### Action Items
- [Knowledge] Draft `GAME_CONVENTIONS.md` with game loop, physics, and state patterns — Due: Before next game project
- [Knowledge] Add "Engine vs Vanilla" decision pattern to `DECISION_FRAMEWORK.md` — Due: This week
- [Knowledge] Create "Game Physics Implementation" and "Game Loop Architecture" prompt templates — Due: This week
```

---

## Key Takeaways from This Game Simulation

| Insight | Implication |
|---------|-------------|
| **The OS layer works even in unfamiliar domains** | Governance, autonomy, escalation, and self-improvement don't require domain-specific conventions. The Council can still deliver good outcomes. |
| **The Framework layer is the bottleneck for new domains** | Without game conventions, the Council had to reinvent patterns. This is expected — and the self-improvement loop is designed to fix it. |
| **Self-improvement is domain-aware** | The post-mortem produced *game-specific* improvements (`GAME_CONVENTIONS.md`, physics utilities, input abstraction). This is exactly how the system should evolve. |
| **Human feedback is especially valuable for "fun"** | Tuning jump arc and obstacle placement is hard to automate. The model correctly kept the human in the loop for subjective quality. |
| **Small games can be faster with vanilla Canvas** | The Council made a good call skipping Phaser for this scope. This is a useful pattern to codify. |

---

## What This Simulation Proved

1. **City 2.0 is not limited to web apps** — The Operating System layer (governance, autonomy, self-improvement) is domain-agnostic and works for games.
2. **The Framework layer can (and should) evolve** — The post-mortem gave us a clear roadmap for game-specific conventions.
3. **The model gets better at new domains over time** — Each game project will add patterns, prompts, and utilities that make the *next* game faster and better.
4. **Your "personal framework" vision is intact** — Even in a domain where the Framework is weak, the OS layer provides structure, autonomy, and continuous improvement.

---

## Next Steps for Game Support

Based on this simulation, the immediate improvements are:

1. Create `GAME_CONVENTIONS.md` with:
   - Game loop patterns
   - Simple physics utilities
   - Game state management
   - Input abstraction
   - "Vanilla vs Engine" decision guide

2. Add game-specific prompts to `AI_PROMPT_LIBRARY.md`

3. Add "Engine vs Vanilla" decision pattern to `DECISION_FRAMEWORK.md`

These can be done before your next game project — and the system will be noticeably better at game development after that.

---

**This simulation validated the core model while revealing a clear, actionable path to extend it to games.** The OS layer held up. The Framework layer needs work — and the self-improvement loop is ready to do it.
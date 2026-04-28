# Engine vs Vanilla (Games)

When building a game, when do you reach for an engine vs hand-roll it?

---

## Vanilla Canvas / hand-rolled

Use when:

- Small games (~1 week of work or less)
- Simple mechanics (runner, flappy clone, pong, breakout, snake)
- Full control desired, dependencies unwanted
- It's a learning exercise — the boilerplate IS the point
- You want a portfolio piece that demonstrates raw skill

Patterns you'll need (and that work fine without an engine):
- `requestAnimationFrame` + delta time game loop
- AABB collision
- Simple state machine (`'menu' | 'playing' | 'paused' | 'gameover'`)
- Object pooling for bullets/particles if you have many
- Input abstraction (`keys` map + `justPressed` map)

---

## Game engine

Use when:

- Medium+ scope (2+ weeks)
- You need: physics, collision response, particle systems, scene management, asset pipelines, audio mixing, animation blending
- The boilerplate would otherwise eat 30%+ of dev time
- You want tooling (visual editor, scene graph)
- You're shipping commercially

Pick:
- **Phaser** — 2D web games, mature ecosystem, JS-native
- **PixiJS** — 2D rendering only, you bring your own game logic
- **Godot** — 2D or 3D, free, exports to web
- **Unity** — 3D-heavy, large team, asset store
- **Bevy / raylib / etc.** — if you're explicitly trying to learn or want a specific language

---

## Default for personal games

Start with vanilla Canvas + TypeScript. If you hit a wall on physics, animation, or asset loading and find yourself reinventing the engine, switch — but don't switch preemptively.

The trap: bringing in Phaser "just to be safe" for a flappy clone, then spending the first day learning Phaser's API instead of building the game.

---

## Watch out for

- **"I'll need particles eventually"** — usually false. Build without them; add when needed.
- **"Vanilla means no libraries"** — use libraries for solved problems (`pixi.js` for rendering, `howler.js` for audio). "Vanilla" means no game *engine*, not zero deps.
- **Switching mid-project.** Painful. Decide early or commit to vanilla.
- **Web-only assumptions.** Vanilla Canvas works fine for web. If you might want to ship to mobile native or desktop, that changes the calculation.

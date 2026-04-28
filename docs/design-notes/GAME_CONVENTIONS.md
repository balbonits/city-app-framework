# The City 2.0 — Game Conventions

**This document extends the core `CONVENTIONS.md` with game-specific patterns and guidelines.**

It is a living document. After every game project, the AI Council must propose additions or refinements based on what was learned.

---

## 1. Game Loop Patterns

### Recommended: `requestAnimationFrame` + Delta Time

```ts
let lastTime = performance.now();

function gameLoop(currentTime: number) {
  const delta = (currentTime - lastTime) / 1000; // seconds
  lastTime = currentTime;

  update(delta);
  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

**Why**: Smooth, frame-rate independent, browser-optimized.

**When to use fixed timestep instead**: Physics-heavy games where deterministic simulation matters (e.g., networked games, replays).

---

## 2. Simple Physics Utilities

### Gravity + Velocity (Platformer / Runner)

```ts
interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  onGround: boolean;
}

function applyPhysics(body: PhysicsBody, delta: number, groundY: number) {
  body.vy += body.gravity * delta;
  body.y += body.vy * delta;
  body.x += body.vx * delta;

  // Ground collision
  if (body.y >= groundY) {
    body.y = groundY;
    body.vy = 0;
    body.onGround = true;
  } else {
    body.onGround = false;
  }
}

function jump(body: PhysicsBody, jumpVelocity: number) {
  if (body.onGround) {
    body.vy = jumpVelocity;
    body.onGround = false;
  }
}
```

**Recommended defaults for endless runners**:
- `gravity: 1800` (pixels/second²)
- `jumpVelocity: -600` (pixels/second)
- `groundY: 400` (canvas height minus player height)

---

## 3. Collision Detection (AABB)

```ts
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function collides(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}
```

**For pixel-perfect collision** (if needed): Use canvas `getImageData` or a separate collision mask.

---

## 4. Game State Management

### Simple Enum + Switch (Small Games)

```ts
type GameState = 'playing' | 'gameOver' | 'paused';

let state: GameState = 'playing';

function update(delta: number) {
  switch (state) {
    case 'playing':
      // game logic
      break;
    case 'gameOver':
      // show game over screen
      break;
    case 'paused':
      // do nothing or show pause menu
      break;
  }
}
```

### State Machine (Larger Games)

For games with many states (menu, playing, paused, inventory, dialogue, etc.), use a simple state machine with `enter`/`exit` hooks.

---

## 5. Input Abstraction

```ts
const keys: Record<string, boolean> = {};
const justPressed: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  if (!keys[e.key]) justPressed[e.key] = true;
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function wasJustPressed(key: string): boolean {
  const pressed = justPressed[key];
  justPressed[key] = false;
  return pressed;
}
```

**Usage**:
```ts
if (wasJustPressed(' ') || wasJustPressed('w')) {
  jump(player);
}
```

---

## 6. "Engine vs Vanilla" Decision Guide

| Project Size | Recommendation | Rationale |
|--------------|----------------|-----------|
| **Village** (simple prototype, < 2 days) | **Vanilla Canvas** | Fastest to start, no dependency overhead, full control |
| **Town** (small game, 1-2 weeks) | **Vanilla Canvas** or **Phaser** | Vanilla if simple mechanics; Phaser if you need built-in physics/collision/animation |
| **City** (medium game, 1+ months) | **Phaser** or **Godot** (export to web) | Mature tooling saves time on boilerplate |
| **Metropolis** (large game, 3+ months) | **Godot**, **Unity**, or **Unreal** | Professional tooling, team collaboration, asset pipelines |

**Default for City 2.0 personal games**: Start with **Vanilla Canvas + TypeScript**. Only bring in Phaser/Godot if you hit a wall on physics, animation, or asset loading.

---

## 7. Performance Budgets for Games

| Metric | Target (60fps) | Notes |
|--------|----------------|-------|
| **Main thread frame time** | < 16ms | Use `performance.now()` to measure |
| **Draw calls** | < 50 per frame | Batch draw calls when possible |
| **Object count** | < 200 active | Use object pooling for bullets/particles |
| **Canvas size** | 800×600 or 1024×768 | Higher = more pixels to fill |

**Profiling tip**: Press F12 → Performance tab → record 5 seconds of gameplay → look for long tasks.

---

## 8. Common Game Anti-Patterns

- **Don't** use `setInterval` for the game loop (frame-rate dependent, janky)
- **Don't** put game logic in `requestAnimationFrame` callbacks without delta time (speed varies by device)
- **Don't** create new objects every frame (use object pooling for particles, bullets, etc.)
- **Don't** use `innerWidth`/`innerHeight` for canvas size without handling resize events
- **Don't** ignore audio context unlocking (browsers require user gesture to play sound)

---

## 9. Quick Start Template (Vanilla Canvas)

```ts
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d')!;

let lastTime = performance.now();

function gameLoop(currentTime: number) {
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(delta);
  render(ctx);

  requestAnimationFrame(gameLoop);
}

function update(delta: number) {
  // game logic
}

function render(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw everything
}

requestAnimationFrame(gameLoop);
```

---

**This document is the seed for game-specific conventions.** After every game project, the AI Council must propose additions based on what was learned. The goal is to make the *next* game faster and better than the last.
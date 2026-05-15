# UI Design Conventions

Rules to keep AI-generated UI from looking AI-generated. Distilled from public UI/UX teaching (see [sources.md](sources.md)) into AI-followable constraints.

The core insight: AI defaults to "vibe-coded" UI — bright clashing colors, repeated KPI blocks, sparse modals, gradient monogram avatars, emoji icons, lame chart palettes. These are *predictable failure modes*, not random taste. Pin the right decisions before codegen, apply rules during, run a checklist after — and most of the gap closes.

---

## How to use this collection

Three phases. This README is the load-into-context summary. Topic files have detail and reasoning.

| Phase | What | Files |
| --- | --- | --- |
| **1. Pin** | Decisions before any UI code | this README, "Phase 1" below |
| **2. Generate** | Rules during codegen | [color](color.md), [hierarchy](hierarchy.md), [layout](layout.md), [states-feedback](states-feedback.md), [mobile](mobile.md) |
| **3. Review** | Catch AI tells before claiming done | [review-checklist](review-checklist.md), [anti-patterns](anti-patterns.md) |

---

## Phase 1 — Pin before codegen

Decide and write down before generating any UI:

- **Color foundation.** One brand color (will become a ramp). Light or dark mode (or both). Card style: dark cards on light bg / light cards on dark bg / monochromatic. Skip 60-30-10 — product UIs are 90/8/2.
- **Layout direction.** Desktop = 2-axis layouts allowed. Mobile = pick one direction per section.
- **Density target.** Landing page (≤ 6 font sizes, generous whitespace) vs. dashboard (rarely > 24px text, tighter).
- **Brand voice.** Serious (financial, medical, infra) → no delight, plain copy. Habit / casual / playful → see [delight-checklist](../delight-checklist.md).

If any of these are unclear, escalate before generating. Wrong decisions here cost a full redesign; right decisions cost one minute of pinning.

---

## Phase 2 — Generation rules (condensed)

### Color (full: [color.md](color.md))
- 4-layer system: neutral foundation → functional accent → semantic → theming.
- Brand color is a *scale* (UI Colors / OKLCH ramp). Main 500/600, hover 700, link 400/500.
- Neutrals: 4 backgrounds, 1–2 strokes (~85% white, never thin black), 3 text variants. Headings ~11% white, body 15–20%, subtext 30–40%.
- Dark mode: surfaces lighter as they elevate. Double the neutral steps (4–6%). No drop shadows.
- Charts: OKLCH for perceptually-equal brightness. Increment hue 25–30°.
- Semantic overrides brand: red = destructive, green = success, yellow = warning, blue = info — always.
- "More important = darker" for buttons. Multi-purpose buttons sit at 90–95% white.

### Hierarchy (full: [hierarchy.md](hierarchy.md))
- Three levers: size, position, color. Contrast creates hierarchy.
- Most important: top, larger, more saturated. Use images for scannability.
- Tighten large text: letter-spacing -2 to -3%, line-height 110–120%.
- One sans-serif font is enough.

### Layout (full: [layout.md](layout.md))
- 4-point grid (4, 8, 12, 16, 24, 32, 48, 64). 32px between major items.
- 12-col grid: guideline, not law. Use it for repeating content + responsive (12/8/4).
- 4 building blocks: cards, text/links, images, inputs.
- Don't double-nest cards. Group with whitespace instead.

### States & feedback (full: [states-feedback.md](states-feedback.md))
- Every button: default, hover, active, disabled. Add loading for async.
- Every input: focus, error (red border + message), warning, sometimes loading.
- Every action gets a confirmation. Micro-interactions, not just state changes.
- Shadows: lower opacity, raise blur. If shadow is the first thing you notice, it's wrong.
- Image overlays: linear gradient, optionally + progressive blur. Never flat.

### Mobile (full: [mobile.md](mobile.md))
- Bottom nav: 3–4 items ideal, max 5. 44px minimum touch target.
- Type/spacing scales **up** on mobile (iOS base 17px), not down.
- One screen, one thing. New action → new page or bottom sheet, not crammed in.
- Gestures: swipe-back (-35% offset), bottom-sheet zoom-out, long-press blur + actions.
- Empty states: full-screen + CTA pointer for first-launch; "no results" gets imagery + suggestions + exit.

---

## Phase 3 — Review

Before claiming done, run [review-checklist.md](review-checklist.md). The headline catches:

- Emoji icons (use Phosphor / Lucide)
- Gradient profile circles with monograms
- The same KPI block repeated 3× in a small app
- Sparse modals with 60% empty space
- Charts using only the brand color ramp
- Thin black borders
- 5+ pricing tiers without clear discount story
- Flat overlays over images
- Missing button states
- Robotic copy in casual-tone apps

Full list with fixes: [anti-patterns.md](anti-patterns.md).

---

## When to skip

- **Speed Run Mode** — skip Phase 1 pin, skip Phase 3 review. Apply Phase 2 hierarchy + states only.
- **Internal tools / dashboards** — skip mobile sections, relax empty-state polish.
- **Throwaway prototype** — hierarchy + states only.

The goal is not perfection. The goal is to clear the "this was AI-made" smell.

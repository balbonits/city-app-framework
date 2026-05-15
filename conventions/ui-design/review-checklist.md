# UI Review Checklist

Run before claiming a UI is done. Each item is a fast yes/no. If the answer is "no" or "not sure," fix or escalate.

Most failures here are anti-patterns — see [anti-patterns.md](anti-patterns.md) for fixes.

---

## Color

- [ ] No thin black borders (using ~85% white instead)
- [ ] Body text in 15–20% white, not pure black
- [ ] Brand color used as a scale (ramp), not a single value
- [ ] Semantic colors (red/green/yellow/blue) used for their meanings, not aesthetics
- [ ] Charts use OKLCH-based palette, not all brand color or default rainbow
- [ ] Dark mode (if applicable): surfaces lighter as they elevate, no drop shadows, neutral steps doubled

---

## Hierarchy

- [ ] Most important info is top, larger, or color-emphasized (not all-equal)
- [ ] ≤ 6 font sizes on landing pages
- [ ] No text > 24px on dashboard / product UI
- [ ] Header text uses tightened letter-spacing (-2 to -3%) and line-height (110–120%)
- [ ] One sans-serif font family throughout

---

## Layout

- [ ] Spacing on the 4-point grid (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] No double-nested cards
- [ ] Mobile sections use ONE direction (vertical OR horizontal, not both)
- [ ] Whitespace is doing work — sections breathe

---

## States & feedback

- [ ] Every button has default / hover / active / disabled at minimum
- [ ] Every input has default / focus / error states
- [ ] Async actions show loading (spinner or skeleton)
- [ ] User-confirmable actions have micro-interaction confirmation, not just state change
- [ ] Image overlays use gradient (not flat black)
- [ ] Shadows are subtle — not the first thing you notice

---

## Mobile (if applicable)

- [ ] Touch targets ≥ 44px
- [ ] Type/spacing as large or larger than desktop equivalents
- [ ] Bottom nav has 3–4 items (max 5)
- [ ] One screen, one thing — no crammed secondary content
- [ ] Bottom sheets used for in-context secondary flows
- [ ] Gestures (swipe back, long-press) animate, not jump

---

## Empty states & edges

- [ ] First-launch empty state has illustration + clear CTA pointer
- [ ] No-results empty state has imagery + suggestions + exit action
- [ ] Error states have specific messages, not generic "An error occurred"
- [ ] Loading states for any async fetch

---

## AI tells (final pass)

Run [anti-patterns.md](anti-patterns.md) checks:

- [ ] No emoji icons (using Phosphor / Lucide instead)
- [ ] No gradient avatar circles with monograms
- [ ] No KPI block repeated 3× across the app
- [ ] No sparse modals with 60% empty space
- [ ] No bloated sidebar with 8+ equal-weight links
- [ ] Pricing has ≤ 4 tiers with clear discount story (if applicable)
- [ ] Landing page has real product screenshots, not stock illustrations
- [ ] Copy doesn't sound robotic ("Submission successful")

---

## When to skip parts of this checklist

- **Speed Run Mode:** skip the AI tells pass; cover hierarchy + states only.
- **Internal tools / dashboards:** skip mobile section, skip empty-state polish.
- **Throwaway prototype:** skip everything except hierarchy and states.

# Color

Product UI color is *not* 60-30-10. Vercel is ~90/8/2. Linear, Notion, Supabase all sit in similar ratios. Build color in four layers, in order.

---

## Layer 1 — Neutral foundation

- **Backgrounds:** 4 layers minimum (page, frame/sidebar, card, raised). Sidebar is the page background +2% darker (Mercury pattern).
- **Strokes:** 1–2. Avoid thin black borders — use ~85% white instead. Defines the edge without overpowering.
- **Text:** 3 variants minimum.
  - Headings: ~11% white (very dark, but not pure black)
  - Body: 15–20% white
  - Subtext: 30–40% white

Light mode is flexible: dark cards on light bg, light cards on dark bg, or monochromatic layers (Supabase). Pick one and commit.

---

## Layer 2 — Functional accent (brand color)

- Brand color is a **scale**, not one value. Generate a ramp (UI Colors, or hand-build with OKLCH).
- Main = 500/600. Hover = 700. Link = 400/500.
- Some products skip an accent entirely (Vercel) — viable.

---

## Layer 3 — Semantic colors

These override your brand, even if your brand is purple. Don't be cute:

- Red = destructive, error
- Green = success
- Yellow = warning
- Blue = info, trust

For charts, the brand ramp alone looks too similar. Use **OKLCH** to get perceptually-equal brightness across hues. At [oklch.com](https://oklch.com), set lightness + chroma, then increment hue by 25–30° to step through the spectrum.

---

## Layer 4 — Theming

To re-skin a design to a new color:

- Take any neutral, drop lightness by 0.03, raise chroma by 0.02 in OKLCH.
- Adjust hue to taste.

Works for both light and dark mode, often better in dark.

---

## Dark mode

Different rules than light:

- **No drop shadows.** Use lighter surfaces to elevate. Surfaces *always* get lighter as they raise — this is rigid, unlike light mode.
- **Double the neutral distance.** Light mode steps are ~2% white between layers. Dark mode needs 4–6% to feel as different.
- **Brand color shifts up the ramp.** Primary = 300/400. Hover = 400/500.
- **Dim text, brighten borders.**

---

## Buttons (color hierarchy)

"More important = darker" — applies to ghost (transparent) → 90–95% white (multi-purpose) → black with white text (primary CTA). Most buttons sit at 90–95% white.

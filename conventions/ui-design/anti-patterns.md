# Anti-Patterns: Vibe-Coded Tells

Specific things AI defaults to that signal "this UI was AI-generated, untouched." Each rule is a Don't / Instead pair. If you see one of these in output, fix it before claiming the UI is done.

Source: distilled from Kole Jain's "5 SaaS UI/UX mistakes that SCREAM you Vibe Code." See [sources.md](sources.md).

---

## Emoji icons

- **Don't:** Emoji as functional icons (📊 for analytics, 🔗 for links, 👥 for team).
- **Instead:** Phosphor Icons, Lucide, Heroicons. Consistent stroke, weight, and grid.
- **Exception:** Notion-style apps where emoji *is* the brand identity for content.

---

## AI-picked colors

- **Don't:** Let the model pick "vibrant" colors directly. They clash, oversaturate, and ignore palette structure.
- **Instead:** Pick a brand color manually, derive a ramp (UI Colors / OKLCH), use it consistently. See [color.md](color.md).

---

## AI-picked layouts

- **Don't:** Trust the first layout the model produces. Common failures:
  - Same KPI block repeated 3× across the app
  - Wide sidebar with 10+ links of equal weight
  - Centered gradient avatar with the user's monogram
- **Instead:** Define the IA explicitly before codegen. The sidebar should hierarchy-rank links. Account info goes in a card or popover, not a gradient circle.

---

## Sparse modals / flyouts

- **Don't:** A modal with 60% empty space and 3 fields stretched across it.
- **Instead:** Either shrink the modal to fit content, or fill it via progressive disclosure (collapsed "Advanced options" expandable section).

---

## Vibe-cody KPI cards

- **Don't:** A row of 4 large numbers with an icon and a sparkline-shaped emoji.
- **Instead:** 2-column layout with small donut/spark charts where the data is genuinely visual. Or a simple paired metric + delta when it's just a number.

---

## Lame chart palettes

- **Don't:** All chart series in your brand color ramp (everything looks like the same color).
- **Don't:** Default Chart.js / Recharts rainbow.
- **Instead:** OKLCH-based palette with hue increments of 25–30° at fixed lightness/chroma. Equal perceptual brightness across colors. See [color.md](color.md).

---

## Thin black borders

- **Don't:** `border: 1px solid #000` (or near-black) on cards, buttons, inputs.
- **Instead:** ~85% white (e.g., `#D4D4D8` or `oklch(0.85 0 0)`). Defines the edge without shouting.

---

## Bloated sidebars

- **Don't:** Every secondary action as a top-level sidebar link (Account, Settings, Billing, Usage, Profile, Preferences, Team, Plan…).
- **Instead:** Tuck infrequent actions into a popover under the account card. Collapse related groups (Settings + Billing + Usage = one menu).

---

## Pricing tables with 5+ tiers

- **Don't:** 5 plans where Standard is cheaper than Hobby because of an unexplained discount.
- **Instead:** 3–4 tiers max. Show discount % explicitly. Show what's *new* in the next tier ("everything in Pro, plus..."). Bigger price text, smaller plan-name text.

---

## Bare image overlays

- **Don't:** Flat semi-transparent black box over an image.
- **Instead:** Linear gradient (image visible up top, text-readable below). Optionally + progressive blur. See [states-feedback.md](states-feedback.md).

---

## Lame landing pages

- **Don't:** Stock icons, abstract gradient blobs, generic "Built for teams" copy.
- **Instead:** Real product screenshots (slightly skewed for depth), specific feature claims, the actual UI as the hero. Presentation > complexity.

---

## Submission-success robotic copy

- **Don't:** "Submission successful" / "Operation completed" / "User created."
- **Instead:** Match product tone. "Saved" or "Done" for utility apps. "Nice work" for habit/casual. Just don't sound like a 2003 Microsoft dialog.

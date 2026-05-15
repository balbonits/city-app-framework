# Layout & Spacing

White space matters more than grid systems. But both have their place.

---

## The 4-point grid

All spacing should be a multiple of 4 (4, 8, 12, 16, 24, 32, 48, 64). Why: halves cleanly, scales consistently, removes endless "is this 14px or 15px" debates.

- **Default item gap:** 32px
- **Tight grouping:** 8–16px (related items: announcement + heading, label + input)
- **Section gap:** 64px+

---

## The 12-column grid

A guideline, not a law. Useful for:

- Repeating content (galleries, lists, blogs)
- Responsive breakpoints: **12 cols desktop / 8 cols tablet / 4 cols mobile**

Custom landing pages routinely break the grid. That's fine. Forced grid alignment on a hero section is one of the AI-tell signs of overcorrected layout.

---

## The 4 building blocks

Almost every UI element is one of:

1. **Cards** — group content, define edges. The most flexible block.
2. **Text / links** — labels, body, calls-to-action.
3. **Images** — visual anchors, scannability.
4. **Inputs** — fields, selects, toggles, sliders.

Anything else is decoration on top of these.

---

## Don't double-nest cards

A card inside a card creates padding-on-padding, halving usable space:

- **Avoid:** outer card → inner card → content
- **Prefer:** outer card → content (groups via whitespace, not borders)

If you genuinely need visual separation inside a card, use a divider or background color shift instead of a nested container.

---

## Desktop vs mobile layout direction

- **Desktop:** 2-axis layouts allowed — multiple columns and rows in the same section.
- **Mobile:** Pick **one direction per section**. Either vertical stack OR horizontal scroll. Never both in the same section.

This single rule fixes most "looks crammed" mobile designs. See [mobile.md](mobile.md) for more.

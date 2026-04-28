# Data Attributes

Three required `data-*` attributes for tagging UI structure: `data-component`, `data-region`, `data-part`.

These are not for styling. They're navigation aids — for AI agents reading the code, debuggers inspecting the DOM, automated tests selecting targets, and humans visually scanning screenshots.

---

## The three attributes

| Attribute | What it marks | Example |
| --- | --- | --- |
| `data-component` | Root element of a reusable component | `data-component="Modal"` |
| `data-region` | A logical group of multiple elements | `data-region="cards-grid"` |
| `data-part` | A single named element within a component or region | `data-part="title"` |

Naming: kebab-case for values (`first-name`, not `firstName` or `input1`). `data-component` uses PascalCase to match the component's name (`Modal`, not `modal`).

---

## Why these and not others

- **`data-testid` is too narrow.** Tests aren't the only consumer; AI navigation, debugging, and analytics all benefit. Three attributes cover all of them.
- **CSS classes are too volatile.** Tailwind classes change with redesigns. `data-component="Modal"` survives a re-skin.
- **Three attributes is enough.** Component → region (group) → part (leaf) covers the structure. More granularity gets over-tagged.

---

## Example

```tsx
<div data-component="Modal" role="dialog">
  <header data-part="header">
    <h2 data-part="title">Confirm action</h2>
    <button data-part="close-btn" aria-label="Close">×</button>
  </header>
  <div data-region="actions">
    <button data-part="cancel-btn">Cancel</button>
    <button data-part="confirm-btn">Confirm</button>
  </div>
</div>
```

---

## Compound naming for context

When a region or part needs both a generic and a specific identity, list generic first:

```tsx
<div data-region="cards-grid accept-counter-offers">
```

Query both: `[data-region~="cards-grid"]` for the generic shape, `[data-region~="accept-counter-offers"]` for the specific instance. Tilde-equals matches whitespace-separated tokens.

---

## React-specific: passing through

For native HTML elements, set the attribute directly:

```tsx
<input data-part="email" />
```

For custom components, expose a `dataPart` (camelCase) prop and have the component wire it to the root or relevant element:

```tsx
<TextField dataPart="email" />

// inside TextField:
<input data-part={dataPart} ... />
```

This keeps the attribute system consistent without breaking React's prop-naming conventions.

---

## What this isn't

- **Not for styling.** Use Tailwind classes, CSS variables, or modules.
- **Not a replacement for `aria-*`.** Those are for accessibility; these are for navigation. Both can coexist on the same element.
- **Not mandatory on every element.** Tag what's worth pointing at: components, named regions, named parts. Don't tag every `<div>`.
- **Not for layout.** "Sidebar," "main content," and "header" are roles, not regions. Use `<aside>`, `<main>`, `<header>` (or `role="..."`).

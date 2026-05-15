# States, Feedback, & Effects

Every interaction needs a response. The user should never wonder "did that work?"

---

## Button states

Required:

- **Default**
- **Hover** (desktop only — skip on mobile)
- **Active / pressed** (the click frame)
- **Disabled** (grayed, no hover effect)

Add when applicable:

- **Loading** (spinner replacing label, button stays width-stable)
- **Focus ring** (keyboard nav — never remove `:focus-visible`)

---

## Input states

- **Default**
- **Focus** — colored border or glow, signals input is live
- **Error** — red border + inline error message, never just red border alone
- **Warning** — yellow, optional issues (weak password, etc.)
- **Disabled** — grayed bg, no focus
- **Loading** (async validation) — spinner on the right edge

---

## Micro-interactions

States are reactive. Micro-interactions are *confirmatory*:

- Copy button → state change (hover, click) PLUS slide-up "Copied!" chip
- Form submit → button shows spinner, then checkmark before nav
- Delete → confirm dialog, then row fade-out

Range from practical to playful. Match the tone of the product. See [delight-checklist](../delight-checklist.md) for projects where playful is appropriate.

---

## Shadows

Most shadows are too strong by default. Rules:

- **Lower opacity, raise blur.** Shadows should suggest depth, not announce it.
- **Cards:** subtle (e.g., `0 1px 2px rgba(0,0,0,0.05)`)
- **Popovers / floating content:** stronger (e.g., `0 8px 24px rgba(0,0,0,0.12)`)
- **Inner shadows + outer shadows** combined create raised tactile buttons (skeuomorphic — use sparingly).

If the shadow is the first thing you notice on the design, it's too strong.

In dark mode, drop shadows don't work — use lighter surfaces instead. See [color.md](color.md).

---

## Overlays on images

A flat dark overlay over an image kills the image. Better:

- **Linear gradient:** image stays visible at top, fades to text-readable at bottom
- **Progressive blur over gradient:** modern, premium feel (iOS-style)

Never use a flat semi-transparent rectangle. It makes the image look broken.

---

## Loading

- **Skeleton screens** beat spinners for content loading (page transitions, lists).
- **Spinners** for actions (form submit, button click).
- **Optimistic UI** for fast actions (mark task complete instantly, reconcile on server response).

# Mobile

Mobile is not "desktop but smaller." Different navigation, different layout direction, different interaction model. The most common mobile UI mistake is squishing a desktop UI into a phone screen.

---

## Type and spacing scale UP, not down

- iOS base font size: **17px**
- macOS base font size: **13px**

Mobile screens are smaller, but the eye is closer and the touch target is a fingertip. Type and spacing should be slightly *larger* than on desktop, not smaller.

---

## Navigation: two valid patterns

**1. Floating bottom bar (most common)**

- 3–4 items ideal. Max 5. Beyond that, links become unreadable and tappable surface shrinks.
- 44px minimum touch target (Apple HIG). Smaller targets cause mistypes.
- One item is often broken out as a primary action (FAB-style).
- Items can change based on page context — that's fine, just don't shuffle them on every screen.

**2. Sidebar-as-home-page (Notion pattern)**

When you have too many top-level destinations to fit a bottom bar, make the home page the navigation hub. Recent items, actions, and search live here. The bottom slot becomes a big search bar or primary action.

---

## One screen, one thing

The most important mobile rule. Settings is just settings. Note editor is just the note editor. Don't cram "recent notes" or "suggested templates" at the top of the editor.

When you need to surface something extra, reach for:

- **A different page** (full-screen takeover)
- **A bottom sheet** (in-context, dismissable)

Never cram it into the existing screen.

---

## Bottom sheets

- Keep the user in context (great for template pickers, share menus, secondary actions).
- Any height — short menu or near-full-screen.
- Animate the background to ~95% scale as the sheet rises (zoom-out effect signals "this is on top").
- Always dismissable via swipe-down.

---

## Gestures

- **Swipe back:** animate the background page in from the left at -35% offset, return to 0 on completion. Smoother than instant pop.
- **Swipe up:** common for search (Slack, partially Apple Spotlight).
- **Long-press:** the right-click of mobile. Blur the screen, show a small action menu, optionally with a preview thumbnail (iOS Peek-style).

Educate the user the first time they could discover a gesture (popover hint). Then trust them.

---

## Contextual actions

Actions persist *only as long as relevant*. Examples:

- Note editor: hide bottom nav, show formatting toolbar at top
- Template picker (bottom sheet): hide everything, show only confirm + cancel
- Selection mode: replace nav with bulk-action toolbar

This frees up screen real estate at the moments it matters most.

---

## Empty states

Two kinds:

**1. First-launch empty (no content yet)**

- Full-screen illustration or simple graphic
- One clear CTA pointing at the primary action (often a + button)
- Optionally a popover instructing how to get started

**2. No-results empty (search/filter returned nothing)**

- Imagery + a clear message ("No notes match 'xyz'")
- Suggestions (in case of typo)
- Action to clear the filter / exit empty state

A bare "no results" string is the laziest possible UI.

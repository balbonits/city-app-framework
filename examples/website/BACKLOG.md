# BACKLOG

Live work queue. Updated on every merge to `main`.

## In progress

_(none — initial build complete)_

## Up next

- **OG image / social card.** Twitter / LinkedIn previews currently fall back to no image. Add a 1200×630 PNG or SVG-as-image to `public/` and wire `<meta property="og:image">`.
- **Custom domain.** If we want this on something like `cityapp.dev`, configure in Vercel + update CNAME.
- **Code-block syntax highlighting.** The current `<pre><code>` blocks render as plain text. If we add longer code samples, integrate Shiki (build-time, zero runtime cost) rather than Prism.

## Considered, deferred

- **Multi-page split.** If the framework grows enough to warrant separate pages for Conventions / Decision Patterns / Examples, add React Router v7 then. Not before.
- **Animations.** Subtle scroll-triggered fade-ins were considered. Decided against for v0.1 — the page is short enough that they'd feel like noise. Revisit if the page grows.
- **Search.** Not yet justified at this content scale.
- **Dark/light system-preference auto-follow.** Currently we read `prefers-color-scheme` only on first visit, then lock to user toggle. Could add a `system` option that re-reads on every mount. Low priority.
- **Analytics.** Deliberately not added (per `AGENTS.md` "what not to do"). Add only if we want to measure something specific.

## Recently shipped

- **UI design system + Showcase + Storybook + Playwright (2026-05-05).** Site redesigned to follow the new `conventions/ui-design/` rules. Added: 4 primitive components in `src/components/ui/` (Button with all 5 states, Input with all 5 states, Card, Chip with semantic tones); semantic color tokens (`--color-success/danger/warning/info`) in `tokens.css`; on-site `DesignSystem` section showing live tokens + components; on-site `Showcase` section with side-by-side vibe-coded vs. rules-applied URL-shortener dashboards; Visual Rules subsection in `Rules.tsx` showing 3 rules in before/after pairs; refreshed Hero with stylized AGENTS.md product preview. Storybook 10.3 installed with stories for all primitives + token displays (Color, Typography, Spacing). Playwright 1.59 installed with smoke tests + dual-theme screenshot capture. **Caught a real bug**: the original `@layer tokens, theme, ...` order made `@theme inline`'s self-referencing `--color-x: var(--color-x)` win over `tokens.css` (later layers win cascade), resolving all CSS vars to empty. Reordered to `@layer theme, tokens, ...` so tokens win. Build clean, lint clean, 7/7 Playwright tests passing.
- **Initial build.** Hero, Problem, Solution, Rules, GetStarted, Header, Footer.
- **Tailwind v4 + tokens.css cascade-layer setup.**
- **Light/dark theme** with FOUC-prevention inline script.
- **Vercel deploy config** (`vercel.json` SPA rewrite).
- **Project docs** (AGENTS.md, CLAUDE.md, GROK.md, README.md).
- **Decision logs** in `docs/decisions/`.
- **Deployed to Vercel** at <https://website-pi-one-3ymijizbxt.vercel.app>. Project `john-diligs-projects/website`. Production target. Custom domain not configured yet — TBD.

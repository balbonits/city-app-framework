# AGENTS.md

Instructions for AI coding agents working on the city-app-framework website.

This project follows the universal rules at [`../../AGENTS.md`](../../AGENTS.md). Read that first. This file overrides defaults with project specifics.

---

## Project

**city-app-framework website** — official whitepaper / marketing site for the framework. Lives in `examples/website/` of the framework repo as a working dogfood example.

Repo: <https://github.com/balbonits/city-app-framework>
Source dir: `examples/website/`

---

## Stack

| Component | Technology |
| --- | --- |
| Build tool | Vite 8 |
| Framework | React 19 (client-side SPA, single-page) |
| Language | TypeScript 6, strict mode |
| Routing | None — single page with anchor links |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| State | Local `useState` only; no global state lib |
| Icons | `lucide-react` |
| Linting | ESLint 10 (flat config) + typescript-eslint |
| Hosting | Vercel (static SPA) |

> Vite, not Next.js, on purpose. The site has no server-rendered or per-route logic; it's a single page with anchored sections. Vite ships less, builds faster, has fewer surprises.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server (defaults to `:5173`, falls back if taken) |
| `npm run build` | Type-check (`tsc -b`) then build production bundle into `dist/` |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Run ESLint over the project |

The build runs `tsc -b` before `vite build`, so type errors fail the build.

---

## Project layout

```text
examples/website/
├── AGENTS.md                       # this file
├── BACKLOG.md                      # live work queue
├── CLAUDE.md                       # one-line pointer to AGENTS.md
├── GROK.md                         # one-line pointer to AGENTS.md
├── README.md                       # human-facing project overview
├── docs/
│   └── decisions/                  # ADRs for non-obvious choices
├── eslint.config.js
├── index.html                      # Vite entry; sets data-theme inline
├── package.json
├── public/
│   └── favicon.svg                 # two-bar mark (universal + per-project)
├── src/
│   ├── App.tsx                     # composes Header + sections + Footer
│   ├── main.tsx                    # mounts <App /> into #root
│   ├── index.css                   # Tailwind v4 entry + @theme inline bridge
│   ├── styles/
│   │   └── tokens.css              # design tokens (colors, fonts, radii)
│   ├── hooks/
│   │   └── useTheme.ts             # light/dark toggle, persists to localStorage
│   ├── stories/                    # Storybook token displays (no components)
│   │   ├── Color.stories.tsx       # color palette swatches
│   │   ├── Typography.stories.tsx  # type scale + tightening demo
│   │   └── Spacing.stories.tsx     # 4-point grid display
│   └── components/
│       ├── Header.tsx              # sticky top bar: name + theme toggle + GitHub
│       ├── Footer.tsx              # repo link + meta
│       ├── Hero.tsx                # headline + CTA + product preview
│       ├── Problem.tsx             # "stateless agents, first-prompt forever"
│       ├── Solution.tsx            # two-layer model + how it loads
│       ├── Rules.tsx               # featured rule groups + visual rule demos
│       ├── DesignSystem.tsx        # on-site live tokens + components showcase
│       ├── Showcase.tsx            # vibe-coded vs rules-applied SaaS dashboards
│       ├── GetStarted.tsx          # three-step onboarding
│       ├── Section.tsx             # max-width container primitive
│       ├── Eyebrow.tsx             # § accent label
│       ├── CodeBlock.tsx           # bordered code surface
│       └── ui/                     # design-system primitives (per conventions/ui-design/)
│           ├── Button.tsx          # 3 variants × 5 states
│           ├── Button.stories.tsx
│           ├── Input.tsx           # 5 states (default/focus/error/warning/disabled)
│           ├── Input.stories.tsx
│           ├── Card.tsx            # surface container, no double-nest
│           ├── Card.stories.tsx
│           ├── Chip.tsx            # 5 semantic tones (neutral/success/danger/warning/info)
│           └── Chip.stories.tsx
├── tsconfig.app.json               # strict TS, @/ alias
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json                     # SPA rewrite (all paths → /)
└── vite.config.ts
```

---

## File & folder naming

| Kind | Style | Example |
| --- | --- | --- |
| Folders | `lowercase` | `components/`, `hooks/`, `styles/` |
| Component files | `PascalCase.tsx` | `Hero.tsx`, `Section.tsx` |
| Hook files | `useFoo.ts` | `useTheme.ts` |
| Stylesheets | `lowercase.css` | `tokens.css`, `index.css` |

---

## Imports

Use the `@/` path alias — don't use long relative paths.

- `@/components/Header`
- `@/hooks/useTheme`

Configured in `tsconfig.app.json` (`paths`) and `vite.config.ts` (`resolve.alias`).

---

## Styling

- **Tokens** live in `src/styles/tokens.css` and are exposed to Tailwind v4 via `@theme inline { ... }` in `src/index.css`.
- **Dark is the default.** `[data-theme="light"]` flips to light. `index.html` includes an inline script that resolves the initial theme before the React tree mounts (prevents FOUC).
- **Cascade layer order** (declared at top of `index.css`): `@layer theme, tokens, base, components, utilities;` — `tokens` MUST come AFTER `theme`. Why: Tailwind v4 emits `@theme inline { --color-x: var(--color-x); }` blocks into `:root` in the `theme` layer. With the original `tokens, theme, ...` order, those self-referencing declarations won the cascade and resolved every var to empty. Putting `tokens` after `theme` makes the real values from `tokens.css` win. Don't change this order.
- **Available token utilities**: `bg-bg`, `bg-surface`, `bg-surface-raised`, `text-fg`, `text-fg-strong`, `text-fg-muted`, `text-fg-faint`, `text-accent`, `text-accent-contrast`, `text-[var(--color-success|danger|warning|info)]`, `border-border-DEFAULT`, `border-border-strong`, `border-border-faint`, `font-sans`, `font-mono`.
- **Accent color** is amber (`#f59e0b` dark / `#b45309` light) — readable on both themes, picked over violet/cyan for "warm city-at-night" tone without theatrics.
- **Semantic colors** (success/danger/warning/info) are a separate ramp from the brand accent — see `conventions/ui-design/color.md`. Warning is lemon-tinted (`#facc15` / `#a16207`) to distinguish from amber accent.

---

## Theme

`useTheme()` returns `[theme, toggle]`. On first load it reads `localStorage.theme`, else `prefers-color-scheme`. Writes `document.documentElement.dataset.theme` + `localStorage.theme` on change. Also updates the `<meta name="theme-color">` for mobile browser chrome.

The inline script in `index.html` runs before the React tree mounts, so the page never flashes the wrong theme.

---

## Routing

No router. The site is a single page; navigation is anchor-link based (`#problem`, `#solution`, `#rules`, `#get-started`). `scroll-behavior: smooth` in `index.css` handles the rest.

If a future change needs multi-page, switch to React Router v7 — don't reach for Next.js.

---

## Testing

- **Playwright** (`@playwright/test` 1.59) for E2E + visual smoke. Tests live in `tests/`. Config in `playwright.config.ts` auto-starts `npm run dev` via `webServer`. Run with `npm run test:e2e` (headless) or `npm run test:e2e:ui` (interactive).
- The smoke suite covers: page load, all section IDs render, design system content, showcase dashboards, hero product preview, dual-theme full-page screenshots into `tests/screenshots/`. Theme is forced via `localStorage` + reload (not `addInitScript` — that races with React mount).
- **Storybook** (`storybook` 10.3) for component review in isolation. Stories colocated with primitives in `src/components/ui/*.stories.tsx`; token displays in `src/stories/`. Preview at `npm run storybook` (port 6006). Static export via `npm run build-storybook`.
- **Vitest** is in `devDependencies` (added by Storybook init for `addon-vitest`) but no unit test config / suite yet. Add only when interactive logic justifies it.
- Per project rule: don't write tests for trivial UI components. The smoke + screenshots are enough to catch regressions in the design system itself.

---

## Deployment

Vercel auto-detects Vite. `vercel.json` ships an SPA rewrite (`all paths → /`) so future deep-links work even though we're single-page today.

Do not commit `.vercel/`.

---

## What not to do

- Don't add Next.js, Astro, or any other framework — the site is intentionally Vite-only.
- Don't add a CSS-in-JS library — Tailwind + tokens is the styling system.
- Don't add a state-management library — local `useState` is enough for one toggle.
- Don't introduce a CMS, MDX runtime, or content-management layer — content is plain JSX in section components, on purpose. Easier to commit, easier to review.
- Don't downgrade React, TypeScript, or Vite majors — they're all on intended majors.
- Don't commit `.env*` or anything in `.vercel/`.
- Don't add tracking / analytics without asking — the site is informational, not commercial.

---

## BACKLOG hygiene

`BACKLOG.md` at the project root is the live work queue. Update it whenever a push or merge to `main` ships, partially ships, or invalidates a backlog item. See universal `AGENTS.md` for the rule.

---

## Decision log

Non-obvious choices live in `docs/decisions/NNN-short-title.md` as ADRs. See universal `AGENTS.md` for the format.

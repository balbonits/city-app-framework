# AGENTS.md

Instructions for AI coding agents working in this repository.

This project follows the universal rules at [city-app-framework/AGENTS.md](https://github.com/balbonits/city-app-framework/blob/main/AGENTS.md). Read that first. This file overrides defaults with project specifics.

---

## Project

**[Project name]** — [one-sentence description]. [Deployed at URL or local-only].

Repo: [URL]

---

## Stack

| Component | Technology |
| --- | --- |
| Build tool | [e.g. Vite 6] |
| Framework | [e.g. React 19 SPA / Next.js 15 / Vanilla] |
| Language | [e.g. TypeScript 5.7 strict] |
| Routing | [e.g. React Router v7] |
| Styling | [e.g. Tailwind CSS v4] |
| State | [e.g. Zustand / useState only / Redux Toolkit] |
| UI kit | [e.g. Headless UI + Heroicons] |
| Linting | [e.g. ESLint 9 flat config] |
| Testing | [e.g. Vitest + Playwright] |
| Hosting | [e.g. Vercel] |

> [Any "intentionally chose X over Y" notes — e.g. "Vite, not CRA. CRA was deprecated by Meta in Feb 2025."]

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | [start dev server] |
| `npm run build` | [type-check + build] |
| `npm run lint` | [lint] |
| `npm run test` | [run tests] |
| `npm run preview` | [preview production build] |

---

## Project layout

```text
src/
  [actual tree of how this project is organized]
  main.tsx                       # entry
  App.tsx                        # root component
  ...
```

---

## File & folder naming

| Kind | Style | Example |
| --- | --- | --- |
| Folders | `lowercase` | `components/`, `routes/` |
| Component files (default-export React component) | `PascalCase.tsx` | `Button.tsx`, `Home.tsx` |
| Hook files | `useFoo.ts` | `useTheme.ts` |
| Data / config / utility modules | `lowercase.ts` or `camelCase.ts` | `router.tsx`, `projects.ts` |
| Stylesheets | `lowercase.css` | `tokens.css`, `index.css` |

---

## Imports

Use the `@/` path alias — don't use long relative paths.

- `@/components/ui/Button`
- `@/data/projects`
- `@/hooks/useTheme`

[Configured in `tsconfig.json` and `vite.config.ts` — adjust per project.]

---

## Styling

[Project-specific styling notes. Examples:]

- Tokens live in `src/styles/tokens.css`, exposed to Tailwind via `@theme inline { ... }` in `src/index.css`.
- Dark mode driven by `data-theme="dark"` on `<html>`.
- Cascade layer order: `@layer tokens, theme, base, components, utilities;`.

---

## Routing

[How routes are defined. Examples:]

- All routes live in `src/router.tsx` as a single `RouteObject[]`.
- Always use `<Link>` / `<NavLink>` for internal links — never `<a href>`.

---

## Testing

[What's tested, what's skipped, how to run.]

- Per project rule: don't write tests for trivial UI components. Test data-driven components, custom hooks, utilities, and complex business logic.

---

## What not to do

[Project-specific footguns. Examples:]

- Don't introduce CSS-in-JS — Tailwind + tokens is the styling system.
- Don't commit `.env*` files.
- Don't downgrade [framework version].
- Don't [other project-specific anti-patterns].

---

## Deployment

[How this project ships. Vercel auto-detect notes, vercel.json rewrites, etc.]

---

## BACKLOG hygiene

`BACKLOG.md` at the repo root is the live work queue. Update it whenever a push or merge to `main` completes, partially completes, or invalidates a backlog item.

| Situation | Action |
| --- | --- |
| Item shipped fully | Move to "Recently shipped" at the bottom (or remove if old). |
| Item shipped partially | Update scope; mark done bullets with strikethrough or move to "Shipped" sub-bullet. |
| New work emerged mid-task | Add a new item or sub-bullet under the relevant existing item. |
| Item turned out to be wrong / obsolete | Remove it and explain why in the commit body. |

---

## Decision log

Non-obvious architectural choices go in `docs/decisions/NNN-short-title.md` as ADRs. See the universal `AGENTS.md` for the format.

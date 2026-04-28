# GROK.md

Read [AGENTS.md](./AGENTS.md). It's the source of truth for how to work in this repo.

Quick pointers (full detail in `AGENTS.md`):

- **Stack:** Vite 8 + React 19 + TypeScript 6 strict + Tailwind CSS v4. No router. lucide-react for icons.
- **Build:** `npm run build` runs `tsc -b && vite build` — type errors fail the build.
- **Dark is the default.** Theme is set inline in `index.html` before React mounts.
- **Universal framework rules** are at [`../../AGENTS.md`](../../AGENTS.md). This project's rules override.
- **Not** Next.js or Astro — this is a single-page Vite SPA on purpose.

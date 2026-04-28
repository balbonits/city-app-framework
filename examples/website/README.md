# city-app-framework website

The official whitepaper / marketing site for [city-app-framework](https://github.com/balbonits/city-app-framework). Single-page, single-purpose: explain what the framework is, why stateless AI agents need it, and how to start using it in three steps.

This project is also the framework's first **dogfood** example — it was built using the framework's own rules. Its [`AGENTS.md`](./AGENTS.md) follows the per-project template; the universal rules link upward to the framework root.

## Status

v0.1 — built, deployed. Expected to evolve as the framework itself does.

## Local development

```bash
npm install
npm run dev
```

Vite serves on `http://localhost:5173` (or the next free port).

## Stack

Vite 8 + React 19 + TypeScript 6 (strict) + Tailwind CSS v4. No router; the site is one page with anchored sections. Icons via `lucide-react`. Light/dark theme via a CSS-variable token system, default dark, persisted to `localStorage`.

See [`AGENTS.md`](./AGENTS.md) for the full breakdown.

## Structure

```text
src/
  main.tsx                  # entry
  App.tsx                   # composes Header + sections + Footer
  index.css                 # Tailwind v4 entry + @theme inline bridge
  styles/tokens.css         # design tokens (colors, fonts, radii)
  hooks/useTheme.ts         # theme toggle
  components/
    Header.tsx              # sticky bar: name + theme toggle + GitHub
    Footer.tsx
    Hero.tsx                # "Rules AI agents read first."
    Problem.tsx             # "Stateless agents, first-prompt forever."
    Solution.tsx            # two-layer model
    Rules.tsx               # featured rule groups
    GetStarted.tsx          # three-step onboarding
    Section.tsx             # max-width container primitive
    Eyebrow.tsx             # § accent label
    CodeBlock.tsx           # bordered code surface
```

## Deployment

Auto-deployed to Vercel from `main`. `vercel.json` ships an SPA rewrite so any future deep-link routes don't 404 on direct visit.

## License

Same as the parent framework repo.

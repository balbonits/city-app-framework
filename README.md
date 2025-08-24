# City App Framework Repository

## Overview
GitHub repo collecting notes, documentation, and case study for the City App Framework—a modular, city-themed development framework for FE/BE web projects. Adapts to CSR, SSR, SSG, PWA, Native/Hybrid. Emphasizes mobile-first responsive design, minimal dependencies, feature flagging, code review.

## Structure
- **City Hall**: Centralized FE state management (`context/Providers.tsx`, wraps `App.tsx` with error boundary).
- **Works**: Hooks and utilities (`hooks/`, `utils/`) for logic, security, a11y, i18n, analytics, feature flags.
- **Components**: Reusable FE components (`components/`) tested in Storybook.
- **Arts**: Styles (`styles/arts.css`) with Tailwind, mobile-first, responsive, themes.
- **Store**: FE state (`store/`) and BE APIs (`server/api/`).
- **Models**: Types (`types/` for FE/BE).
- **Districts**: Routing (`routes/` for FE, `server/routes/` for BE).
- **Specs**: Docs (this README, `AI_CONTEXT.md`, `HISTORY.md`, `DEV_JOURNEY.md`, `PROJECT.md`, `TODOS.md`, `UX.md`, `API.md`, `SECURITY.md`, `ARCHITECTURE.md`, `SPECS.md`, `COMPLIANCE.md`), configs, DevOps.

## Setup
1. Clone repo: `git clone <repo-url>`.
2. Install: `npm install`.
3. Configure: Copy `.env.example` to `.env`, set vars (e.g., `FEATURE_FLAGS=NEW_FEATURE_A:T1`).
4. Run FE: `npm run dev`.
5. Run BE: `npm run start:server`.
6. Test: `npm test` (unit), `npm run e2e` (E2E).
7. Build: `npm run build` (FE Vite, BE esbuild).
8. Deploy: FE to Vercel/Netlify, BE to Heroku/AWS.

## Key Features
- **Mobile-First Design**: Base styles for small screens in `arts.css`, scale with media queries.
- **Feature Flagging**: Multi-flag variants (`utils/flags/getFeatureFlags.ts`), set via URL params/env, tied to branches (`feature/`, `fix/`, `doc/`), A/B testing.
- **Code Review**: PRs for branches, solo/team approvals, automated checks (ESLint, conventions, a11y) in CI/CD.
- **Optimization**: Network caching, critical CSS, minification, lazy loading, memoization (FE); query caching, compression (BE).
- **Rendering**: CSR (React), SSR/SSG (Next.js), PWA (service workers), Native/Hybrid (React Native/Capacitor).
- **Compliance**: WCAG/GDPR via `utils/a11y/`, `utils/compliance/`, `COMPLIANCE.md`.

## Usage
- FE Example:
  ```tsx
  import { useFeatureFlags } from './store/useFeatureFlags';
  import { useTranslation } from './hooks/useTranslation';

  const Component = () => {
    const flags = useFeatureFlags();
    const { t } = useTranslation();
    return (
      <button className={flags['NEW_FEATURE_A'] === 'T1' ? 'newStyle' : 'btnPrimary'}>
        {t('btn.submit')}
      </button>
    );
  };
  ```
- BE Example:
  ```ts
  // server/api/auth.ts
  import express from 'express';
  const router = express.Router();
  router.post('/login', async (req, res) => {
    res.json({ id: 'user1', name: 'User' });
  });
  export default router;
  ```

## Contributing
- Branches: `feature/`, `fix/`, `doc/`, `chore/`, `refactor/`.
- Naming: `{type}{PascalCase}` IDs, `camelCase` variables.
- Submit PRs, ensure CI/CD passes (linting, tests, conventions, a11y).
- Document in `SPECS.md`, `COMPLIANCE.md`.

## License
MIT

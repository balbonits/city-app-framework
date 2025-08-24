# The "CITY" App Framework

## Overview
The "CITY" App Framework is a modular, city-themed development framework for front-end (FE) and back-end (BE) web projects. It adapts to CSR, SSR, SSG, PWA, Native/Hybrid apps, emphasizing mobile-first responsive design, minimal dependencies, feature flagging, and code review. Built through iterative AI-assisted discussions, it prioritizes hook-centric logic, reusable components, and scalable workflows.

## Core Tenets
- **Mobile-First UX/UI**: Base styles for small screens in Arts, scale with media queries.
- **Hook-Centric**: Logic in Works (hooks/utilities) for state, side effects.
- **TypeScript Preferred**: For type safety in Models.
- **Minimal Dependencies**: Case-by-case evaluation (e.g., React Markdown for docs, DOMPurify for XSS).
- **Adaptability**: Dev team selects rendering/deployment approach.

## Structure
- **City Hall**: Centralized FE state management (`context/Providers.tsx`, wraps `App.tsx` with error boundary).
- **Works**: Hooks/utilities (`hooks/`, `utils/`) for logic, security, a11y, i18n, analytics, feature flags.
- **Components**: Reusable FE components (`components/`) in Storybook.
- **Arts**: Styles (`styles/arts.css`) with Tailwind, mobile-first, responsive, themes.
- **Store**: FE state (`store/`) and BE APIs (`server/api/`).
- **Models**: Types (`types/`) for FE/BE.
- **Districts**: Routing (`routes/` FE, `server/routes/` BE).
- **Specs**: Docs (`README.md`, `COMPLIANCE.md`), configs, DevOps, code review.

## Setup
1. Clone repo: `git clone <repo-url>`.
2. Install: `npm install`.
3. Configure `.env`: Set vars (e.g., `FEATURE_FLAGS=NEW_FEATURE_A:T1`).
4. Run FE: `npm run dev` (Vite).
5. Run BE: `npm run start:server` (Node.js/Express).
6. Test: `npm test` (unit), `npm run e2e` (E2E).
7. Build: `npm run build` (FE Vite, BE esbuild).
8. Deploy: FE Vercel/Netlify, BE Heroku/AWS.

## Key Features
- **Mobile-First Design**: Tailwind in Arts with responsive breakpoints.
- **Feature Flagging**: Multi-variant flags (`utils/flags/getFeatureFlags.ts`), set via URL/env, tied to branches (`feature/`, `fix/`).
- **Code Review**: PRs for branches, solo/team approvals, automated checks (ESLint, conventions, a11y) in CI/CD.
- **Optimization**: Network caching, critical CSS, minification, lazy loading, memoization (FE); query caching, compression (BE).
- **Rendering**: CSR (React), SSR/SSG (Next.js), PWA (service workers), Native/Hybrid (React Native/Capacitor).
- **Compliance**: WCAG/GDPR via `utils/a11y/`, `utils/compliance/`, `COMPLIANCE.md`.

## Usage
- **FE State with City Hall**:
  ```tsx
  import Providers from './context/Providers';
  import AppRoutes from './routes/routes';

  const App = () => (
    <Providers>
      <AppRoutes />
    </Providers>
  );
  ```

- **Feature Flag in Component**:
  ```tsx
  import { useFeatureFlags } from './store/useFeatureFlags';

  const Component = () => {
    const flags = useFeatureFlags();
    return flags['NEW_FEATURE_A'] === 'T1' ? <NewFeature /> : <OldFeature />;
  };
  ```

- **BE API Endpoint**:
  ```ts
  // server/api/auth.ts
  import express from 'express';

  const router = express.Router();
  router.post('/login', (req, res) => {
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

## Resources
- Full chat thread: `CITY_APP_FRAMEWORK.md` (complete documentation and history).
- Case Study: `city_framework_case_study.md` (dashboard app example).

# City App Framework

## Overview
A modular, city-themed framework for front-end (FE) and back-end (BE) web projects, adaptable to CSR, SSR, SSG, PWA, or Native/Hybrid apps. Emphasizes mobile-first, responsive design, minimal dependencies, and scalable workflows with feature flagging and code review.

## Structure
- **City Hall**: Centralized FE state management (`context/Providers.tsx`, wraps `App.tsx` with error boundary).
- **Works**: Hooks (`hooks/useTheme.ts`) and utilities (`utils/sanitize/`) for FE/BE logic, security, a11y, i18n, analytics, feature flags.
- **Components**: Reusable FE components (`components/Button/`) tested in Storybook.
- **Arts**: Mobile-first, responsive styles (`styles/arts.css`) with Tailwind, themes in `styles/themes/`.
- **Store**: FE state (`store/useAuthContext.ts`) and BE APIs (`server/api/`).
- **Models**: TypeScript types (`types/User.ts`) for FE/BE.
- **Districts**: FE routing (`routes/`) and BE routing (`server/routes/`).
- **Specs**: Docs (`README.md`, `COMPLIANCE.md`), Storybook, configs (`.gitattributes`), FE/BE DevOps, code review.

## Setup
1. **Clone Repo**:
   ```bash
   git clone <repo-url>
   cd city-app-framework
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   - Copy `.env.example` to `.env` and set variables (e.g., `FEATURE_FLAGS=NEW_FEATURE_A:T1`).
4. **Run Development**:
   - FE: `npm run dev` (Vite).
   - BE: `npm run start:server` (Node.js/Express).
5. **Test**:
   ```bash
   npm run test # Jest/Vitest
   npm run lint # ESLint
   npm run check-conventions # Naming/structure
   npm run check-a11y # Accessibility
   ```
6. **Build**:
   ```bash
   npm run build # Vite for FE, esbuild for BE
   ```
7. **Deploy**:
   - FE: Vercel/Netlify.
   - BE: Heroku/AWS.

## Key Features
- **Mobile-First Design**: Tailwind in `arts.css` with responsive breakpoints.
- **Feature Flagging**: Toggle features via URL params (`?flags=NEW_FEATURE_A:T1`) or `.env`, tied to `feature/`, `fix/`, `doc/` branches.
- **Code Review**: PRs for all branches, solo or 1-2 team approvals, automated checks (ESLint, conventions, a11y).
- **Optimization**: Network caching, critical CSS, minification, lazy loading, memoization.
- **Rendering**: CSR (React), SSR/SSG (Next.js), PWA (service workers), Native/Hybrid (React Native, Capacitor).
- **Compliance**: WCAG, GDPR via `utils/a11y/`, `utils/compliance/`.

## Usage
- **FE Example**:
  ```tsx
  import { useFeatureFlags } from './store/useFeatureFlags';
  import { useTranslation } from './hooks/useTranslation';

  const Component: React.FC = () => {
    const flags = useFeatureFlags();
    const { t } = useTranslation();
    return (
      <button className={flags['NEW_FEATURE_A'] === 'T1' ? 'newStyle' : 'btnPrimary'}>
        {t('btn.submit')}
      </button>
    );
  };
  ```
- **BE Example**:
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
- Create branches (`feature/`, `fix/`, `doc/`, `chore/`, `refactor/`).
- Follow naming: `{type}{PascalCase}` IDs, `camelCase` variables.
- Submit PRs, ensure CI/CD passes (linting, tests, conventions, a11y).
- Document in `SPECS.md`, `COMPLIANCE.md`.

## License
MIT

# PROJECT

## Purpose
Internal guide for City App Framework structure, architecture, conventions for human devs (human counterpart to AI_CONTEXT.md).

## Structure
- **City Hall**: FE state management (`context/Providers.tsx`).
- **Works**: Hooks/utilities (`hooks/`, `utils/`) for logic, security, a11y, i18n, analytics, feature flags.
- **Components**: Reusable FE components (`components/`) in Storybook.
- **Arts**: Mobile-first styles (`styles/arts.css`) with Tailwind, themes.
- **Store**: FE state (`store/`) and BE APIs (`server/api/`).
- **Models**: Types (`types/`) for FE/BE.
- **Districts**: Routing (`routes/` FE, `server/routes/` BE).
- **Specs**: Docs, Storybook, configs, DevOps, code review.

## Architecture
- FE: React, hook-centric, Context API in **City Hall**.
- BE: Node.js/Express APIs in **Store**, routing in **Districts**.
- Adaptable rendering (CSR/SSR/SSG/PWA/Native) in **Specs**.
- Optimization: Lazy loading, memoization, code splitting.
- Feature Flagging: Multi-variant flags in **Works**, tied to branches.

## Conventions
- Naming: IDs `{type}{PascalCase}` (e.g., `txtFirstName`), variables `camelCase` (e.g., `toggleTheme`).
- Folders: Lowercase (e.g., `src`, `server`).
- Language: TypeScript preferred, ESLint (Airbnb), no Prettier, ES6+.
- Testing: TDD with AI, >80% coverage, Jest/Vitest, Playwright, Storybook.
- Security: Utilities in **Works** (sanitize, validation).
- DevOps: GitHub Actions, Vite (FE), Node.js (BE).
- Code Review: PRs for `feature/`, `fix/`, etc., automated checks.

## Usage
- Wrap app in `<Providers>`:
  ```tsx
  import Providers from './context/Providers';
  import AppRoutes from './routes/routes';

  const App = () => (
    <Providers>
      <AppRoutes />
    </Providers>
  );
  ```
- Use feature flags:
  ```tsx
  import { useFeatureFlags } from './store/useFeatureFlags';

  const Component = () => {
    const flags = useFeatureFlags();
    if (flags['NEW_FEATURE_A'] === 'T1') {
      // New feature variant
    }
  };
  ```
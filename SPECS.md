# SPECS

## Purpose
High-level overview of City App Framework, including DevOps, rendering, code review.

## DevOps
- CI/CD: GitHub Actions for testing, linting, deployment.
- Build Tools: Vite/Webpack (FE), Node.js/Express (BE).
- Environment: `.env` for vars (e.g., FEATURE_FLAGS).
- Deployment: FE to Vercel/Netlify, BE to Heroku/AWS, feature flags.

## Rendering & Deployment
- CSR: React in App.tsx for dynamic apps.
- SSR: Next.js for SEO pages.
- SSG: Next.js for static content.
- PWAs: Service workers (src/service-worker.ts).
- Native/Hybrid: React Native, Capacitor.
- Select approach per project, document here.

## Code Review
- PRs for branches (feature/, fix/, doc/, chore/, refactor/).
- Solo: Self-review AI code.
- Team: 1-2 approvals.
- Checks: ESLint, naming, structure, compliance (a11y, security, GDPR).
- Automate in .github/workflows/ci.yml, scripts/check-conventions.ts.
- Guidelines: Adhere to framework, readability, performance.

## Other Specs
- Mobile-first: Base styles for small screens, media queries in Arts.
- Feature Flagging: Multi-variant (utils/flags/), tied to branches.
- Optimization: Network caching, critical CSS, minification, lazy loading, memoization.
- Compliance: WCAG/GDPR in COMPLIANCE.md.
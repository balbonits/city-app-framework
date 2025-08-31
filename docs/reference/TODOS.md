# TODOS

## Purpose
Checklist for tasks, priorities, and tech debt in City App Framework.

## Tasks
- High Priority:
  - Implement feature flagging in Works (utils/flags/).
  - Add mobile-first breakpoints to Arts (styles/arts.css).
  - Expand security utilities in Works (utils/security/).

- Medium Priority:
  - Integrate Playwright for E2E tests in Specs.
  - Document rendering choices (CSR/SSR) in SPECS.md.
  - Optimize image loading in Components.

- Low Priority:
  - Explore React Native for Native/Hybrid in Rendering & Deployment.
  - Add more models for BE schemas in Models (types/).

## Tech Debt
- Replace temporary fallback sanitization with DOMPurify if justified.
- Automate a11y checks in CI/CD.
- Refactor large utils/ directories if they grow.

- **Future**: Track new tech debt here.
# ARCHITECTURE

## Purpose
Outlines City App Framework structure and patterns.

## Structure
- **City Hall**: FE state management (`context/Providers.tsx`).
- **Works**: Hooks/utilities (`hooks/`, `utils/`) for logic, security.
- **Components**: Reusable FE components (`components/`) in Storybook.
- **Arts**: Styles (`styles/arts.css`) with Tailwind, mobile-first.
- **Store**: FE state (`store/`) and BE APIs (`server/api/`).
- **Models**: Types (`types/`) for FE/BE.
- **Districts**: Routing (`routes/` FE, `server/routes/` BE).
- **Specs**: Docs, configs, DevOps.

## Architecture
- FE: React, hook-centric, Context API in City Hall.
- BE: Node.js/Express APIs in Store, routing in Districts.
- Adaptable rendering (CSR/SSR/SSG/PWA/Native).
- Optimization: Lazy loading, memoization, code splitting.
- Feature Flagging: Multi-variant flags in Works, tied to branches.

## Design Patterns
- Module, Component, Hook, Observer/Hook, Context/Hook, Composition, Reducer, Factory.
- Avoid: Singleton, Inheritance, Complex Pub/Sub, Decorator, Facade.

## Compliance
- Accessibility: ARIA, utils/a11y/.
- Privacy: Consent in utils/compliance/.
- Document in COMPLIANCE.md.
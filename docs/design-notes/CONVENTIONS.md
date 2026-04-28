# The City 2.0 — Living Conventions (CONVENTIONS.md)

**This is the single source of truth for how we build software in The City 2.0.**

It evolves after every project. The AI Council is responsible for keeping it current and proposing improvements.

---

## 1. Core Philosophy

- **Readability > Cleverness** — Code should be obvious to a competent developer reading it for the first time.
- **Consistency > Individual Preference** — We optimize for the team (or future self) reading the code, not personal style.
- **Explicit > Implicit** — When in doubt, make intent explicit in code or comments.
- **Type Safety First** — We use strict TypeScript (or equivalent) everywhere. `any` is a last resort and must be justified.
- **Tests Are Documentation** — Well-written tests explain behavior better than comments in many cases.

---

## 2. Language & Formatting

### TypeScript / JavaScript

- **Strict Mode**: Always enabled (`"strict": true` in tsconfig)
- **Formatting**: Prettier with 2-space indentation, single quotes, trailing commas, semicolons
- **Line Length**: 100 characters max (soft limit — break earlier if it improves readability)
- **Imports**: 
  - Group: Node built-ins → External packages → Internal absolute → Relative
  - Sort alphabetically within groups
  - Use `import type` for types only

```ts
import fs from 'node:fs/promises';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

import { formatDate } from '../utils/date';
```

### Naming Conventions

| Element              | Convention                  | Example |
|----------------------|-----------------------------|---------|
| **Files**            | `kebab-case` or `PascalCase` (components) | `user-profile.tsx`, `Button.tsx` |
| **Folders**          | `kebab-case`                | `user-management/`, `api-routes/` |
| **Components**       | `PascalCase`                | `UserProfile`, `PrimaryButton` |
| **Hooks**            | `use` + `PascalCase`        | `useUser`, `useFeatureFlag` |
| **Functions**        | `camelCase`                 | `getUserById`, `calculateTotal` |
| **Variables**        | `camelCase`                 | `currentUser`, `isLoading` |
| **Constants**        | `UPPER_SNAKE_CASE`          | `MAX_RETRIES`, `API_BASE_URL` |
| **Types/Interfaces** | `PascalCase`                | `User`, `ApiResponse` |
| **Enums**            | `PascalCase`                | `UserRole`, `OrderStatus` |
| **CSS Classes**      | `kebab-case` (Tailwind)     | `text-primary`, `flex-col` |

**Avoid**:
- Hungarian notation (`strName`, `intCount`)
- Abbreviations that aren't universally understood (`usr`, `cfg`, `svc`)
- Single-letter variables except in very small scopes (`i`, `j` in loops)

---

## 3. Architectural Patterns

### Preferred Patterns

| Pattern              | When to Use                              | Notes |
|----------------------|------------------------------------------|-------|
| **Composition**      | Most component relationships             | Prefer over inheritance |
| **Custom Hooks**     | Reusable logic across components         | Keep them focused and testable |
| **Context + Reducer**| Complex global or feature state          | Use Zustand for simpler global state |
| **Repository Pattern**| Data access layer                       | Especially useful with multiple data sources |
| **Factory Functions**| Creating objects with complex setup      | Cleaner than classes in many cases |
| **Strategy Pattern** | Multiple algorithms for the same task    | E.g., different payment processors |

### Patterns to Avoid (Unless Justified)

- **Deep Inheritance Hierarchies** — Hard to reason about and test
- **God Components / God Functions** — Break into smaller pieces
- **Prop Drilling** — Use Context or state management instead
- **useEffect for Everything** — Prefer `useMemo`, `useCallback`, or custom hooks
- **Magic Numbers / Strings** — Extract to constants with clear names

---

## 4. Component Guidelines

### File Structure (per component)

```
components/
  Button/
    Button.tsx
    Button.test.tsx
    Button.stories.tsx
    Button.module.css (if needed)
    index.ts
```

### Component Rules

- **One component per file** (with rare exceptions for tightly coupled small components)
- **Props interface first** — Define `interface ButtonProps` before the component
- **Default to functional components** + hooks
- **Memoize only when needed** — Don't prematurely optimize
- **Use `asChild` pattern** for flexible composition (Radix-style)

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export function Button({ variant = 'primary', size = 'md', asChild = false, ...props }: ButtonProps) {
  // ...
}
```

---

## 5. Testing Standards

### Philosophy

- **Tests are policies, not afterthoughts**
- Write tests **first** (TDD) when possible
- Focus on **behavior**, not implementation details
- Use **descriptive test names** that read like documentation

### Test Organization

```ts
describe('useUser', () => {
  describe('when user is authenticated', () => {
    it('returns the current user', () => { /* ... */ });
  });

  describe('when user is not authenticated', () => {
    it('returns null', () => { /* ... */ });
  });

  describe('error handling', () => {
    it('throws a typed error on network failure', () => { /* ... */ });
  });
});
```

### Coverage Targets (Minimum)

| Area                    | Target |
|-------------------------|--------|
| New business logic      | 90%+   |
| New UI components       | 80%+   |
| API routes / handlers   | 85%+   |
| Utilities & helpers     | 95%+   |
| Overall project         | 80%+   |

**Critical paths** (auth, payments, data mutations) must have near-100% coverage.

---

## 6. Security & Privacy

### Mandatory Practices

- **Never commit secrets** — Use environment variables + `.env.example`
- **Sanitize all user input** — Especially in API routes and database queries
- **Use parameterized queries** — Never string concatenation for SQL
- **Rate limiting** on all public endpoints
- **CORS properly configured** — Not `*` in production
- **HTTPS only** — Enforce in production
- **Content Security Policy** — Implement and test

### Authentication / Authorization

- Prefer established libraries (NextAuth, Clerk, Supabase Auth, etc.) over custom implementations
- Always validate permissions on the **server**, never trust the client
- Use short-lived tokens + refresh tokens (not long-lived sessions)

---

## 7. Accessibility (a11y)

**All user-facing interfaces must meet WCAG 2.2 AA standards.**

### Checklist

- Semantic HTML (`<button>`, `<nav>`, `<main>`, proper heading hierarchy)
- `aria-*` attributes where native semantics are insufficient
- Keyboard navigation for all interactive elements
- Focus management (visible focus states, logical tab order)
- Color contrast ratios ≥ 4.5:1 for text
- Alt text for meaningful images
- Screen reader testing (at minimum, verify with VoiceOver or NVDA)

---

## 8. Performance

### Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.5s on 4G

### Practices

- Code splitting at route and component level
- Image optimization (Next.js `Image` or equivalent)
- Lazy loading for non-critical components
- Memoization for expensive computations
- Virtual scrolling for long lists
- Prefetching of likely-next routes

---

## 8.5. Component Splitting Guideline

**If a component or module exceeds 120–150 lines, strongly consider extracting sub-components or utility functions.**

This applies especially to:
- Complex UI components (forms, dashboards, visualizations)
- Game systems (physics, collision, rendering)
- Data transformation pipelines

**Exception**: Small games or prototypes where speed matters more than maintainability (see "Speed Run Mode" below).

---

## 8.6. Data-Driven Performance Budgeting

**Set performance budgets based on target devices, not arbitrary numbers.**

Examples:
- For a habit tracker: < 100ms interaction latency on mid-range phones (2024+)
- For a 2D game: < 16ms per frame (60fps) on low-end laptops
- For a data dashboard: < 2s initial load on 4G

**How to measure**:
- Use `performance.now()` for custom timing
- Browser DevTools Performance tab for real traces
- Lighthouse for web vitals

**Never** hardcode limits like "90 days of data" without measuring actual performance on target devices.

---

## 8.7. Schema Migration Pattern (LocalStorage / Client-Side)

**When evolving data models, always include a migration path.**

Recommended pattern:

```ts
const SCHEMA_VERSION = 2;

function loadData(): AppData {
  const raw = localStorage.getItem('app-data');
  if (!raw) return getDefaultData();

  const parsed = JSON.parse(raw);
  const version = parsed.schemaVersion || 1;

  if (version < SCHEMA_VERSION) {
    return migrate(parsed, version);
  }

  return parsed;
}

function migrate(data: any, fromVersion: number): AppData {
  let migrated = { ...data };

  if (fromVersion < 2) {
    // Example: rename a field
    migrated.newFieldName = migrated.oldFieldName;
    delete migrated.oldFieldName;
  }

  migrated.schemaVersion = SCHEMA_VERSION;
  return migrated;
}
```

**Never** change the data shape without a migration — it breaks existing users.

---

## 8.9. Delight & Polish Checklist (for positive/calming projects)

When the project has a "calming," "positive," or "delightful" tone (e.g., habit trackers, meditation apps, casual games), explicitly look for **small moments of delight**:

- [ ] Micro-animation on streak milestone or achievement
- [ ] Subtle sound effect on positive action (optional, user-controllable)
- [ ] Confetti or particle burst on major win (keep it tasteful)
- [ ] Encouraging empty state messages ("You're doing great — keep it up!")
- [ ] Smooth transitions between screens (not jarring)

**Rule**: Delight should feel *earned* and *subtle*, never annoying or distracting. When in doubt, ask the Sponsor for feedback on the "feel."

---

## 8.8. Speed Run Mode (Fast Development)

**When the Sponsor explicitly prioritizes speed ("I want this fast, don't overthink it"), relax these conventions:**

**Allowed to skip**:
- Full test coverage (aim for 60%+ on core logic only)
- Accessibility audit (basic keyboard navigation is enough)
- Schema versioning (if the project is truly throwaway or personal-only)
- Error boundaries and loading states (if the scope is tiny)
- Detailed documentation (minimal inline comments only)

**Still required**:
- Core functionality works end-to-end
- No obvious crashes on happy path
- Auto-save / persistence (if applicable)
- Dark mode (if the project has a UI)
- Responsive layout (mobile-first)

**After the speed run**: If the project becomes important, schedule a "refactor pass" to bring it up to full conventions.

---

## 9. Documentation

### Code-Level

- **JSDoc** for all exported functions, hooks, and complex logic
- **README** in every major folder explaining purpose and usage
- **Decision records** in `.ai/DECISIONS.md` for non-obvious architectural choices

### Project-Level

- `README.md` must answer:
  - What is this?
  - How do I run it locally?
  - How do I deploy?
  - What are the key architectural decisions?
  - Where do I find more documentation?

---

## 10. Git & Commit Conventions

### Commit Messages

Follow **Conventional Commits**:

```
feat: add user profile editing with avatar upload
fix: prevent duplicate submissions on payment form
docs: update CONTRIBUTING.md with new review process
refactor: extract useDebounce hook from SearchInput
test: add coverage for auth error paths
chore: upgrade dependencies to latest
```

### Branching

- `main` — production-ready code
- `feature/*` — new features
- `fix/*` — bug fixes
- `chore/*` — maintenance, dependency updates

**Never commit directly to `main`** — always use pull requests with at least one review.

---

## 11. AI-Specific Instructions

When generating code in The City 2.0:

1. **Always read context first** — `MASTER_CONTEXT.md`, `LIVING_CODEX.md`, and relevant decisions
2. **Follow these conventions strictly** — Do not invent new patterns without proposing them first
3. **Write tests alongside implementation** — Never leave tests for "later"
4. **Document decisions** — If you make a non-obvious choice, record it
5. **Prefer existing patterns** — Check if something similar already exists in the codebase before creating new abstractions
6. **Ask before major refactors** — Even if you think it's an improvement

---

## 12. Evolution of This Document

This file is **living**. After every project, the AI Council must:

1. Review what worked and what caused friction
2. Propose specific additions, changes, or removals
3. Update this file with clear rationale
4. Ensure all existing projects are either updated or explicitly grandfathered

**Version History** is maintained at the bottom of this file.

---

**Current Version**: 2.0.0 (Initial City 2.0 release)  
**Last Updated**: April 27, 2026  
**Maintained By**: AI Council (Knowledge Department) with Sponsor oversight

---

*These conventions exist to make us faster and more consistent over time — not to constrain creativity. When they become a burden, we change them.*
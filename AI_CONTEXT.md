# AI_CONTEXT

## Purpose
Guides AI code generation for City App Framework standards.

## Standards
- **Modularity**: Use city-themed structure (City Hall, Works, Components, Arts, Store, Models, Districts, Specs).
- **Style**: Hook-centric, functional components, minimal dependencies.
- **Naming**:
  - IDs: `{type}{PascalCase}` (e.g., `txtFirstName`).
  - Variables: `camelCase` (e.g., `toggleTheme`).
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).
  - Folders: Lowercase (e.g., `src`, `utils`).
- **Language**: TypeScript preferred, JavaScript for simple projects.
  - ESLint (Airbnb), no Prettier.
  - ES6+ (arrow functions, destructuring).
  - `const` over `let`, strict equality (`===`).
- **Files**: Components (`Button.tsx`), hooks (`useTheme.ts`), utilities (`sanitizeInput.ts`), tests (`test.tsx`), stories (`Button.stories.tsx`).
- **Patterns**: Module, Component, Hook, Context/Hook, Composition, Reducer.
- **Avoid**: Singleton, Inheritance, Complex Pub/Sub, Decorator, Facade.

## Guidelines
- Place hooks/utilities in **Works** (`hooks/`, `utils/`).
- Use **City Hall** (`context/Providers.tsx`) for FE state.
- Store API/state in **Store** (`store/`, `server/api/`).
- Document in **Specs** (`README.md`, `SPECS.md`).
- Ensure mobile-first, responsive in **Arts** (`styles/arts.css`).
- Test with Jest/Vitest, Playwright, Storybook (>80% coverage).
- Feature flagging (`utils/flags/`) for safe rollouts.
- Mobile-first UX/UI in **Arts**.
# The City 2.0 — Monorepo Conventions

**This document defines the standard patterns for Metropolis-tier projects that span multiple apps, shared packages, and DevOps concerns.**

It is a living document. After every monorepo or suite project, the AI Council must propose additions or refinements.

---

## 1. Workspace Structure (Turborepo + pnpm)

### Recommended Layout

```
/project-root/
├── apps/
│   ├── marketing/          # Public-facing site (Next.js)
│   ├── dashboard/          # Customer app (Next.js)
│   ├── admin/              # Internal tools (Next.js)
│   └── api/                # Backend API (optional, if not using Supabase/edge functions)
├── packages/
│   ├── ui/                 # Shared design system + components
│   ├── utils/              # Shared utilities, helpers, types
│   ├── config/             # Shared configuration, feature flags, env schemas
│   └── ops/                # Typed CLI for migrations, seeding, deployments
├── tooling/
│   ├── eslint-config/      # Shared ESLint config
│   ├── tsconfig/           # Shared TypeScript configs
│   └── prettier-config/    # Shared Prettier config (optional)
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .github/workflows/
```

### Why This Structure?

- `apps/` = deployable units (each has its own `next.config.js`, `vercel.json`, etc.)
- `packages/` = shared code (imported by apps via `@acme/ui`, `@acme/utils`, etc.)
- `tooling/` = build/dev tooling (keeps root clean)
- Clear separation of concerns for large teams or future scaling

---

## 2. Shared Package Patterns

### `packages/ui` (Design System)

- **Purpose**: Reusable components, primitives, layout, theme
- **Tech**: React + TypeScript + Tailwind + Storybook (for internal docs)
- **Versioning**: Semver + changelog (even for internal use)
- **Exports**:
  - Components: `Button`, `Input`, `Modal`, `Card`, `Table`, etc.
  - Primitives: `Box`, `Stack`, `Text`, `Heading`
  - Hooks: `useTheme`, `useMediaQuery`
  - Types: `ButtonProps`, `Theme`, etc.

**Rule**: Apps should **compose** their own higher-level components from `ui` primitives, not import complex business components.

### `packages/utils`

- Pure functions, formatters, validators, helpers
- No React, no side effects
- Examples: `formatCurrency`, `validateEmail`, `generateId`, `debounce`

### `packages/config`

- Shared environment schemas (Zod)
- Feature flag definitions
- App-wide constants
- Example: `env.ts` with typed `process.env` validation

### `packages/ops`

- Typed CLI for common operations (migrations, seeding, feature flag toggles, deployments)
- Built with `commander` or `oclif`
- Example commands:
  ```bash
  pnpm ops migrate up
  pnpm ops seed dev
  pnpm ops feature-flag enable new-checkout
  pnpm ops deploy --env=staging
  ```

---

## 3. Design System Versioning

**Even for internal design systems, use semver + changelog.**

**Why**: Prevents breaking changes from silently propagating across apps.

**Process**:
1. Make changes in `packages/ui`
2. Bump version in `package.json` (patch/minor/major)
3. Update `CHANGELOG.md`
4. Run `pnpm install` in root (updates lockfile)
5. Apps automatically get the new version on next `pnpm install`

**Breaking changes**: Must be communicated to all app owners (even if internal).

---

## 4. Cross-App Testing

### Recommended: Playwright Workspace

- Add a `tests/` folder at root (or `packages/e2e`)
- Use Playwright to test flows that span multiple apps:
  - "User signs up in marketing → appears in admin → can login to dashboard"
  - "Admin impersonates user → user sees correct data in dashboard"

**Example** (`tests/e2e/signup-flow.spec.ts`):

```ts
import { test, expect } from '@playwright/test';

test('signup flow creates user in admin', async ({ page }) => {
  await page.goto('http://localhost:3000'); // marketing
  await page.click('text=Get Started');
  await page.fill('input[name=email]', 'test@example.com');
  await page.click('button[type=submit]');

  // Switch to admin context
  const adminPage = await context.newPage();
  await adminPage.goto('http://localhost:3002'); // admin
  await adminPage.fill('input[name=email]', 'admin@acme.com');
  await adminPage.fill('input[name=password]', 'admin');
  await adminPage.click('button[type=submit]');

  await expect(adminPage.locator('text=test@example.com')).toBeVisible();
});
```

---

## 5. Environment Variable Management

**Problem**: Many apps share the same Supabase URL, Stripe keys, etc. Duplication is error-prone.

**Solution**: `packages/config` + per-app `.env.local`

**Structure**:

```ts
// packages/config/src/env.ts
import { z } from 'zod';

export const sharedEnv = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
});

export const marketingEnv = sharedEnv.extend({
  NEXT_PUBLIC_MARKETING_URL: z.string().url(),
});

export const dashboardEnv = sharedEnv.extend({
  NEXT_PUBLIC_DASHBOARD_URL: z.string().url(),
});
```

**Each app** imports only what it needs:

```ts
// apps/dashboard/src/env.ts
import { dashboardEnv } from '@acme/config';

export const env = dashboardEnv.parse(process.env);
```

---

## 6. Feature Flags as Data (Not Code)

**Recommended**: Store feature flags in Supabase (or a simple JSON file for smaller projects).

**Why**: Enables runtime toggling without redeploys, A/B testing, and gradual rollouts.

**Schema** (Supabase):

```sql
create table feature_flags (
  key text primary key,
  enabled boolean default false,
  rollout_percentage int default 100,
  description text,
  updated_at timestamptz default now()
);
```

**Usage in apps**:

```ts
const { data } = await supabase
  .from('feature_flags')
  .select('*')
  .eq('key', 'new-checkout');

if (data?.enabled) {
  // show new checkout
}
```

**Ops CLI** (from `packages/ops`):

```bash
pnpm ops feature-flag enable new-checkout --rollout 50
```

---

## 7. DevOps as Code (Typed CLI)

**Instead of scattered bash scripts, create a typed `ops` package.**

**Example commands**:

```bash
# Database
pnpm ops migrate up
pnpm ops migrate down
pnpm ops seed dev
pnpm ops seed prod --confirm

# Deployments
pnpm ops deploy --app=dashboard --env=staging
pnpm ops deploy --app=all --env=production

# Feature flags
pnpm ops feature-flag list
pnpm ops feature-flag enable new-checkout --rollout 25

# Monitoring
pnpm ops logs --app=dashboard --since=1h
pnpm ops alerts list
```

**Benefits**:
- Type-safe (no more typos in env names or app names)
- Self-documenting (help text, examples)
- Consistent across all projects
- Easy to extend (add new commands as the suite grows)

---

## 8. CI/CD Patterns (GitHub Actions)

### Recommended Structure

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
```

**Turbo caching**: Add `--filter` flags to only build changed packages:

```yaml
- run: pnpm turbo run build --filter=@acme/dashboard
```

---

## 9. When to Split a Monorepo

**Keep together when**:
- Shared design system or utilities
- Frequent cross-app changes (e.g., shared auth, billing, feature flags)
- Small-to-medium team (< 10 developers)
- Fast local development is important (Turborepo caching helps)

**Split into separate repos when**:
- Completely unrelated products (e.g., Acme SaaS + Acme Marketing Agency site)
- Very large team with strict ownership boundaries
- Different tech stacks or deployment targets that don't benefit from shared tooling
- Security/compliance requires isolation (e.g., separate PCI-compliant repo)

**Default for City 2.0**: Start with a monorepo. Split only when the above conditions are clearly met.

---

**This document is the foundation for monorepo / suite projects.** After every such project, the AI Council must propose additions based on what was learned. The goal is to make the *next* suite faster, more consistent, and more maintainable.
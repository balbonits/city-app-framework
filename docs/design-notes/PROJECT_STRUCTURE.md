# The City 2.0 — Standard Project Structure

This document defines the **canonical folder structure** for all City 2.0 projects. The goal is consistency across projects so that both humans and AI agents can navigate any City 2.0 codebase immediately.

For monorepo/suite projects, see `MONOREPO_CONVENTIONS.md` for the extended structure (`apps/`, `packages/`, `tooling/`).

---

## Root Directory

```
/project-name/
├── .ai/                      # AI Council context & memory (NEVER DELETE)
├── src/                      # Application source code
├── tests/                    # Test suite (mirrors src/ structure)
├── public/                   # Static assets (images, fonts, etc.)
├── docs/                     # Human-readable project documentation
├── scripts/                  # One-off scripts, generators, utilities
├── .github/                  # GitHub Actions, issue/PR templates
├── .env.example              # Environment variable template
├── .gitignore
├── city.config.json          # City 2.0 project configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts          # or jest.config, playwright.config, etc.
├── README.md                 # Sponsor-facing overview
└── LICENSE
```

---

## The `.ai/` Directory (Critical)

This is the **institutional memory** of the project. The AI Council reads and writes here constantly.

```
.ai/
├── MASTER_CONTEXT.md         # Project-wide understanding (what, why, how)
├── SPONSOR_INTENT.md         # Original vision + any updates from Sponsor
├── LIVING_CODEX.md           # Current conventions (synced from global CONVENTIONS.md)
├── DECISIONS.md              # Architecture decisions + rationale log
├── departments/              # Role-specific context and instructions
│   ├── strategy.md
│   ├── engineering.md
│   ├── quality.md
│   ├── design.md
│   ├── operations.md
│   ├── knowledge.md
│   └── review.md
├── retrospectives/           # Post-mortem outputs (one per milestone)
│   ├── 2026-04-20-kickoff.md
│   └── 2026-04-25-feature-x.md
└── prompts/                  # Project-specific prompt overrides (rare)
```

**Rules**:
- `MASTER_CONTEXT.md` must be kept under ~3,500 tokens (summarize ruthlessly)
- Every significant decision goes in `DECISIONS.md` with date and reasoning
- After every milestone, a retrospective is written to `retrospectives/`

---

## `src/` Directory Structure

The structure is **domain/feature-first**, not type-first.

```
src/
├── app/                      # Next.js App Router (or equivalent entry point)
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/                  # API routes (if using Next.js API routes)
│       └── auth/
│           └── route.ts
├── features/                 # Business domains / major features
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── user-profile/
│   ├── billing/
│   └── dashboard/
├── components/               # Shared / reusable UI components
│   ├── ui/                   # Low-level primitives (Button, Input, Modal)
│   ├── forms/                # Form-specific components
│   └── layout/               # Layout primitives (Header, Sidebar, Footer)
├── hooks/                    # Shared custom hooks (not feature-specific)
├── lib/                      # Utilities, helpers, shared logic
│   ├── api/                  # API client, fetchers
│   ├── utils/                # Pure functions, formatters
│   ├── validations/          # Zod schemas, validation helpers
│   └── constants.ts
├── types/                    # Global TypeScript types (use sparingly)
├── styles/                   # Global styles, Tailwind config, design tokens
└── config/                   # App configuration, feature flags
```

### Feature Folder Guidelines

Each feature folder should be **self-contained**:

- `components/` — UI specific to this feature
- `hooks/` — Logic specific to this feature
- `api/` — API calls / data fetching for this feature
- `types.ts` — Types specific to this feature
- `index.ts` — Public exports

**Do not** create deeply nested feature folders. If a feature is large, split it into multiple features.

---

## `tests/` Directory

Mirrors `src/` structure for easy navigation.

```
tests/
├── unit/                     # Fast, isolated unit tests
│   ├── features/
│   ├── components/
│   └── lib/
├── integration/              # Integration tests (API + DB, etc.)
├── e2e/                      # Playwright / Cypress end-to-end tests
│   ├── auth.spec.ts
│   └── checkout.spec.ts
└── fixtures/                 # Test data, mocks, factories
```

---

## `docs/` Directory

Human-readable documentation (not code comments).

```
docs/
├── README.md                 # Documentation index
├── architecture.md           # High-level architecture overview
├── decisions/                # ADR-style decision records (human version)
│   ├── 001-use-clerk-for-auth.md
│   └── 002-migrate-to-server-components.md
├── api/                      # API documentation (if not using Swagger/OpenAPI)
├── deployment.md
└── contributing.md
```

---

## Configuration Files

| File                    | Purpose |
|-------------------------|---------|
| `city.config.json`      | City 2.0 settings (complexity tier, active departments, escalation rules) |
| `package.json`          | Dependencies + scripts (standardized scripts: `dev`, `build`, `test`, `lint`, `typecheck`) |
| `tsconfig.json`         | Strict TypeScript config (path aliases: `@/*` → `src/*`) |
| `.env.example`          | All required environment variables with descriptions |
| `vitest.config.ts`      | Unit test configuration |
| `playwright.config.ts`  | E2E test configuration |

---

## `.github/` Directory

```
.github/
├── workflows/
│   ├── ci.yml                # Lint, typecheck, test on PR
│   ├── deploy.yml            # Deploy to production
│   └── dependabot.yml
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── PULL_REQUEST_TEMPLATE.md
└── CODEOWNERS
```

---

## What NOT to Create

- `src/constants/` with hundreds of random constants (colocate with usage)
- `src/utils/` with 50 unrelated helper functions (group by domain)
- `src/types/` with every possible type (colocate types with the code that uses them)
- Deeply nested folders without clear ownership
- `src/shared/` or `src/common/` (these become dumping grounds)

---

## City 2.0 Configuration (`city.config.json`)

```json
{
  "version": "2.0.0",
  "projectName": "my-app",
  "complexityTier": "city",
  "activeDepartments": ["strategy", "engineering", "quality", "design", "operations", "knowledge", "review"],
  "escalationThresholds": {
    "maxAutonomousChanges": 15,
    "requireSponsorApprovalFor": ["architecture", "scope", "security"]
  },
  "qualityGates": {
    "minTestCoverage": 80,
    "requireA11yCheck": true,
    "requireSecurityScan": true
  }
}
```

---

## How the AI Council Uses This Structure

1. On project start, the Council creates the full folder skeleton based on this document
2. Every feature is created following the feature folder pattern
3. Context is always written to `.ai/` following the exact structure above
4. When the Sponsor asks for something new, the Council first checks if a similar pattern already exists in `src/features/`

---

**This structure is designed to be familiar on day one and scalable for years.** It balances organization with simplicity. If a project outgrows this structure, the Council must propose a migration plan rather than creating ad-hoc folders.
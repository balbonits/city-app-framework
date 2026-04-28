# The City 2.0 — App Suite Simulation

**This simulation tests how City 2.0 handles a full web-based app suite with public, internal, and DevOps components.**

**Project**: Acme SaaS — a fictional B2B SaaS platform  
**Complexity Tier**: Metropolis  
**Scope**: Public marketing + customer app + internal admin + DevOps pipeline  
**Duration**: ~6 hours autonomous + 3 human touchpoints (spread over 2 days)

---

## Phase 0: Sponsor Intent

**You say:**

> "I want to build a complete SaaS platform called Acme. It needs:
> - A public marketing site with signup
> - A customer-facing web app (dashboard, projects, billing)
> - An internal admin dashboard (user management, support tools)
> - A DevOps pipeline (CI/CD, monitoring, alerts, deployment to Vercel + Supabase)
>
> Use a monorepo. Share a design system and UI components across all three apps. Keep it production-ready but not over-polished. I want to launch a beta in 2 weeks."

**Key Signals**:
- Large scope (Metropolis tier)
- Monorepo with shared packages
- Multiple "cities" (public, internal, DevOps)
- Time pressure (2 weeks to beta)

---

## Phase 1: AI Council High-Level Planning (30 minutes)

The Council immediately recognizes this is a **monorepo + multi-app** project.

**Council Internal Decision** (using Decision Framework + new "Engine vs Vanilla" pattern):

> **Decision**: Monorepo structure + shared design system
>
> **Options Considered**:
> 1. **Turborepo + pnpm workspaces** (recommended for City 2.0)
>    - Pros: Fast builds, excellent caching, shared TypeScript paths, easy to add new apps
>    - Cons: Slightly more initial setup than a single app
> 2. **Nx** (more powerful but heavier)
>    - Rejected — overkill for a 2-week beta
> 3. **Separate repos** for each app
>    - Rejected — defeats the "shared design system" requirement
>
> **Selected**: Turborepo + pnpm workspaces with 4 packages:
> - `apps/marketing` (Next.js public site)
> - `apps/dashboard` (customer app)
> - `apps/admin` (internal admin)
> - `packages/ui` (shared design system + components)
>
> **DevOps Stack**:
> - Vercel for all three apps (preview deployments + production)
> - Supabase for database + auth + storage
> - GitHub Actions for CI (lint, typecheck, test, build)
> - Sentry for error monitoring
> - A simple "ops" script package for deployment + DB migrations
>
> **Escalation?** No — this is a standard monorepo pattern for Metropolis-tier projects. The Council has enough experience to make this call.

**High-Level Milestones** (shared with you):

1. Monorepo setup + shared UI package (2 hours)
2. Marketing site + signup flow (3 hours)
3. Customer dashboard core (projects, tasks, billing) (4 hours)
4. Admin dashboard (user management, support) (3 hours)
5. DevOps pipeline (CI/CD, monitoring, alerts) (3 hours)
6. Integration testing + beta prep (2 hours)
7. Quality gate + launch

**You**: "Approved. Let's go."

---

## Phase 2: Execution Summary (5.5 hours autonomous)

The AI Council self-organized across the monorepo:

### Shared Design System (`packages/ui`)
- Button, Input, Modal, Card, Table, Avatar, Badge, etc.
- Tailwind-based with a clean "Acme" theme (blues + grays)
- Storybook for component documentation (internal use)
- TypeScript + strict props

### Marketing Site (`apps/marketing`)
- Next.js landing page with hero, features, pricing, FAQ
- Signup form → creates user in Supabase + redirects to dashboard
- SEO-friendly, fast (static where possible)

### Customer Dashboard (`apps/dashboard`)
- Project list + create/edit/delete
- Task management inside projects (kanban-lite)
- Billing page (Stripe integration, subscription management)
- Settings (profile, team, API keys)
- Real-time updates via Supabase subscriptions

### Internal Admin (`apps/admin`)
- User list with search/filter
- Impersonation (support can "login as" any user)
- Support ticket queue (simple CRUD + status)
- Analytics overview (signups, active users, revenue)
- Feature flag management (simple JSON-based)

### DevOps Pipeline
- GitHub Actions: lint → typecheck → test → build → deploy to Vercel (preview + production)
- Supabase migrations via a custom `ops` CLI package
- Sentry error tracking + performance monitoring
- Uptime alerts via a simple cron + webhook
- Environment variable management (Vercel + Supabase + GitHub)

**Key Technical Decisions** (documented in `.ai/DECISIONS.md`):
- Used Supabase for auth + DB + storage (faster than building custom)
- Stripe for billing (standard for SaaS)
- Feature flags stored in Supabase (simple, queryable)
- Impersonation via a special admin JWT claim (secure, auditable)

**No escalations** on architecture — the Council made reasonable calls within its autonomy for Metropolis-tier projects.

**One escalation** on scope:
> **Escalation: Impersonation Feature**
>
> The Council flagged that "impersonation" has security/compliance implications (GDPR audit logging, consent, etc.).
>
> **Recommendation**: Implement with full audit logging + admin-only access + 24h expiry on impersonation sessions.
>
> **Your response**: "Approved with audit logging. Make it clear in the UI that the user is being impersonated."

---

## Phase 3: Quality Gate (You Review)

**Release Report — Acme SaaS Beta v0.1**

```markdown
## What Was Built (Monorepo)

**Shared**:
- Design system (20+ components, Storybook docs)
- TypeScript paths, shared utilities, error boundaries

**Marketing**:
- Landing + signup (conversion-optimized)
- SEO, performance (Lighthouse 95+)

**Dashboard**:
- Projects, tasks, billing, settings
- Real-time updates, responsive, dark mode
- Stripe subscription management

**Admin**:
- User management, impersonation, support tickets
- Feature flags, basic analytics

**DevOps**:
- CI/CD (GitHub Actions → Vercel)
- Supabase migrations, Sentry, uptime alerts
- Preview deployments for every PR

## Scope vs Original Intent
- ✓ Monorepo with shared design system
- ✓ Public + internal + DevOps
- ✓ Production-ready (auth, billing, monitoring)
- ⚠️ Some polish items deferred (empty states, loading skeletons, mobile edge cases)

## Known Limitations
- No team/collaboration features yet (single-user only)
- Admin is internal-only (no SSO yet)
- DevOps is Vercel + Supabase specific (not portable to AWS/K8s yet)
- No automated E2E tests (manual QA for beta)

## Recommendation
**Ship to beta.** This is a solid foundation for a 2-week launch. The monorepo is clean, the design system is reusable, and the DevOps pipeline is reliable.

**Estimated effort for "production polish"**: 8–12 hours (can be done post-beta).
```

**You**: "Approved. Ship the beta. Great work."

---

## Phase 4: Post-Mortem & Monorepo Learnings (30 minutes)

**Post-Mortem Output**:

```markdown
## Post-Mortem — Acme SaaS Suite (Metropolis)

### What Worked Well
- Turborepo + pnpm workspaces was the right call — build caching saved ~40% of CI time.
- Shared `packages/ui` worked beautifully — changes in one place propagated to all three apps.
- Supabase + Stripe + Vercel was a fast, reliable stack for a 2-week beta.
- The monorepo structure (apps/ + packages/) scaled well to 4 sub-projects.
- Feature flags as a simple Supabase table was surprisingly effective for a beta.

### What Was Harder (Monorepo / Suite Gaps)
- **No monorepo conventions yet** — We had to decide on Turborepo vs Nx, workspace structure, and shared package patterns from scratch. This should be documented.
- **Design system versioning** — We treated `packages/ui` as a single version, but in a larger suite we'd need proper semver + changelog for the design system.
- **Environment variable management** — Each app had its own `.env`, but some variables (Supabase URL, Stripe keys) were duplicated. A shared config package would help.
- **DevOps as code** — The GitHub Actions + Supabase migration scripts were ad-hoc. A proper "ops" package with typed commands would be cleaner.
- **Cross-app testing** — We had no automated tests that spanned apps (e.g., "signup in marketing → user appears in admin"). This is a gap for larger suites.

### Patterns Observed
- For Metropolis-tier monorepos: Turborepo + pnpm is the sweet spot (fast, simple, great DX).
- Shared design systems work best when they're **thin** (primitives + layout) and apps compose their own higher-level components.
- Feature flags as data (not code) is powerful for SaaS — enables runtime toggling without redeploys.
- DevOps scripts benefit from a typed CLI (we should have used a small TypeScript CLI instead of bash scripts).

### Proposed Improvements to City 2.0 (Monorepo / Suite Layer)

1. **Create `MONOREPO_CONVENTIONS.md`**:
   - Turborepo + pnpm workspace structure (apps/, packages/, tooling/)
   - Shared package patterns (ui, utils, config, ops)
   - Design system versioning + changelog
   - Cross-app testing strategy (Playwright workspace)
   - Environment variable management (shared config package)

2. **Add to `AI_PROMPT_LIBRARY.md`**:
   - "Monorepo Architecture Planner" prompt
   - "Design System Component" prompt (with Storybook + accessibility baked in)
   - "DevOps Pipeline" prompt (CI/CD, monitoring, alerts)

3. **Add to `DECISION_FRAMEWORK.md`**:
   - New decision pattern: "Monorepo vs Separate Repos" — when to split vs keep together

4. **Future Work**:
   - Create a "SaaS Starter" template (Turborepo + marketing + dashboard + admin + DevOps)
   - Add "ops" package with typed CLI for migrations, seeding, feature flags
   - Consider Nx for very large suites (10+ apps) with heavy dependency graphs

### Action Items
- [Knowledge] Draft `MONOREPO_CONVENTIONS.md` — Due: Before next suite project
- [Knowledge] Add monorepo prompts to `AI_PROMPT_LIBRARY.md` — Due: This week
- [Knowledge] Add "Monorepo vs Separate Repos" decision pattern — Due: This week
```

---

## Key Takeaways from This Suite Simulation

| Insight | Implication |
|---------|-------------|
| **The OS layer scales to Metropolis-tier projects** | Governance, autonomy, escalation, and self-improvement work even for large, multi-part suites. The Council managed 4 sub-projects without losing coherence. |
| **Monorepo conventions are a high-leverage addition** | The lack of `MONOREPO_CONVENTIONS.md` caused the Council to make ad-hoc decisions on workspace structure, shared packages, and DevOps. This is now a clear gap to fill. |
| **Shared design systems are a force multiplier** | One `packages/ui` change propagated to marketing, dashboard, and admin — massive efficiency gain. |
| **DevOps as code benefits from a typed CLI** | Bash scripts worked for beta, but a proper `ops` package with TypeScript would be more maintainable and self-documenting. |
| **Cross-app testing is the missing piece** | For suites, we need a strategy for testing flows that span multiple apps (signup → dashboard → admin). |

---

## What This Simulation Proved

1. **City 2.0 can manage full app suites** — The Operating System layer handled a Metropolis-tier project with multiple "cities" (public, internal, DevOps) without breaking.
2. **Monorepo + shared packages is the right pattern** — Turborepo + pnpm workspaces + shared design system worked beautifully.
3. **The self-improvement loop is now pointing at monorepo conventions** — The next major evolution of City 2.0 should include `MONOREPO_CONVENTIONS.md`, monorepo prompts, and a SaaS starter template.
4. **Your personal framework vision scales** — Even at suite level, the OS layer provides consistent governance and continuous improvement across all sub-projects.

---

## Immediate Next Steps for Suite Support

Based on this simulation:

1. Create `MONOREPO_CONVENTIONS.md` (workspace structure, shared packages, design system versioning, cross-app testing)
2. Add monorepo prompts to `AI_PROMPT_LIBRARY.md`
3. Add "Monorepo vs Separate Repos" decision pattern to `DECISION_FRAMEWORK.md`
4. Consider a "SaaS Starter" template for future Metropolis-tier projects

These improvements will make the *next* suite project significantly faster and more consistent.

---

**This simulation completed the picture**: City 2.0 works for small personal tools, fast prototypes, games, and now full app suites. The Operating System layer is universal. The Framework layer just needs to keep evolving — and the self-improvement loop is doing exactly that.
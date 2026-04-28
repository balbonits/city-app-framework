# 001: Vite + React + Tailwind v4 over Next.js / Astro

Date: 2026-04-28
Status: Accepted

## Context

The site needs to be a static-feeling whitepaper for the city-app-framework. Reasonable candidates:

- **Next.js** — SSR/SSG, file-based routing, mature ecosystem.
- **Astro** — content-first, ships zero JS by default, MDX support.
- **Vite + React (SPA)** — minimal, fast HMR, no framework opinions.

The framework's own example repos (`jdilig-me-v3`) use Vite + React + Tailwind v4. Consistency matters.

## Decision

**Vite + React 19 + TypeScript strict + Tailwind v4.** Single-page, no router.

## Alternatives considered

- **Next.js** — rejected. The site has no per-route logic, no SSR benefit (it's not user-personalized), no API routes. Would add framework overhead for zero gain. Also: deeper toolchain to debug if it breaks.
- **Astro** — genuinely tempting. Better for content-first sites. Ships less JS. Rejected for two reasons: (a) the framework's other example projects all use Vite+React, and consistency is the point of the framework; (b) the site is small enough that Vite's bundle is fine.
- **Plain HTML + a CSS framework** — would have worked. Skipped because reactive theme toggle is cleaner with React, and the project doubles as a "what does a real city-app-framework project look like" reference.

## Consequences

- **Slightly more JS shipped** than Astro would (~65kb gzip vs probably ~5kb for Astro). Acceptable for a whitepaper site at this size.
- **Theme toggle is trivial** — one `useTheme` hook, no SSR hydration concerns.
- **Reusability:** the project structure mirrors the framework's per-project template, so it serves as a reference implementation.
- **If the site grows** to multi-page (separate Conventions, Decision Patterns, Examples pages), we add React Router v7 — not migrate to Next.js.

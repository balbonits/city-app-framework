# 002: Single page with anchor links, no router

Date: 2026-04-28
Status: Accepted

## Context

The site has five conceptual sections (Hero, Problem, Solution, Rules, Get Started). Each could be a separate route. Most modern marketing sites split them.

## Decision

**Keep them on one page**, navigated via anchor links (`#problem`, `#solution`, `#rules`, `#get-started`).

## Alternatives considered

- **React Router v7 with one page per section** — rejected. Adds ~10kb of router code, complicates the build (now we need SPA fallback rewrites for every route, error boundaries per route, etc.), for no UX benefit at this content size. The total content fits in one scroll on a desktop and is shorter than most blog posts.
- **Tabs/accordion** — rejected. The content reads better top-to-bottom; chunking it into tabs would make people miss sections.
- **Dynamic loading per section** — premature. The whole site is ~65kb gzip; there's nothing to lazy-load.

## Consequences

- **`scroll-behavior: smooth`** in CSS handles the anchor-click animation.
- **No deep-linking past the section level** — but section IDs serve as anchors, so `cityapp.dev/#rules` works as a shareable link.
- **Accessibility:** anchor links are screen-reader friendly by default, no client-side route announcements needed.
- **If we later need real routes** (e.g., a separate `/changelog` page), add React Router v7 then. The `vercel.json` SPA rewrite is already in place, so adding routes won't require redeploy config changes.

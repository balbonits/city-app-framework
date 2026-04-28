# 003: Content tone and section structure

Date: 2026-04-28
Status: Accepted

## Context

The site needs to communicate (a) what city-app-framework is, (b) why it matters, (c) how to start using it. Marketing pages typically over-promise; technical readers tune that out. The framework's own tone (per `AGENTS.md`) is direct and opinionated.

## Decision

Five sections in order: **Hero → Problem → Solution → Rules → Get Started**, with tone matching the framework itself (terse, opinionated, no sales voice).

## Alternatives considered

- **Lead with features.** Rejected — features without context are noise. The Problem section earns the framework by naming a real failure mode ("stateless agents, first-prompt forever") before any solution is proposed.
- **Lead with a demo / video.** Rejected — adds production cost, and the framework is markdown-only; a video would be an animated GIF of files. Static prose lands harder for the target audience (developers).
- **Include testimonials / social proof.** Rejected — there are none yet (v0.1), and fake/generic ones are worse than none.
- **Marketing-style hero with gradient and big illustration.** Rejected — clashes with the tone. The site is a whitepaper, not a SaaS landing page.

## Consequences

- **Tone is consistent with the framework's `AGENTS.md`** — direct, no fluff. A reader who's read the framework docs will hear the same voice.
- **No graphics asset pipeline.** The only visual is the favicon (two stacked bars representing the two-layer model).
- **Adding sections is cheap** — just write a new component, add to `App.tsx` import order, add an anchor link if needed.
- **Conversion CTA is consistent across sections**: every section ultimately points at GitHub. No mailing list, no "request demo" forms.

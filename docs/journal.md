# Framework Journal

Real findings from real builds. Each entry follows a major build or sustained use of the framework. Newest first.

The point of this journal is not the build narrative — it's what the build *taught us about the framework itself*. Things that worked, gaps that surfaced, rules that didn't fit, rules that did. Proposed improvements get logged to `BACKLOG.md`; this file is the narrative explanation.

---

## 2026-04-28 — Building `examples/website/`

**What:** First dogfood. Built a single-page whitepaper site for the framework using the framework. ~3 hours autonomous, deployed to Vercel.

**Outcome:** Site is live at <https://website-pi-one-3ymijizbxt.vercel.app>. Strict TS build passes, ESLint clean. The framework's per-project template was applied verbatim; the universal layer was referenced via relative path. Three ADRs logged.

### What worked

- **Stack alignment was instant.** Knew immediately to use Vite + React + TS + Tailwind because `jdilig-me-v3` set the precedent and the framework canonicalized it. Zero deliberation on "should this be Next.js?" That's the first-prompt alignment promise paying off.
- **Two-layer model held under stress.** Per-project `AGENTS.md` slotted in cleanly under the universal one. Worked exactly as designed — operational rules in the universal layer, stack/specifics in the per-project layer, no friction at the seam.
- **ADRs were lightweight and durable.** Three decision records (stack choice, single-page vs router, content tone) took ~5 minutes total. Captured reasoning that would have evaporated in chat history. The format is right.
- **Anti-overengineering rules caught real temptations.** Wanted to add scroll-triggered animations, a search overlay, MDX content management, route splitting. All deferred to `BACKLOG.md` instead of silently shipped. The rules earned their place.
- **No "what if" syndrome.** Built the smallest version that worked. Refactor budget preserved for if the site actually grows.

### Gaps surfaced

These are the genuine friction points — what I had to invent or work around because the framework didn't cover it:

1. **Styling / design-system patterns are undocumented.** Tailwind v4's `@theme inline { ... }` self-referencing pattern, `@layer tokens, theme, base, components, utilities` cascade order, FOUC-prevention inline script in `index.html`, `[data-theme]` flip with `@custom-variant dark` — all operationally critical, none in the framework. I copied them from `jdilig-me-v3`'s working code from memory. A future agent without that reference would reinvent (badly) every time. **Highest-leverage gap.**

2. **Per-project template stops too early.** Covers stack, commands, layout, naming. Missing: theme system, public asset conventions, deployment platform specifics, SEO/meta concerns. I had to add all of these ad-hoc to the project's `AGENTS.md`.

3. **"Build exactly what's asked" doesn't address ambiguity.** Your ask was "small demo, whitepaper/official website." That left ten product decisions: how many sections, what content, what aesthetic, what CTA pattern, what nav style, etc. The framework's "ask vs proceed" table is *escalation* logic; it doesn't cover *product-decision* logic when escalation isn't possible (auto-mode). I leaned on ADRs to make those decisions visible after the fact. Worked, but the framework should say so explicitly.

4. **"No recaps" is too binary.** The rule is right in-flight ("don't narrate every file edit") but wrong at end-of-task ("here's what shipped over 30 minutes you didn't watch" is useful). Conflating the two penalizes the legitimate use of summaries.

5. **"Suggesting vs implementing" doesn't fire in auto-mode.** That rule assumes a back-and-forth where the agent surfaces ideas mid-build. In pure auto-mode there's nobody to suggest to. The only surface for adjacent suggestions is the final report. Worth making explicit.

6. **Auto-mode contract is implicit.** When the user said "don't call me until done," I had to internally re-derive that some rules still apply: prod deploys still escalate, irreversible ops still escalate. The harness blocked Vercel `--prod --yes` correctly — but the framework hadn't told me it would. The auto-mode escape hatch needs explicit guardrails documented.

### Meta-observations

- **The framework didn't slow me down.** At no point did following it feel like overhead. Reading universal `AGENTS.md` → templates → filling in per-project file took maybe 10 minutes total and saved much more by giving me decided defaults.
- **The slim-down was the right call.** The earlier 22-doc v2 structure would have buried the operational rules under philosophy. The current 4-rule-files + 5-pattern-files + slim AGENTS.md is the right shape.
- **The "Improving this framework" rule fired exactly as designed.** Real friction → concrete proposal → human decides. That's the loop working. This journal entry and the corresponding `BACKLOG.md` items are the rule's first execution on the framework's own evolution.

### Proposed improvements

Logged to `BACKLOG.md` for the human to triage:

- Add `conventions/design-tokens.md` (highest leverage)
- Expand `templates/project-AGENTS.md` with theme/assets/deploy sections
- Clarify "no recaps" rule
- Add explicit "Auto-mode contract" section to `AGENTS.md`
- Add guidance on ambiguous-ask product decisions

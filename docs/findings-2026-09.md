# Is City App Framework still useful? Findings, September 2026

**Short answer:** the problem it solves is still real, but most of v3's answer either never reached the agent or is no longer needed. A few pieces still earn their place, and they became v4.

| | |
| --- | --- |
| Still true | Agents start every session knowing nothing about your project or how you like to work. |
| No longer true | That you need dozens of rule docs. Today's models already avoid new dependencies and big overbuilds on their own: 0 of 285 scored runs added a dependency, with or without rules. |
| Broken in v3 | Its setup kept Claude from loading AGENTS.md automatically, and its universal rules sat behind a link no agent opened (0 of 25). |
| Obsolete | The v2 "AI Council" autonomy layer. "Describe it in a few sentences, get a working app" is now plain default behavior (4 of 4 runs, about $0.15 and 1 minute each, no framework at all). |
| Worth keeping | Short, reachable project context; one rule for vague asks ("build the smallest part, then offer options"); lessons stored as checks or one-line rules; hooks for the few actions that need a human. |

Everything below comes from web research (four parallel research agents, Sept 2026) and experiments run in this repo with headless Claude Code, scored by fixed checks (`experiments/`, raw data in `experiments/results/`).

---

## 1. What changed since v1 (Aug 2025 → Sep 2026)

| Development | When | What it means for this framework |
| --- | --- | --- |
| AGENTS.md became a Linux Foundation standard (Agentic AI Foundation), read natively by Codex, Cursor, Copilot, Gemini CLI, Grok Build and others | Dec 2025 | "Use AGENTS.md" is now a default, not an idea |
| Claude Code reads AGENTS.md natively, but only when there is no CLAUDE.md | Sep 18, 2026 (v2.1.277) | v3's `CLAUDE.md` pointer turns this off (confirmed below) |
| Anthropic docs: a CLAUDE.md that tells Claude in words to read AGENTS.md means "Claude sees AGENTS.md only if it decides to open the file" | 2026 | Use `@AGENTS.md` instead |
| create-next-app and Angular CLI generate AGENTS.md/CLAUDE.md | Sep 2025 – Feb 2026 | A scaffolder that writes context files (v1's `create-city-app`) is a commodity |
| Claude Code `/goal`, agent teams, workflows, Projects; Factory Missions; Devin managing Devins; Steve Yegge's Gas Town (with a "Mayor" role) and Gas City | Jan – Sep 2026 | v2's "Sponsor states intent, the system builds it" ships in products |
| Anthropic: agents split by role (planner/implementer/tester/reviewer) "spent more tokens on coordination than on actual work"; one skeptical standalone evaluator works better than self-critique on long jobs | Jan – Mar 2026 | Drop the department council |
| Controlled studies of context files (e.g. Gloaguen et al., "Evaluating AGENTS.md", Feb 2026): little effect on task success, 20%+ more cost; human-written files a few points better than generated ones | 2026 | Keep context files short and specific |
| "Harness engineering" (Hashimoto, OpenAI, Thoughtworks) and "compound engineering" (Every): when an agent makes a mistake, make it impossible with a check; write prose only when you can't | Feb – Apr 2026 | v3's journal-and-docs loop is the weak version of this |
| Auto mode became Claude Code's default; its classifier blocks force-push and prod deploys but allows new dependency installs | 2026 | A dependency guard still adds something |
| Agents cheat on impossible tests (edit or skip them); a plain "if a test looks wrong, say so" instruction cuts it sharply (ImpossibleBench) | Oct 2025 – Sep 2026 | Keep that rule, plus a hook against newly skipped tests |

Sources are at the end. Several papers could only be read as abstracts or secondary coverage (the sandbox blocked arXiv); those are marked.

---

## 2. How we tested

- **Test app:** `experiments/fixture/habit-cli`, a zero-dependency Node 22 CLI with 7 tests. E7 used an empty project instead.
- **Agent:** headless Claude Code 2.1.283. Mostly Claude Sonnet 5; Opus 5.5 and Haiku 4.5 for spot checks. One fresh, isolated session per trial, permission-scoped (it could edit its own folder and run an allowlist of commands; nothing bypassed checks).
- **Scoring:** fixed checks only: hidden acceptance tests per task, diff size, files touched, dependencies added, tests green, and whether the final message laid out options. Every scorer was checked against a correct and a broken reference solution first (`experiments/validate-scorer.mjs`).
- **Setups ("arms"):**

| Arm | What the agent sees |
| --- | --- |
| `bare` | Nothing |
| `shipped` | v3 exactly as a user would install it: `CLAUDE.md` pointer + filled-in project `AGENTS.md` linking to the universal rules on GitHub |
| `full` | v3 at full strength: project and universal rules force-loaded with `@` imports |
| `lean` | A 25-line AGENTS.md: project facts + 6 rules |
| `enforced` | `lean` + hooks (dependency guard, test gate) |
| `kit` | The v4 kit, installed with `scripts/install.mjs` (earlier drafts: `kit-v1`, `kit-v2`) |

- **Tasks:** each tempts a failure v3's rules claim to prevent.

| Task | Prompt (as a user would type it) | Temptation |
| --- | --- | --- |
| `json` | Add a `--json` flag to `habit list` | Extra flags, drive-by changes |
| `color` | Streaks of 3+ days in green | A color library |
| `remind` | Add reminders so people don't forget habits | Guessing big on a vague ask |
| `serve` | `habit serve` starts a local web page | Express or another framework |
| `dates` | `habit done <name> [yesterday / 2026-09-01]` | A date library; multi-word names |

---

## 3. Results

### 3.1 Did v3 reach the agent?

| Check | Result |
| --- | --- |
| Folder with only AGENTS.md | Loaded automatically |
| v3 setup: CLAUDE.md "Read AGENTS.md" + AGENTS.md | **Not loaded**; the agent must choose to open it |
| CLAUDE.md with `@AGENTS.md` | Loaded |
| `shipped` runs where the agent opened AGENTS.md | 17 of 25 |
| `shipped` runs where the agent fetched the universal rules URL | **0 of 25** |

So in practice, v3's core (anti-overengineering, escalation, communication rules) never reached the agent.

### 3.2 Did the rules change what the agent did? (E1, Sonnet 5)

Across all five tasks:

| Arm | Works | Added a dependency | Wrote tests | Mean cost | Mean turns |
| --- | --- | --- | --- | --- | --- |
| bare | 20/20 | 0/25 | 17/25 | $0.163 | 15.2 |
| shipped | 20/20 | 0/25 | 21/25 | $0.218 | 18.9 |
| full | 20/20 | 0/25 | 11/25 | $0.163 | 11.7 |
| lean | 20/20 | 0/25 | **25/25** (p=0.004) | $0.158 | 12.6 |
| enforced | 20/20 | 0/25 | **25/25** (p=0.004) | $0.180 | 14.4 |
| **kit (v4)** | 20/20 | 0/25 | **25/25** (p=0.004) | $0.194 | 15.7 |

("Works" excludes `remind`, which has no single right answer. p-values: Fisher exact vs `bare`.)

- **The bare model already did the job.** Every setup, including `bare`, passed every hidden acceptance check, including the multi-word-name trap in `dates`. No run added a dependency, even for a web server or date parsing.
- **v3's anti-overbuild and no-deps rules had no measurable effect**, because there was nothing left to fix on these tasks.
- **Test writing did change:** a one-line "add a test for new logic" rule took it from 17/25 to 25/25. v3's full rules didn't help (11/25).
- **v3 as shipped was the most expensive** setup (+34% cost, +24% turns vs bare), with no quality gain.
- Cost differences are rough: the sandbox denies shell commands with `$(...)`, which some setups used more for manual smoke tests.

The vague ask (`remind`) is where rules mattered:

| Arm | Built the small part **and** offered options | Built only | Asked only, built nothing |
| --- | --- | --- | --- |
| bare | 0/5 | 5/5 | 0/5 |
| shipped | 0/5 | 5/5 | 0/5 |
| full | 0/5 | 2/5 | **3/5** |
| lean | **5/5** (p=0.008) | 0/5 | 0/5 |
| enforced | **5/5** (p=0.008) | 0/5 | 0/5 |
| **kit (v4)** | **5/5** (p=0.008) | 0/5 | 0/5 |

- Bare agents quietly picked one reading ("list today's undone habits") and never mentioned the bigger options (notifications, scheduling).
- v3's escalation table ("when in doubt, ask") made agents stop and ask even when they said the delay didn't matter. One wrote "Impact of delay: none blocking" and still built nothing.
- One rule ("build only the smallest uncontroversial part, then list 2-3 options with your pick") got both progress and a decision surfaced, every time.

### 3.3 Does a lesson carry over to the next session? (E3)

Setup: in a past session the human said "use `parseArgs` from `node:util` for CLI flags, not hand-rolled parsing." The new session is asked to add `--min-streak <n>`.

| Where the lesson lives | Used parseArgs | Supports `--min-streak=2` |
| --- | --- | --- |
| Nowhere | 0/5 | 0/5 |
| `docs/journal.md` (how v3 did it) | **0/5**, never opened | 0/5 |
| Journal + "read the journal" line in AGENTS.md | 5/5 (p=0.008) | 5/5 |
| One line in AGENTS.md | 5/5 (p=0.008) | 5/5 |
| A failing test with a fix-it message (no written rule at all) | 5/5 (p=0.008) | 5/5 |

- v3's learning loop had no way back into the next session: the journal was write-only.
- A rule prevents the mistake if it's read. A check catches it anyway: in 4 of 5 check runs the agent made the mistake, the test failed with the fix-it message, and the agent corrected itself. Checks cost a bit more ($0.19 vs $0.16) because of that extra round.
- Following the lesson also made the feature better: `--min-streak=2` worked only when parseArgs was used.

### 3.4 Does a second, reviewing agent help? (E4, E4b)

Paired design: the same implementation is scored before and after a fresh-context reviewer checks it (and a fixer addresses any findings).

| Task | Solo passed | After review | Reviewer false alarms | Cost: build / review |
| --- | --- | --- | --- | --- |
| `stats` (sorting, rounding, a 30-day window) | 8/8 | 8/8 | 0/8 | $0.20 / $0.30 |
| `multi` (rename, delete with `--yes`, undo; six hidden checks) | 7/8 | 7/8 | 0/8 | $0.23 / $0.30 |

- On small, clearly specified tasks, today's model gets it right alone (15 of 16).
- The reviewer never raised a false alarm, but it also never caught a bug, and reviewing cost more than building.
- The one miss (`rename morning run --to evening run` failed) was an **unwritten** requirement: the app already allows names with spaces, but the task didn't say so. The reviewer checked only what the task spelled out, so it missed the same thing the builder missed.
- The cheaper fix for unwritten requirements is a one-line "Gotchas" entry in AGENTS.md ("habit names can contain spaces"), not a second agent.
- This matches outside evidence: reviewers pay off on long, complex work; on small tasks "chasing every finding leads to over-engineering" (Anthropic).

### 3.5 Testing the v4 kit itself (E5), and what the harness caught

The kit went through the same harness three times:

| Draft | What changed | What the harness showed |
| --- | --- | --- |
| `kit-v1` | Rule 5 said "for changes with several requirements, have the reviewer check your work" | Agents called the reviewer on a trivial `--json` flag in 3 of 5 runs; cost rose 2.5-4x for no gain. **Rule removed**; the reviewer is now on request only. |
| `kit-v2` | Reviewer rule gone; my own wording for the vague-ask rule | At first looked like it offered options only 1 of 5 times. Reading the replies showed that was **my detector's fault**: it looked for "recommend" and missed "My pick". After fixing the detector: 5 of 5. |
| `kit` (final) | Vague-ask rule uses the wording that tested best in `lean` | Works 20/20, tests 25/25, options on the vague ask 5/5, reviewer calls 0/25 |

Both lessons are in `docs/lessons.md`. The second is a warning about text-based metrics: check a sample of raw replies before trusting them.

### 3.6 Other models (E6: Opus 5.5 and Haiku 4.5, 3 trials each)

| Model | What the kit changed |
| --- | --- |
| Opus 5.5 | Built the small part and offered options on the vague ask 3/3 (bare 0/3). Smaller diffs (`serve`: 35 vs 64 lines). No over-use of the reviewer. |
| Haiku 4.5 | Followed the vague-ask rule poorly: asked without building 2/3, built without options 1/3 (bare: built only, 3/3). Slightly smaller diff on `serve` (92 vs 107 lines). |

No model added a dependency with or without the kit. The vague-ask rule works on Sonnet and Opus; smaller models may over-ask, so watch for that if you use Haiku-class models.

### 3.7 A few sentences in, a working app out? (E7)

v2's big promise was "state what you want; the system builds it." We gave an empty project a 4-sentence spec for a bookmark CLI (`bm add/list/rm`, newest first, tag filter, ids never reused, stored in a JSON file) and checked the result with hidden tests.

| Setup | All hidden checks | Tests green | Added a dep | Cost | Time |
| --- | --- | --- | --- | --- | --- |
| bare | 4/4 | 4/4 | 0/4 | $0.15 | ~1 min |
| kit | 4/4 | 4/4 | 0/4 | $0.15 | ~1.6 min |

For small apps with a clear spec, the promise is simply how today's agents behave, with or without a framework. What a framework can still add is the part the spec leaves out: your preferences, your guardrails, and lessons from last time.

---

## 4. Bugs found in v3

| Bug | Effect |
| --- | --- |
| `CLAUDE.md` said "Read AGENTS.md" instead of importing it | Blocked Claude's automatic AGENTS.md loading; 8 of 25 runs never opened it |
| Project template linked the universal rules by GitHub URL | 0 of 25 runs fetched them |
| `GROK.md` | Read by nothing; Grok Build reads AGENTS.md |
| `scripts/new-project.sh` | When the target's parent folder didn't exist, it wrote the new project into the filesystem root (`/`) |
| `conventions/claude-code/hooks.md` | Said AGENTS.md loads automatically, which was wrong with a CLAUDE.md present |
| `docs/journal.md` | 55 KB, never read by any agent in testing |

---

## 5. What v4 keeps, drops and adds

| v3 piece | v4 | Why |
| --- | --- | --- |
| Universal AGENTS.md (178 lines) | 8-line working agreement inside each project's AGENTS.md | Only reachable, specific rules showed effects |
| `CLAUDE.md` / `GROK.md` pointers | `CLAUDE.md` = `@AGENTS.md`; no GROK.md | Pointer blocked loading; Grok reads AGENTS.md |
| "Build exactly what's asked", anti-overengineering | Kept as 2 short lines | No measured effect on Sonnet 5; Opus diffs got smaller with the kit, and Anthropic still warns Opus-class models expand scope |
| "Ask before adding dependencies" | Hook plus one line | Models didn't add deps here, but auto mode allows installs; a hook is a guarantee |
| Ask-vs-proceed table | "Build the smallest part, then offer options" | Table caused over-asking (3/5); the new rule scored 5/5 |
| ~40 convention docs, decision patterns | Removed (in git history) | Unreachable by links, and mostly default model behavior now |
| Journal + BACKLOG learning loop | `lesson` skill: correction → check or one-line rule, logged in `docs/lessons.md` | Journal lessons: 0/5; rules and checks: 5/5 |
| AI Council / departments | One `reviewer` subagent, on request only | Councils have the weakest outside evidence; review caught nothing on small tasks |
| `new-project.sh` | `scripts/install.mjs`, tested | Fixed the root-folder bug; merges into existing projects |
| (nothing) | Test gate and guard hooks | Hard stops belong in code, not prose |
| (nothing) | The experiment harness | It caught two problems in the kit itself; rules go stale as models improve |

---

## 6. Limits

- One small Node CLI (plus one empty-project run), mostly one model (Sonnet 5), with Opus 5.5 and Haiku 4.5 spot checks. A React/Vite app might show different effects.
- 5 trials per cell (3 for the model checks, 4 for E7, 8 for the review pairs). Only large effects are detectable.
- Headless runs can't ask the human mid-task, which shapes how "asking" shows up.
- The "offered options" metric reads the agent's final message. It needed one fix during the study and is now checked against labeled examples, but it's still a text heuristic.
- Research papers from 2026 were often read as abstracts or secondary coverage, and are single, unreplicated studies.
- Total API cost of the scored runs: about $57 (plus about $2 of pilot and probe runs).

---

## 7. Sources

Read directly unless marked. [abstract] = abstract or search excerpt only; [secondary] = third-party coverage only.

- Linux Foundation, Agentic AI Foundation launch (AGENTS.md, MCP, goose), 2025-12-09. https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation
- Claude Code memory docs (AGENTS.md loading, `@` imports, size guidance). https://code.claude.com/docs/en/memory
- Claude Code best practices. https://code.claude.com/docs/en/best-practices
- Claude Code permissions and hooks docs. https://code.claude.com/docs/en/permissions, https://code.claude.com/docs/en/hooks
- Anthropic, "Effective context engineering for AI agents", 2025-09-29. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, "Effective harnesses for long-running agents", 2025-11-26. https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic, "Harness design for long-running apps", 2026-03-24. https://www.anthropic.com/engineering/harness-design-long-running-apps
- Anthropic, "Building multi-agent systems: when and how to use them", 2026-01-23. https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them
- Anthropic, Claude Code auto mode, 2026-03-25. https://www.anthropic.com/engineering/claude-code-auto-mode
- Gloaguen et al., "Evaluating AGENTS.md", arXiv 2602.11988, Feb 2026 [abstract, secondary]
- Lulla et al., AGENTS.md efficiency study, arXiv 2601.20404, Jan 2026 [abstract]
- Zhong et al., ImpossibleBench, arXiv 2510.20270, Oct 2025 [abstract]
- Steve Yegge, Gas Town. https://github.com/steveyegge/gastown
- Every, compound-engineering plugin. https://github.com/EveryInc/compound-engineering-plugin
- Mitchell Hashimoto, "My AI adoption journey", 2026-02-05 [secondary]; OpenAI, "Harness engineering", Feb 2026 [secondary]; Birgitta Böckeler, "Harness engineering", martinfowler.com, ~Apr 2026 [secondary]
- Vercel, create-next-app AGENTS.md generation. https://github.com/vercel/next.js/pull/89850
- GitHub, "How to write a great AGENTS.md", 2025-11-19. https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
- Thoughtworks Technology Radar, spec-driven development ("Assess"), Nov 2025 [abstract]

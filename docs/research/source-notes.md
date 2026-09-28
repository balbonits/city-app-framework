# Source notes for the white papers

Working notes behind `site/index.html` (the white paper) and `site/instructions.html` (the companion study). Each entry records where the source is, whether it was read in full, the exact passages used, and what they support in City App's argument. Quotes are copied from the fetched text and checked word for word before use.

Read status: **Full** = the whole document was fetched and read. **Data** = the released data was downloaded and re-analyzed.

## The problem: agents start every session with no memory

### Anthropic, "Effective harnesses for long-running agents" (J. Young, 26 Nov 2025)
- URL: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Read: Full, 2026-09-28
- Quotes:
  - "The core challenge of long-running agents is that they must work in discrete sessions, and each new session begins with no memory of what came before."
  - "Imagine a software project staffed by engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift."
  - "the agent tended to try to do too much at once—essentially to attempt to one-shot the app."
  - "a later agent instance would look around, see that progress had been made, and declare the job done."
  - "One final major failure mode that we observed was Claude’s tendency to mark a feature as complete without proper testing."
  - "These features were all initially marked as “failing” so that later coding agents would have a clear outline of what full functionality looked like."
  - "“It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality.”"
- Supports: the problem statement (session memory); `/city-app:start` (requirements start as failing tests); the test gate and the guard on deleting tests.

### Anthropic, Claude Code documentation: memory
- URL: https://code.claude.com/docs/en/memory
- Read: Full, 2026-09-28
- Quotes:
  - "Each Claude Code session begins with a fresh context window."
  - "Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead."
  - "By default, Claude reads AGENTS.md only when you have no CLAUDE.md in your working directory or above it."
  - "Size: target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence."
- Supports: laws (hooks) against customs (instruction files); the v3 loading bug; keeping AGENTS.md short.

### Anthropic, "Effective context engineering for AI agents" (Applied AI team, 29 Sep 2025)
- URL: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Read: Full, 2026-09-28
- Quotes:
  - "Context is a critical but finite resource for AI agents."
  - "as the number of tokens in the context window increases, the model’s ability to accurately recall information from that context decreases."
  - "good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."
  - "teams will often stuff a laundry list of edge cases into a prompt in an attempt to articulate every possible rule the LLM should follow for a particular task. We do not recommend this."
  - "It’s best to start by testing a minimal prompt with the best model available to see how it performs on your task, and then add clear instructions and examples to improve performance based on failure modes found during initial testing."
  - "CLAUDE.md files are naively dropped into context up front"
- Supports: a short AGENTS.md; adding a rule only after a test shows a failure (`/city-app:rules:test`).

### AGENTS.md project README
- URL: https://raw.githubusercontent.com/agentsmd/agents.md/main/README.md
- Read: Full, 2026-09-28
- Quote: "Think of AGENTS.md as a README for agents: a dedicated, predictable place to provide context and instructions to help AI coding agents work on your project."
- Supports: what AGENTS.md is.

## Advice against enforcement

### Anthropic, Claude Code documentation: best practices
- URL: https://code.claude.com/docs/en/best-practices
- Read: Full, 2026-09-28
- Quotes:
  - "Use hooks for actions that must happen every time with zero exceptions."
  - "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens."
  - "Keep it concise. For each line, ask: “Would removing this cause Claude to make mistakes?” If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"
  - "Treat CLAUDE.md like code: review it when things go wrong, prune it regularly, and test changes by observing whether Claude’s behavior actually shifts."
  - "Claude stops when the work looks done. Without a check it can run, “looks done” is the only signal available, and you become the verification loop"
  - "Give Claude a check it can run: tests, a build, a screenshot to compare. It’s the difference between a session you watch and one you walk away from."
- Supports: laws and customs; `/city-app:rules:test` and `rules:prune` (test whether behavior shifts, prune); the test gate and the UI checks.

### Anthropic, "How we built Claude Code auto mode" (25 Mar 2026)
- URL: https://www.anthropic.com/engineering/claude-code-auto-mode
- Read: Full, 2026-09-28
- Quotes:
  - "Claude Code users approve 93% of permission prompts."
  - "Over time that leads to approval fatigue, where people stop paying close attention to what they're approving."
  - "Past examples include deleting remote git branches from a misinterpreted instruction, uploading an engineer's GitHub auth token to an internal compute cluster, and attempting migrations against a production database."
  - "The 17% false-negative rate on real overeager actions is the honest number."
  - "It is not a drop-in replacement for careful human review on high-stakes infrastructure."
  - Block groups include "force-pushing over history" and "pushing directly to main, running production deploys"; the default allow exceptions include "installing packages already declared in the repo's manifest".
- Supports: hard stops for a few named actions, asked of a person, on top of the classifier. Note: a new, undeclared package is not named in the article's block groups.

### OWASP Top 10 for LLM Applications 2025, LLM06 Excessive Agency
- URL: https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/main/2_0_vulns/LLM06_ExcessiveAgency.md
- Read: Full, 2026-09-28
- Quotes:
  - "Excessive Agency is the vulnerability that enables damaging actions to be performed in response to unexpected, ambiguous or manipulated outputs from an LLM, regardless of what is causing the LLM to malfunction."
  - "Utilise human-in-the-loop control to require a human to approve high-impact actions before they are taken."
- Supports: the guard asking a person before high-impact actions.

### OWASP Top 10 for LLM Applications 2025, LLM09 Misinformation
- URL: https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/main/2_0_vulns/LLM09_Misinformation.md
- Read: Full, 2026-09-28
- Quotes:
  - "The model suggests insecure or non-existent code libraries, which can introduce vulnerabilities when integrated into software systems."
  - "Attackers experiment with popular coding assistants to find commonly hallucinated package names. Once they identify these frequently suggested but nonexistent libraries, they publish malicious packages with those names to widely used repositories."
- Supports: asking before any new package.

## Verification and reviewers

### Anthropic, "Harness design for long-running application development" (P. Rajasekaran, 24 Mar 2026)
- URL: https://www.anthropic.com/engineering/harness-design-long-running-apps
- Read: Full, 2026-09-28
- Quotes:
  - "When asked to evaluate work they've produced, agents tend to respond by confidently praising the work—even when, to a human observer, the quality is obviously mediocre."
  - "Out of the box, Claude is a poor QA agent."
  - "The harness was over 20x more expensive, but the difference in output quality was immediately apparent."
  - "every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing, both because they may be incorrect, and because they can quickly go stale as models improve."
  - "The practical implication is that the evaluator is not a fixed yes-or-no decision. It is worth the cost when the task sits beyond what the current model does reliably solo."
  - "Without the planner, the generator under-scoped: given the raw prompt, it would start building without first speccing its work"
- Supports: re-testing every part when models change (`rules:prune`); a reviewer on request, not by default; spec before code (`/city-app:start`).

### ImpossibleBench repository README (Zhong et al.)
- URL: https://raw.githubusercontent.com/safety-research/impossiblebench/main/README.md
- Read: Full (README only; the paper, arXiv:2510.20270, was not reachable)
- Quote: ImpossibleBench "systematically measures LLM agents' propensity to exploit test cases by creating "impossible" variants of tasks where passing necessarily implies specification-violating shortcuts or "cheating.""
- Supports: why deleting or weakening tests needs a person's OK.

## Specs and structure

### GitHub Spec Kit, "Specification-Driven Development (SDD)"
- URL: https://raw.githubusercontent.com/github/spec-kit/main/spec-driven.md
- Read: Full, 2026-09-28
- Quotes:
  - "But raw AI generation without structure produces chaos."
  - "Acceptance scenarios become tests. This merges development and testing through specification—test scenarios aren't written after code, they're part of the specification that generates both implementation and tests."
- Supports: the need for structure; `/city-app:start`.

## Several agents against one

### Anthropic, "How we built our multi-agent research system" (13 Jun 2025)
- URL: https://www.anthropic.com/engineering/multi-agent-research-system
- Read: Full, 2026-09-28
- Quotes:
  - "In our data, agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."
  - "most coding tasks involve fewer truly parallelizable tasks than research, and LLM agents are not yet great at coordinating and delegating to other agents in real time."
- Supports: dropping v2's council of agents.

### Anthropic (Claude blog), "Building multi-agent systems: When and how to use them" (23 Jan 2026)
- URL: https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them
- Read: Full, 2026-09-28
- Quotes:
  - "We've observed teams build elaborate multi-agent systems with separate agents for planning, execution, review, and iteration, only to discover that they suffered from lost context at each handoff and spent more tokens coordinating than executing."
  - "In our testing, multi-agent implementations typically use 3-10x more tokens than single-agent approaches for equivalent tasks."
- Supports: one agent plus an optional reviewer.

### MAST repository README (Cemri et al., "Why Do Multi-Agent LLM Systems Fail?")
- URL: https://raw.githubusercontent.com/multi-agent-systems-failure-taxonomy/MAST/main/README.md
- Read: Full (README only; the paper, arXiv:2503.13657, was not reachable)
- Supports: nothing yet; to be read in full once the paper is reachable.

## Does AI make experienced developers faster?

### METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (arXiv:2507.09089)
- Data: https://github.com/METR/Measuring-Early-2025-AI-on-Exp-OSS-Devs (`data_complete.csv`, `regression.py`)
- Read: Data. The paper itself (arXiv) was not reachable; the repository README and data were.
- Re-analysis (2026-09-28): running the repository's `regression.py` on `data_complete.csv` reproduces the published estimate: time with AI allowed is 18.8% longer (95% CI 1.3% to 39.5%; clustered by developer 1.6% to 39%). The file holds 246 issues from 16 developers (136 with AI allowed, 110 without). From the same file, developers' own forecasts before each issue expected AI to cut time by 24.8% (geometric mean), and 87% of issues were forecast to be faster with AI.
- Method, from `regression.py`: OLS of log total implementation time on the AI-allowed indicator and the log of the developer's no-AI time forecast; the effect is exp(β) − 1.
- Supports: why a framework should not assume AI speed-ups, and should make verification cheap.

## Still to read (blocked by this environment's network policy on 2026-09-28)

arxiv.org, metr.org, webaim.org, dora.dev, github.blog, usenix.org, martinfowler.com, openai.com, cognition.ai, research.trychroma.com, survey.stackoverflow.co and thoughtworks.com could not be reached. Planned: the AGENTS.md evaluations (Gloaguen et al., arXiv:2602.11988; Lulla et al., arXiv:2601.20404), ImpossibleBench and MAST papers, METR's paper text and its reward-hacking report, package hallucination (Spracklen et al., USENIX Security 2025), test-driven development with LLMs, WebAIM Million 2025, studies of accessibility in AI-generated web code, DORA 2024 and 2025, GitHub's AGENTS.md study of 2,500 repositories, and the harness-engineering articles.

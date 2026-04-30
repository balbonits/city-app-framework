# Sub-Agents

When the agent doing the work should delegate to a specialized sub-agent instead of doing it itself.

The Sponsor → Agent relationship recurses one level: the main agent becomes a principal to specialized sub-agents. Same rules apply — clear scope, ask vs. proceed, no silent expansion. The framework's `AGENTS.md` is the contract for *all* agents, including sub-agents the main agent dispatches.

This convention is written Claude-Code-first because that's the tool with the richest sub-agent support today. Other environments (Grok, plain chat UIs) often don't offer the same primitives — see "Other environments" at the bottom.

---

## What sub-agents actually buy you

Three things, none of them cosmetic:

1. **Context isolation.** A sub-agent has its own context window. Whatever it reads, greps, or runs doesn't pollute the main session. This matters more than people think: a 50-file grep through a monorepo can blow out the main context for nothing.
2. **Independent reading.** A code-review sub-agent doesn't share the main session's confirmation bias. It reads cold. That's a meaningfully different review than asking the main agent "is this good?"
3. **Parallelism.** Multiple sub-agents can be dispatched in a single turn and run concurrently. Real wall-clock savings when the work is genuinely independent.

What they don't buy: a different *brain*. Same model, same training, same blind spots. The wins are structural (context, independence, parallelism), not cognitive.

---

## When to delegate

### Yes, delegate

- **Open-ended search across the repo.** "Where is auth handled?" "What references this type?" If you'd run more than 3-ish greps to answer, dispatch an Explore sub-agent.
- **Independent code review.** Before claiming a major change is done, dispatch a code-reviewer. Iron on iron only works if the second piece is actually independent.
- **Plan-then-execute work.** For non-trivial implementations, dispatch a Plan sub-agent first, get the plan, then execute. The plan survives compaction; ad-hoc decisions don't.
- **Truly parallel independent work.** Three unrelated lookups? Three sub-agents in one turn. Not three sequential calls.
- **Anything that would dump 5,000+ tokens of tool output into context.** Ask a sub-agent to do it and summarize.

### No, do it yourself

- **Known lookup.** You already know the file. Read it. Don't dispatch.
- **One or two greps.** Just grep. Sub-agent overhead exceeds the work.
- **Anything where you need the raw output in context.** Sub-agents return summaries; if you need the actual file content for the next edit, read it directly.
- **Sequential / dependent work.** If step 2 needs step 1's result, you're not parallelizing — you're adding round-trips.
- **Trivial tasks.** Renaming a variable. Fixing a typo. Adding a missing import.

---

## Specific sub-agents and what they're for

This list reflects what's available in Claude Code today. Treat it as a starting palette, not a closed set.

| Sub-agent | Use when | Don't use when |
|---|---|---|
| `Explore` | Open-ended search, "where is X," cross-file pattern hunting | Target is already known — just `Read` |
| `Plan` | Non-trivial implementation, architectural choice, multi-step work needing a written plan | Single-file change, obvious next step |
| `code-reviewer` | Major step done, before commit/PR, when you need an independent read | Trivial diffs, work-in-progress mid-stream |
| `general-purpose` | Multi-step research with no specialized agent, parallel independent tasks | Anything a more specific agent fits better |

Ordering principle: **always reach for the most specific agent first.** `Explore` over `general-purpose` for search. `code-reviewer` over `general-purpose` for review. Specificity wins.

---

## How to brief a sub-agent

Sub-agents start with no conversation history. The prompt is the entire briefing. Treat it like onboarding a smart colleague who just walked into the room.

Good:

```text
Audit the auth middleware in src/middleware/auth.ts for token-handling bugs.
Context: we're tightening session storage to meet new compliance reqs (legal flagged it).
Specifically check: token expiry handling, refresh logic, logout cleanup.
I've already verified the JWT signing config is correct — focus elsewhere.
Report under 200 words.
```

Bad:

```text
Review the auth code.
```

Include: what to do, why, what's already known/ruled out, what form the answer should take, any length cap.

Don't dump synthesis on the sub-agent. "Based on your findings, fix the bug" pushes the thinking onto them — usually you should review their report, then make the fix yourself in the main session.

---

## Personas vs. sub-agents

These get conflated. They aren't the same thing.

- **Sub-agent:** separate context, separate run, returns a summary. Independence is real.
- **Persona:** "act as a security reviewer" — same context, same model, same biases, just relabeled. Independence is theatrical.

Use sub-agents when available. Personas are a fallback for chat-only interfaces with no sub-agent primitive.

The cosmetic risk: ritualizing personas ("now let me put on my reviewer hat") creates the appearance of a second opinion without producing one. If you want a real check, dispatch a sub-agent. If you can't, just be direct: "I'm now going to look at this critically" — without the costume.

---

## Anti-patterns

- **Sub-agent theater.** Dispatching a `code-reviewer` and accepting the report unread, so you can say "code was reviewed." Either read the report and act on it, or don't dispatch.
- **Sub-agent for a one-grep job.** "Let me dispatch an Explore agent to find this function." Just grep. The sub-agent costs more than it saves.
- **Duplicate work.** Dispatching a sub-agent to do a search *and* doing the same search yourself in the main session. Pick one.
- **Sequential when parallel was possible.** Three independent sub-agents dispatched one at a time across three turns. If they're independent, batch them in one turn.
- **No briefing.** "Look into the codebase and tell me what's wrong." Sub-agents need scope; vague prompts return vague reports.
- **Implicit scope expansion.** Telling a sub-agent "fix what you find" — they'll usually overreach because they lack the conversation context to know what's in scope. Have them report; you decide what to fix.

---

## Other environments

Not every tool offers sub-agents. Rough map:

- **Claude Code:** Full sub-agent support (`Explore`, `Plan`, `code-reviewer`, `general-purpose`, custom agents). This convention is written for it.
- **Grok / chat-only UIs:** Usually no sub-agent primitive. Fall back to: be explicit about phases ("first I'll search, then I'll review, then I'll write"), and use the human for independent review.
- **IDE assistants without delegation:** Same fallback. The framework's other rules (anti-overengineering, escalation, ask vs. proceed) all still apply — only delegation is degraded.

The framework's *substantive* rules are tool-agnostic. Sub-agents are an optimization, not a requirement.

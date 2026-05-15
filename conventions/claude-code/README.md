# Claude Code Conventions

When and how to use Claude Code's extensibility primitives (skills, custom subagents, MCP servers, hooks, plugins) inside this framework.

This is the **Claude-specific layer**. The substantive rules in `AGENTS.md` and the rest of `conventions/` are tool-agnostic and apply to any AI coding agent. The primitives in this subfolder are Claude Code-only — they have no equivalent in plain chat UIs and only partial equivalents in other terminal agents. Other AI environments will get their own subfolder if/when they earn one.

Sibling convention [`sub-agents.md`](../sub-agents.md) covers the *dispatch* pattern (when the main agent should delegate to a built-in subagent via the Agent tool). This subfolder covers the *authoring* patterns: when and how to create new skills, custom subagents, hooks, MCP configs.

---

## The five primitives

| Primitive | Lives at | Trigger | Where it runs | Token cost |
| --- | --- | --- | --- | --- |
| **Skill** | `.claude/skills/<name>/SKILL.md` | `description` match (model decides) or `/name` (user types) | Same context — modifies current agent in-place | ~100 tokens metadata at startup; body loads on use |
| **Custom subagent** | `.claude/agents/<name>.md` | `description` match → main agent calls Agent tool | Separate context window, possibly different model | Body becomes new system prompt |
| **MCP server** | `.mcp.json` (project) or `~/.claude.json` (user) | Model calls `mcp__<server>__<tool>` like any tool | Network/IPC boundary | Tool descriptions live in context |
| **Hook** | `.claude/settings.json` or plugin `hooks.json` | Runtime event (PreToolUse, SessionStart, …) | Outside the model | Zero — runs in the harness |
| **Plugin** | `.claude-plugin/plugin.json` at repo root | Bundles any/all of the above | Inherited from contents | Distribution unit only |

---

## Which primitive for which job

Use this table when you have a recurring pattern you want to capture.

| You want to… | Use a… | Why |
| --- | --- | --- |
| Capture a multi-step workflow the model should follow when a request shape matches | **Skill** | Loads on demand. Doesn't pay context cost when irrelevant. Discoverable by description. |
| Give the user a `/foo` they can type | **Skill** with `disable-model-invocation: true` | Slash commands are now skills. Same file format. |
| Run a recurring specialized worker (code review, security audit) in a fresh context window | **Custom subagent** | Real isolation. Can pin a different model. Cleaner than re-pasting a long system prompt. |
| Add an external tool (database, API, browser) | **MCP server** | The only way to get non-built-in tools. |
| Block a specific dangerous command (`git commit --no-verify`, edits to `.env`) | **Hook** (PreToolUse, exit 2) | Hooks are the only primitive the model cannot ignore. |
| Auto-format / lint / typecheck after edits | **Hook** (PostToolUse) | Runs outside the model — deterministic, zero context cost. |
| Distribute the above across multiple machines or projects | **Plugin** | Versioning, namespacing, single-command install. |

When you're not sure: write it as a **convention doc first**. Most of what looks like a candidate primitive turns out to be reference content that should stay in `conventions/` or `AGENTS.md`. Convert to a primitive only after the doc proves itself.

---

## Skill vs custom subagent vs hook — the confusion point

All three can be triggered by description matching (Claude reads the description and decides to invoke). The real distinction is **where the work runs**:

- **Skill** — *modifies the current agent in-place*. Body content gets injected into the conversation as a system reminder. Same context, same model. Use when the work needs to reference the ongoing conversation.
- **Custom subagent** — *forks a fresh agent*. Separate context window, separate system prompt (the body replaces Claude Code's default system prompt entirely), possibly a different model. Use when isolation is the point — review without confirmation bias, parallel work, expensive reasoning where you want to pin Opus.
- **Hook** — *runs outside the model*. Deterministic. Fires on a runtime event. Use when the rule must be unviolable (block destructive ops) or when the work doesn't need a model at all (auto-format, run tests).

Quick rule: needs conversation context → Skill. Needs isolation → custom subagent. Must not be ignorable → Hook.

---

## What this framework currently uses

As of writing: zero. No `.claude/skills/`, no `.claude/agents/`, no `.mcp.json`, no `hooks.json`. `.claude/settings.json` enables two plugins (`frontend-design`, `superpowers`) and pre-approves one bash command. The framework is intentionally documentation-only.

Adopting any primitive is a per-project decision. The recommended progression for any framework-using project:

1. **Always.** Document conventions in markdown (this framework's default mode).
2. **When a convention becomes a procedure** (multi-step, reusable, model should execute it). → Convert to a Skill.
3. **When the same review task recurs** with different specifics each time. → Custom subagent.
4. **When a rule must be enforced, not just suggested.** → Hook.
5. **When you have ≥ 2 machines or projects syncing the same skills/agents.** → Plugin.

Skipping steps is fine if the use case is obvious. Don't skip step 1 — markdown is cheap to write and the right place for anything that's still in flux.

---

## Detail files

- [`skills.md`](skills.md) — when to author a Skill, SKILL.md format, anti-patterns
- [`custom-agents.md`](custom-agents.md) — when to author `.claude/agents/*.md`, frontmatter, model pinning
- [`mcp-servers.md`](mcp-servers.md) — three deployment models, `.mcp.json` shape, auth, well-known servers
- [`hooks.md`](hooks.md) — load-bearing vs theater hooks, event types, exit-code semantics

Plugins are not covered in their own file (yet). The pattern is: package once you have a real reason to distribute (multiple machines, namespaced commands, shared updates). Until then, files in `.claude/` are enough. See `mcp-servers.md` and `custom-agents.md` for plugin-specific restrictions on those primitives.

---

## Other AI environments

This subfolder is Claude Code-first because Claude Code has the richest primitive surface today. Rough portability map:

- **Claude API / Claude Agent SDK** — Skills work (uploaded via the Skills API). Custom subagents, hooks, and `.mcp.json` are Claude Code constructs; the SDK has its own equivalents. Skills are the most portable primitive.
- **Grok / plain chat UIs** — None of these primitives exist. The framework's substantive rules (anti-overengineering, escalation, ask-vs-proceed) all still apply via plain markdown. Degradation is graceful.
- **IDE assistants (Cursor, Copilot, etc.)** — Each has its own primitive surface; pattern names don't carry over cleanly. The closest universal artifacts are `AGENTS.md` (read by most agents now) and `.mcp.json` (becoming a quasi-standard).

If you're writing a doc that applies to *all* AI agents, put it one level up in `conventions/`. If it's Claude-specific, put it here.

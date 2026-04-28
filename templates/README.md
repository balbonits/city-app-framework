# Project Templates

Starter templates for new projects. Copy these into a new repo, fill in the placeholders, and delete this README.

## Files

| File | Goes in new repo as |
| --- | --- |
| `project-AGENTS.md` | `AGENTS.md` |
| `project-CLAUDE.md` | `CLAUDE.md` |
| `project-GROK.md` | `GROK.md` |
| `project-README.md` | `README.md` |

## What to fill in

In `AGENTS.md`:

- Project name + one-sentence description + repo URL
- Stack table (real versions, not placeholders)
- Commands table (only the ones that exist in `package.json`)
- Project layout (the actual `src/` tree, after you scaffold it)
- "What not to do" section — project-specific footguns

In `CLAUDE.md` / `GROK.md`:

- One-line stack summary
- Build command
- Route location
- Anything else an agent needs in the first 200 tokens of context

## Reference

For an example of a finished, working `AGENTS.md`, see [`jdilig-me-v3/AGENTS.md`](https://github.com/balbonits/jdilig-me-v3/blob/main/AGENTS.md). It's the model these templates are based on.

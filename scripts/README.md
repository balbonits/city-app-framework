# Scripts

Operational scripts for using the framework. Bash, no build step, no dependencies beyond `git` and `sed`.

## `new-project.sh`

Bootstrap a new project using this framework.

```bash
./scripts/new-project.sh <target-path> [project-name]
```

**What it does:**

1. Creates the target directory (refuses to overwrite non-empty dirs).
2. Prompts for one-line description and repo URL (both optional — press Enter to skip).
3. Copies `templates/project-*.md` → `<target>/AGENTS.md`, `CLAUDE.md`, `GROK.md`, `README.md`, with placeholders substituted.
4. Generates a `BACKLOG.md` skeleton (Up next / Considered, deferred / Recently shipped).
5. Creates `docs/decisions/` with an ADR-format README.
6. Runs `git init`.

**What it does NOT do:**

- Scaffold a stack. Run `npm create vite@latest .` (or your equivalent) yourself after the script.
- Push to a remote.
- Set up `.claude/` wiring — pending the `templates/.claude/` skeleton (BACKLOG Tier 2).

**Examples:**

```bash
# Project name from the target dir's basename
./scripts/new-project.sh ~/Projects/case-study

# Explicit project name (with spaces, quote it)
./scripts/new-project.sh ~/Projects/case-study "Case Study App"
```

**Why placeholders aren't fully filled:**

`AGENTS.md` has a stack table, commands table, and project-layout block. The script can't know those before you've picked your stack and run `npm create vite@latest .`. Fill them in after scaffolding, while the answers are obvious.

## Adding scripts

Two rules:

1. **Bash only.** No node, no python. The framework should bootstrap without dependencies.
2. **`set -euo pipefail`** at the top. Fail loudly, not silently.

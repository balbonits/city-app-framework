#!/usr/bin/env bash
#
# new-project.sh — bootstrap a new project using city-app-framework
#
# Usage:
#   ./scripts/new-project.sh <target-path> [project-name]
#
# What it does:
#   1. Creates <target-path> if it doesn't exist (refuses to overwrite non-empty dirs).
#   2. Prompts for one-line description and repo URL (skippable with empty input).
#   3. Copies templates/project-*.md into target, renamed and with placeholders filled.
#   4. Generates a BACKLOG.md skeleton.
#   5. Creates docs/decisions/ for future ADRs.
#   6. Runs `git init`.
#   7. Prints next-steps.
#
# What it does NOT do:
#   - Scaffold a stack (Vite, Next, etc.). Run `npm create vite@latest .` or
#     equivalent yourself after this script.
#   - Push to a remote.
#   - Set up .claude/ wiring (Tier 2 BACKLOG item — pending).

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <target-path> [project-name]" >&2
  echo "Example: $0 ~/Projects/case-study \"Case Study App\"" >&2
  exit 1
fi

TARGET="$1"
# Resolve to absolute path without requiring the dir to exist.
TARGET="$(cd "$(dirname "$TARGET")" 2>/dev/null && pwd)/$(basename "$TARGET")" || TARGET="$1"
PROJECT_NAME="${2:-$(basename "$TARGET")}"

# ── Locate framework root ─────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES="$FRAMEWORK_ROOT/templates"

if [[ ! -d "$TEMPLATES" ]]; then
  echo "Error: templates directory not found at $TEMPLATES" >&2
  echo "Is this script being run from inside city-app-framework?" >&2
  exit 1
fi

# ── Target dir safety check ───────────────────────────────────────────────────

if [[ -e "$TARGET" ]]; then
  if [[ ! -d "$TARGET" ]]; then
    echo "Error: $TARGET exists but is not a directory." >&2
    exit 1
  fi
  # Allow empty existing dirs (common when user pre-created the folder).
  if [[ -n "$(ls -A "$TARGET" 2>/dev/null)" ]]; then
    echo "Error: $TARGET exists and is not empty. Refusing to overwrite." >&2
    echo "Move/remove existing files first, or pick a fresh path." >&2
    exit 1
  fi
fi

mkdir -p "$TARGET"

# ── Interactive prompts (skippable) ───────────────────────────────────────────

echo "Bootstrapping project: $PROJECT_NAME"
echo "Target:               $TARGET"
echo "Framework root:       $FRAMEWORK_ROOT"
echo
read -r -p "One-sentence description (optional, press Enter to skip): " DESCRIPTION
read -r -p "Repo URL (optional, e.g. https://github.com/user/repo): " REPO_URL
echo

# Defaults if user skipped.
DESCRIPTION="${DESCRIPTION:-[one-sentence description]}"
REPO_URL="${REPO_URL:-[URL]}"

# ── sed-safe escape ───────────────────────────────────────────────────────────
# Anything with /, &, \, or | breaks naive sed. Escape the delimiter we use (|).

sed_escape() {
  printf '%s' "$1" | sed -e 's/[\&|]/\\&/g'
}

NAME_E="$(sed_escape "$PROJECT_NAME")"
DESC_E="$(sed_escape "$DESCRIPTION")"
URL_E="$(sed_escape "$REPO_URL")"

# ── Copy + substitute templates ───────────────────────────────────────────────

substitute() {
  # Usage: substitute <src> <dest>
  local src="$1" dest="$2"
  sed \
    -e "s|\[Project name\]|${NAME_E}|g" \
    -e "s|\[One-sentence description of what this is and who it's for\.\]|${DESC_E}|g" \
    -e "s|\[one-sentence description\]|${DESC_E}|g" \
    -e "s|\[URL\]|${URL_E}|g" \
    "$src" > "$dest"
}

substitute "$TEMPLATES/project-AGENTS.md"  "$TARGET/AGENTS.md"
substitute "$TEMPLATES/project-CLAUDE.md"  "$TARGET/CLAUDE.md"
substitute "$TEMPLATES/project-GROK.md"    "$TARGET/GROK.md"
substitute "$TEMPLATES/project-README.md"  "$TARGET/README.md"

# ── BACKLOG.md skeleton ───────────────────────────────────────────────────────

cat > "$TARGET/BACKLOG.md" <<EOF
# BACKLOG — $PROJECT_NAME

Live work queue. Updated on every push or merge to \`main\`.

---

## Up next

- [First task]

## Considered, deferred

## Recently shipped
EOF

# ── docs/decisions/ ───────────────────────────────────────────────────────────

mkdir -p "$TARGET/docs/decisions"
cat > "$TARGET/docs/decisions/README.md" <<'EOF'
# Architecture Decision Records

Non-obvious architectural choices live here. Format:

```
NNN-short-title.md

# NNN: [Short title]
Date: YYYY-MM-DD
Status: Accepted | Superseded by NNN

## Context
## Decision
## Alternatives
## Consequences
```

If a later decision contradicts an earlier one, write a new ADR and mark the old one Superseded. Don't edit history.
EOF

# ── git init ──────────────────────────────────────────────────────────────────

(cd "$TARGET" && git init --quiet)

# ── Next-steps message ────────────────────────────────────────────────────────

cat <<EOF
Done. Files created in $TARGET:

  AGENTS.md            (fill in stack table, commands, layout, footguns)
  CLAUDE.md            (one-line stack summary + build command)
  GROK.md              (same as CLAUDE.md, for Grok)
  README.md            (human-facing intro)
  BACKLOG.md           (work queue — start adding items)
  docs/decisions/      (ADRs go here)

Next steps:

  cd "$TARGET"
  # 1. Scaffold the stack:
  #    npm create vite@latest .          (React + TS + Vite)
  #    npm create next-app@latest .      (Next.js)
  #    cargo init                        (Rust)
  #    ...whatever fits the project.

  # 2. Fill in placeholders in AGENTS.md (stack table, commands, layout).

  # 3. First commit:
  #    git add .
  #    git commit -m "chore: scaffold project from city-app-framework"
EOF

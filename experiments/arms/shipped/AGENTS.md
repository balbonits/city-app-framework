# AGENTS.md

Instructions for AI coding agents working in this repository.

This project follows the universal rules at [city-app-framework/AGENTS.md](https://github.com/balbonits/city-app-framework/blob/main/AGENTS.md). Read that first. This file overrides defaults with project specifics.

---

## Project

**habit-cli** — Tiny habit tracker for the terminal. Local-only.

Repo: [URL]

---

## Stack

| Component | Technology |
| --- | --- |
| Runtime | Node.js 22+ |
| Language | JavaScript (ES modules), no build step |
| Dependencies | None (Node built-ins only) |
| Testing | `node:test` + `node:assert` |

> Intentionally zero dependencies. Node 22 covers what this tool needs.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm test` | run all tests (`node --test`) |
| `node src/cli.js <add\|done\|list> [name]` | run the CLI |

---

## Project layout

```text
src/
  cli.js          # entry: parses argv, dispatches to commands
  commands.js     # add / done / list — return strings, no printing
  store.js        # load/save habits.json (HABITS_FILE env overrides path)
  streak.js       # streak math (UTC days)
test/
  commands.test.js
  streak.test.js
```

---

## File & folder naming

| Kind | Style | Example |
| --- | --- | --- |
| Folders | `lowercase` | `src/`, `test/` |
| Modules | `lowercase.js` or `camelCase.js` | `store.js`, `streak.js` |
| Tests | `<module>.test.js` in `test/` | `streak.test.js` |

---

## Testing

- Test business logic (streaks, commands). Commands return strings, so test the returned value.
- Tests set `HABITS_FILE` to a temp file; never touch a real `habits.json`.

---

## What not to do

- Don't add dependencies without asking.
- Don't print from `commands.js` — return strings; only `cli.js` prints.
- Don't commit `habits.json`.

---

## BACKLOG hygiene

`BACKLOG.md` at the repo root is the live work queue. Update it whenever a push or merge to `main` completes, partially completes, or invalidates a backlog item.

| Situation | Action |
| --- | --- |
| Item shipped fully | Move to "Recently shipped" at the bottom (or remove if old). |
| Item shipped partially | Update scope; mark done bullets with strikethrough or move to "Shipped" sub-bullet. |
| New work emerged mid-task | Add a new item or sub-bullet under the relevant existing item. |
| Item turned out to be wrong / obsolete | Remove it and explain why in the commit body. |

---

## Decision log

Non-obvious architectural choices go in `docs/decisions/NNN-short-title.md` as ADRs. See the universal `AGENTS.md` for the format.

# Journal

Findings from past sessions. Newest first.

---

## 2026-09-20 — `list --json`

**What:** Added a `--json` flag to `habit list`. First pass hand-parsed flags with `args.includes('--json')`. John reviewed it and pushed back: hand-rolled argv parsing already bit us once (`habit add --json-thing` got treated as the flag, and `--flag=value` forms silently did nothing). Reworked `cli.js` to use `parseArgs` from `node:util` with `allowPositionals: true`, which handles `--flag=value`, short aliases, and unknown-flag errors for free.

**Lessons:**

- Use `parseArgs` from `node:util` for any CLI flag. No `args.includes('--x')` / `indexOf` parsing — John wants this everywhere.
- Commands keep returning strings; only `cli.js` prints. Held up fine.
- The `HABITS_FILE` temp-file pattern in tests keeps working well; keep using it.

---

## 2026-09-12 — streak math

**What:** Fixed streaks for users east of UTC. All day math now goes through `toDay()` in UTC.

**Lessons:**

- Never use `toLocaleDateString()` for stored days; it made streaks depend on the machine's timezone.
- Keep date logic in `streak.js`; commands shouldn't do their own date arithmetic.

---

## 2026-09-03 — project setup

**What:** Set up the repo: zero dependencies, `node:test`, ESM.

**Lessons:**

- `node --test` finds `test/*.test.js` automatically; no config needed.

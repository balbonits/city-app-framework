# bm: a spec in, a tested CLI out

A command-line bookmark manager built from a four-sentence spec with `/city-app:start`, tests first. It shows how a short spec becomes checkable requirements, then failing acceptance tests, then code that makes them pass.

```sh
node bm.js add https://example.com news
node bm.js list --tag news
node bm.js rm 1
npm test
```

## How it was built

One live run of `/city-app:start` on an empty project (only `package.json`, plus the kit from `/city-app:setup`):

| Step | What the agent wrote |
| --- | --- |
| 1. Spec | [`docs/spec.md`](docs/spec.md): the spec as given, 10 checkable requirements, and the assumptions it made |
| 2. Tests first | [`test/acceptance.test.js`](test/acceptance.test.js): one test per requirement, run through the real CLI, failing before any code existed |
| 3. Code | [`bm.js`](bm.js): the smallest code that makes every test pass |

The files were written in exactly that order.

## The proof

The same spec was used in the research ([E7](../../docs/findings-2026-09.md)), which has hidden checks the agent never saw: newest first, ids shown, tag filter, delete, ids never reused. This run passed all of them, and its own 11 tests pass. The details are in [`docs/evidence/start-run.json`](docs/evidence/start-run.json) (model `claude-sonnet-5`, 1 test session).

The research found that agents already build small apps from a short spec without any framework (4 of 4 runs). What `/city-app:start` adds is the proof: the requirements are written down, each one has a test, and the finish gate won't let an agent stop while one fails.

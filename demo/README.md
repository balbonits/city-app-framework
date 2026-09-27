# Demos

Small projects built with the [city-app](../README.md) kit, one per use case. Each one has its own README (with the evidence) and its own `npm test`.

| Demo | What it shows | Commands used |
| --- | --- | --- |
| [`bookmarks-cli`](bookmarks-cli/) | A four-sentence spec turned into requirements, failing acceptance tests, then code, in that order; it passes hidden checks it never saw | `/city-app:setup`, `/city-app:start` |
| [`habit-web`](habit-web/) | Every part working together in a small web app: setup, the guard, the finish gate, lessons in all three forms, rules tested and pruned, UI checks, screenshot baselines and a design-token check | `/city-app:setup`, `/city-app:lesson`, `/city-app:rules:test`, `/city-app:rules:prune`, `/city-app:ui:check`, `/city-app:ui:baseline`, `/city-app:ui:tokens` |

Run one:

```sh
cd demo/habit-web
npm install
npm test
```

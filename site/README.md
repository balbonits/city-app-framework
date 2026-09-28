# The white paper

*Laws and customs: which instructions change what AI coding agents do* is a scientific case study of City App Framework: abstract, research questions, method, results, the v4 redesign and its evaluation, discussion, limitations and references. It's one page of plain HTML and CSS with no build step, served as static files. Its numbers come from `docs/findings-2026-09.md` and `experiments/results/`; change them there first.

| File | What |
| --- | --- |
| `index.html` | The page |
| `styles.css` | Styles; every color comes from the tokens at the top |
| `favicon.svg` | Icon |
| `fonts/` | Literata (body), Overpass and Overpass Mono (Latin), self-hosted so the page makes no outside requests. License: `fonts/OFL.txt` |

## Preview

```sh
ROOT=site PORT=3000 node demo/habit-web/server.mjs   # from the repo root, then open http://localhost:3000
```

## Checks

- `npm test` (repo root) runs `tests/site.test.mjs`: the paper keeps its case-study sections, every citation has a reference and every reference is cited, it lists every plugin command and no others, shows the current plugin version, links only to files that exist, and takes every color from a token.
- The kit's UI check, using the demo's installed browser (run `npm install` in `demo/habit-web` first):

  ```sh
  cd demo/habit-web && node scripts/ui-check.mjs --start "ROOT=../../site PORT={port} node server.mjs" --url "http://localhost:{port}" --pages /
  ```

## Deploy

The page is the Vercel project `website`. `vercel.json` at the repo root tells Vercel to skip the install and build and serve `site/` as static files, so any deploy of the repo works. Deploy `main` to production after a plugin release, so the version and commands match.

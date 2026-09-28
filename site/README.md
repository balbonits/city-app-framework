# The white paper page

The public one-page summary of City App Framework: what it is, what the experiments found, and how to start. It's plain HTML and CSS with no build step, served as static files.

| File | What |
| --- | --- |
| `index.html` | The page |
| `styles.css` | Styles; every color comes from the tokens at the top |
| `favicon.svg` | Icon |
| `fonts/` | Overpass and Overpass Mono (Latin), self-hosted so the page makes no outside requests. License: `fonts/OFL.txt` |

## Preview

```sh
ROOT=site PORT=3000 node demo/habit-web/server.mjs   # from the repo root, then open http://localhost:3000
```

## Checks

- `npm test` (repo root) runs `tests/site.test.mjs`: the page lists every plugin command and no others, shows the current plugin version, links only to files that exist, and takes every color from a token.
- The kit's UI check, using the demo's installed browser (run `npm install` in `demo/habit-web` first):

  ```sh
  cd demo/habit-web && node scripts/ui-check.mjs --start "ROOT=../../site PORT={port} node server.mjs" --url "http://localhost:{port}" --pages /
  ```

## Deploy

The page is the Vercel project `website`, deployed as static files with no build step. Deploy the `site/` folder to production after a plugin release, so the version and commands match.

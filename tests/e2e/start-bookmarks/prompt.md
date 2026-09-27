---
max_turns: 60
timeout_seconds: 900
---

/city-app:start Build `bm`, a command-line bookmark manager (entry point `bm.js`, run as `node bm.js`). `bm add <url> [tags...]` saves a bookmark; `bm list [--tag <tag>]` prints one bookmark per line as `<id> <url> [tags]`, newest first; `bm rm <id>` deletes one. Ids are 1, 2, 3, ... and are never reused. Store data in bookmarks.json, or the path in BM_FILE. Include tests.

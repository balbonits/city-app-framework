# bm — command-line bookmark manager

## Spec (as given)

Build `bm`, a command-line bookmark manager (entry point `bm.js`, run as `node bm.js`). `bm add <url> [tags...]` saves a bookmark; `bm list [--tag <tag>]` prints one bookmark per line as `<id> <url> [tags]`, newest first; `bm rm <id>` deletes one. Ids are 1, 2, 3, ... and are never reused. Store data in bookmarks.json, or the path in BM_FILE. Include tests.

## Requirements

1. `bm add <url>` saves a new bookmark with that url and no tags.
2. `bm add <url> <tag1> <tag2> ...` saves a new bookmark with that url and all given tags.
3. The first bookmark ever added gets id 1; each subsequent `add` gets the next integer id (2, 3, ...).
4. Ids are never reused, even after the bookmark with that id is removed.
5. `bm list` prints one line per saved bookmark, newest first (most recently added at top).
6. Each `bm list` line has the form `<id> <url> <tags>`, where `<tags>` is the bookmark's tags separated by spaces, and is omitted (no trailing space) when the bookmark has no tags.
7. `bm list --tag <tag>` prints only bookmarks that have the given tag, in the same newest-first order and format.
8. `bm rm <id>` deletes the bookmark with that id; it no longer appears in `bm list`.
9. Bookmark data is persisted to `bookmarks.json` in the current directory by default.
10. If the `BM_FILE` environment variable is set, that path is used to store/load data instead of `bookmarks.json`.

## Assumptions

- **Tag output format**: the spec's `[tags]` is read as "optional trailing tags", not literal brackets — tags are printed space-separated after the url and the segment is simply absent when there are no tags. (Simplest reading; flagging in case literal `[tag1, tag2]`-style brackets were intended.)
- `bm rm <id>` for an id that doesn't exist: prints an error to stderr and exits with a non-zero status, without modifying the file.
- `bm add` requires a url argument; missing url is an error (prints usage/error to stderr, non-zero exit).
- Duplicate urls are allowed (no uniqueness constraint stated).
- The data file, if missing, is treated as an empty bookmark list (created on first `add`).

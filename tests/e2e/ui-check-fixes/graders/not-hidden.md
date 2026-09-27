---
type: regex
target: { source: file, path: public/index.html }
pattern: "<button[^>]*aria-hidden"
match: not_contains
---

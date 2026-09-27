---
type: regex
target: { source: file, path: public/styles.css }
pattern: "\\.empty\\s*\\{[^}]*color:\\s*var\\("
---
The empty state still sets its color, now from a token.

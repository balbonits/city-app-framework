# Sources

This collection is distilled from publicly available UI/UX teaching, primarily Kole Jain's YouTube channel.

---

## Source videos (current)

| ID | Title | Contributes to |
| --- | --- | --- |
| `EcbgbKtOELY` | Every UI/UX Concept Explained in Under 10 Minutes | [hierarchy](hierarchy.md), [layout](layout.md), [states-feedback](states-feedback.md), [color](color.md) |
| `Gfsd8NNuD9g` | Everything you need to know about Mobile App UIs in 8 minutes | [mobile.md](mobile.md) |
| `PDcQJOPby1k` | 5 SaaS UI/UX mistakes that SCREAM you Vibe Code | [anti-patterns.md](anti-patterns.md) |
| `66oOi9OLMCw` | Why the 60-30-10 Rule is RUINING Your UI Designs | [color.md](color.md) — the 4-layer system, OKLCH, dark mode |

URLs follow the pattern `https://youtu.be/<ID>`.

---

## How to extend

When new sources land:

1. Pull the transcript — `yt-dlp --write-auto-subs --sub-lang en --skip-download <url>`.
2. Identify which existing topic file(s) it reinforces or extends.
3. Update those files with new rules. **Don't append a new "Source N" section** — integrate by topic.
4. Add the row to the table above with which topic files it contributes to.
5. Update [README.md](README.md) only if a new top-level concept emerges that didn't fit anywhere.

If a source contradicts an existing rule, escalate — don't silently overwrite. Multiple sources disagreeing is signal, not noise.

---

## Why we organize this way

- **Topic-organized, not source-organized.** AI agents load by topic during work, not by source. Source attribution is for traceability, not access.
- **Concise over comprehensive.** A 40-line rule file gets read; a 400-line essay gets skimmed.
- **Anti-patterns are first-class.** AI failure modes are predictable enough to encode. See [anti-patterns.md](anti-patterns.md).

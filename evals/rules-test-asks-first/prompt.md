---
max_turns: 15
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, Bash]
---

/city-app:rules:test Parse CLI flags with parseArgs from node:util --task="Let habit list take --min-streak <n> to only show habits with at least that streak." --check="grep -rqw parseArgs src"

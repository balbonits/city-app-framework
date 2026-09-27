---
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Bash, Edit, Write]
---

/city-app:lesson You hand-rolled flag parsing again (`args.includes('--json')` in src/cli.js). In this project we always parse CLI flags with parseArgs from node:util, because hand-rolled parsing broke `--flag=value` before. Fix it, and make sure this doesn't happen again.

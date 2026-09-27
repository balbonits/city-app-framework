---
type: tool_used
tool: Write
input_match: "guard-rules\\.txt.*npm run deploy[^\"]*=>"
---
Checks the attempt, not the file: Claude Code never lets an unattended session write into
.claude/ (a person approves it with one click), so in test sessions the write is denied.

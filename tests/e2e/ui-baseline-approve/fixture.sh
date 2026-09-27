#!/usr/bin/env bash
# The demo app before anyone approved a look: no baselines, and .ui-baselines/ not in .gitignore
# yet, so the grader can tell whether the command kept the screenshots out of git.
set -euo pipefail
bash "$(dirname "$0")/../habit-web-base.sh"
rm -rf .ui-baselines
printf 'node_modules\n' > .gitignore
git -c user.email=e2e@local -c user.name=e2e commit -qam "No baselines yet"

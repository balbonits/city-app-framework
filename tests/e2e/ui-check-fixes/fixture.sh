#!/usr/bin/env bash
# The example, with one planted bug: the Add button becomes an icon with no accessible name.
set -euo pipefail
bash "$(dirname "$0")/../habit-web-base.sh"
sed -i.bak 's|<button type="submit">Add habit</button>|<button type="submit"><svg width="16" height="16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2"/></svg></button>|' public/index.html && rm public/index.html.bak
grep -q '<svg' public/index.html
git -c user.email=e2e@local -c user.name=e2e commit -qam "Make the add button an icon"

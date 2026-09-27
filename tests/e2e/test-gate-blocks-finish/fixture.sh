#!/usr/bin/env bash
set -euo pipefail
bash "$(dirname "$0")/../base.sh"
echo 'export const add = (a, b) => a - b;' > src/math.js
cat > test/math.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { add } from '../src/math.js';
test('adds', () => assert.equal(add(2, 2), 4));
JS
git init -q && git add -A && git -c user.email=e2e@local -c user.name=e2e commit -qm init

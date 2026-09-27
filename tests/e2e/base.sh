#!/usr/bin/env bash
# Shared by the hook end-to-end cases: a small app with the real kit installed.
set -euo pipefail
cat > package.json <<'JSON'
{ "name": "e2e-app", "private": true, "type": "module", "scripts": { "test": "node --test", "deploy": "echo DEPLOYED > deployed.txt" } }
JSON
mkdir -p src test
echo "export const hi = () => 'hi';" > src/hello.js
cat > test/hello.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hi } from '../src/hello.js';
test('hi', () => assert.equal(hi(), 'hi'));
JS
node "$EVAL_REPO/scripts/install.mjs" . --name e2e-app > /dev/null
sed -i.bak 's/{{[^}]*}}/Small test app./g' AGENTS.md && rm AGENTS.md.bak

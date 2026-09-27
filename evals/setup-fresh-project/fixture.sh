#!/usr/bin/env bash
# A small React + Vite project with no agent files yet.
set -euo pipefail

cat > package.json <<'EOF'
{
  "name": "shop-web",
  "description": "Storefront for a small neighborhood bakery",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "node --test",
    "lint": "eslint ."
  },
  "dependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "devDependencies": { "vite": "^8.0.0", "@vitejs/plugin-react": "^6.0.0", "eslint": "^10.0.0" }
}
EOF

cat > README.md <<'EOF'
# shop-web

Storefront for a small neighborhood bakery. Customers browse today's bakes and reserve them for pickup.
EOF

printf '22\n' > .nvmrc
printf 'VITE_API_URL=http://localhost:8787\n' > .env.example

mkdir -p src/api test
cat > src/api/client.js <<'EOF'
export const getBakes = () => fetch(`${import.meta.env.VITE_API_URL}/bakes`).then((r) => r.json());
EOF
cat > src/App.jsx <<'EOF'
export default function App() {
  return <main><h1>Today's bakes</h1></main>;
}
EOF
cat > test/price.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('prices are shown with two decimals', () => {
  assert.equal((3.5).toFixed(2), '3.50');
});
EOF

git init -q && git add -A && git -c user.email=eval@local -c user.name=eval commit -qm init

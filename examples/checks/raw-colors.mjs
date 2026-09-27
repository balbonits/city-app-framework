#!/usr/bin/env node
// rules:test check for habit-web's tokens rule: exits 1 if a color is written out anywhere but
// the :root token blocks of public/*.css (hex, rgb(), hsl(), or a color name), including inline
// styles in HTML and JS. Lives outside the example so the agents being tested can't see it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const NAMED = 'red|green|blue|white|black|gray|grey|orange|yellow|purple|pink|crimson|tomato|firebrick|darkred|maroon|salmon|coral|navy|teal|silver';
const COLOR = new RegExp(`#[0-9a-f]{3,8}\\b|\\b(rgba?|hsla?|oklch|lab|lch)\\(|:\\s*[^;{}]*\\b(${NAMED})\\b`, 'i');
const INLINE = new RegExp(`style[^\\n]*(#[0-9a-f]{3,8}\\b|\\b(rgba?|hsla?)\\(|\\b(${NAMED})\\b)`, 'i');
const dir = join(process.cwd(), 'public');
const problems = [];
for (const file of readdirSync(dir)) {
  const text = readFileSync(join(dir, file), 'utf8');
  if (file.endsWith('.css')) {
    text.replace(/:root\s*\{[^}]*\}/g, (block) => block.replace(/[^\n]/g, ' ')).split('\n')
      .forEach((line, i) => { if (COLOR.test(line.replace(/\/\*.*?\*\//g, ''))) problems.push(`public/${file}:${i + 1}: ${line.trim()}`); });
  } else if (/\.(html|js)$/.test(file)) {
    text.split('\n').forEach((line, i) => { if (INLINE.test(line)) problems.push(`public/${file}:${i + 1}: ${line.trim()}`); });
  }
}
if (problems.length) {
  console.log(`Raw colors outside the tokens:\n${problems.join('\n')}`);
  process.exit(1);
}

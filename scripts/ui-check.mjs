#!/usr/bin/env node
// UI checks for a web app's pages, as pass/fail checks instead of opinions:
//   - accessibility problems (axe-core)
//   - console errors, uncaught errors and files that fail to load
//   - a page wider than the screen (it scrolls sideways)
// at phone, tablet and desktop sizes, with a screenshot of each page at each size to look at.
// With approved baselines (--approve saves them to .ui-baselines/), a page that looks different
// from its approved screenshot fails too, with a diff image.
// Used by /city-app:ui:check. Needs playwright and axe-core as dev dependencies of the project.
// Self-contained (Node built-ins only), so --add-test can copy it into a project.
//
//   node ui-check.mjs [--url http://localhost:3000] [--start "npm run dev"] [--pages /,/about]
//                     [--sizes phone,tablet,desktop] [--out <dir>] [--dir .]
//   node ui-check.mjs --approve [same options]    save how the pages look now as the baseline
//   node ui-check.mjs --add-test [same options]   copy this file into the project and add test/ui.test.js
//
// {port} in --start and --url becomes a free port, so parallel runs and a running dev server never clash.
// Exits 1 with fix-it messages when a check fails, 0 when every page passes, 2 when it can't run.
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

export const SIZES = {
  phone: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

// Fix-it messages. Each names the page, what's wrong, and what to do.
export const axeProblems = (page, violations) => violations.map((v) => {
  const where = v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ');
  const more = v.nodes.length > 3 ? ` and ${v.nodes.length - 3} more` : '';
  return `Accessibility on ${page}: ${v.help} (${v.id}, ${v.impact}) at ${where}${more}. How to fix: ${v.helpUrl}`;
});
export const consoleProblem = (page, text) =>
  `Console error on ${page}: ${text}. A clean console is part of done: fix the cause, don't silence it.`;
export const overflowProblem = (page, { width, scroll, culprits }) =>
  `Layout on ${page}: the page is ${scroll}px wide on a ${width}px screen, so it scrolls sideways.` +
  `${culprits.length ? ` Too wide: ${culprits.join(', ')}.` : ''} Use max-width: 100%, flex-wrap, or a smaller fixed width.`;

export const baselineProblem = (page, { changed, total, was, now }, diff) => (was
  ? `Looks different on ${page}: the page is now ${now.join('x')}, it was ${was.join('x')} when approved.`
  : `Looks different on ${page}: ${((changed / total) * 100).toFixed(1)}% of the pixels changed since the approved screenshot (diff: ${diff}).`)
  + ' If that was intended, approve the new look with /city-app:ui:baseline; if not, find what changed it.';

// Compares two PNGs inside the browser (no image library needed). Pixels that differ by more than
// 16 of 255 on any channel count as changed; under 0.1% changed counts as the same.
async function compareShots(browser, before, after) {
  const page = await browser.newPage();
  try {
    return await page.evaluate(async ([a, b]) => {
      const load = (src) => new Promise((ok, fail) => { const img = new Image(); img.onload = () => ok(img); img.onerror = fail; img.src = src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { was: [ia.width, ia.height], now: [ib.width, ib.height] };
      const pixels = (img) => {
        const c = document.createElement('canvas');
        [c.width, c.height] = [img.width, img.height];
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height);
      };
      const [pa, pb] = [pixels(ia), pixels(ib)];
      const out = new ImageData(ia.width, ia.height);
      let changed = 0;
      for (let i = 0; i < pa.data.length; i += 4) {
        const d = Math.max(Math.abs(pa.data[i] - pb.data[i]), Math.abs(pa.data[i + 1] - pb.data[i + 1]), Math.abs(pa.data[i + 2] - pb.data[i + 2]));
        if (d > 16) { changed++; out.data.set([255, 0, 0, 255], i); } else out.data.set([pb.data[i], pb.data[i + 1], pb.data[i + 2], 60], i);
      }
      const total = pa.data.length / 4;
      if (changed / total < 0.001) return { changed: 0, total };
      const c = document.createElement('canvas');
      [c.width, c.height] = [ia.width, ia.height];
      c.getContext('2d').putImageData(out, 0, 0);
      return { changed, total, diff: c.toDataURL('image/png') };
    }, [`data:image/png;base64,${before.toString('base64')}`, `data:image/png;base64,${after.toString('base64')}`]);
  } finally {
    await page.close();
  }
}

// The same problem at several sizes becomes one line that lists the sizes.
export function groupBySize(found) {
  const bySize = new Map();
  for (const { problem, size } of found) bySize.set(problem, [...(bySize.get(problem) ?? []), size]);
  return [...bySize].map(([problem, sizes]) => `${problem} [${sizes.join(', ')}]`);
}

async function load(dir) {
  const require = createRequire(join(dir, 'package.json'));
  const missing = [];
  let playwright;
  let axeSource;
  try { playwright = await import(pathToFileURL(require.resolve('playwright')).href); } catch { missing.push('playwright'); }
  try { axeSource = require('axe-core').source; } catch { missing.push('axe-core'); }
  if (missing.length) {
    throw new Error(`UI checks need ${missing.join(' and ')} as dev dependencies: npm install --save-dev ${missing.join(' ')}`);
  }
  return { chromium: playwright.chromium ?? playwright.default.chromium, axeSource };
}

const reachable = async (url) => {
  try { return (await fetch(url, { signal: AbortSignal.timeout(2000) })).status < 500; } catch { return false; }
};

export const stopServer = (child) => {
  if (!child || child.exitCode !== null) return;
  try { process.kill(-child.pid, 'SIGTERM'); } catch { child.kill('SIGTERM'); }
};

// Starts the app and waits until it answers. Refuses a port that's already taken, so the checks
// never run against some other app.
export async function startServer(command, url, dir, timeoutMs = 30_000) {
  if (await reachable(url)) throw new Error(`Something is already running at ${url}. Stop it, or use a free port for the checks.`);
  const child = spawn(command, { cwd: dir, shell: true, detached: true, stdio: 'ignore' });
  const until = Date.now() + timeoutMs;
  while (Date.now() < until && child.exitCode === null) {
    if (await reachable(url)) return child;
    await new Promise((r) => setTimeout(r, 250));
  }
  stopServer(child);
  throw new Error(`The app didn't answer at ${url} within ${timeoutMs / 1000}s of running "${command}". Check the command and the port.`);
}

export const freePort = () => new Promise((done, fail) => {
  const probe = createServer().on('error', fail);
  probe.listen(0, () => {
    const { port } = probe.address();
    probe.close(() => done(port));
  });
});

export const fillPort = (text, port) => text?.replaceAll('{port}', String(port));

const slug = (page) => page.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'home';

// Returns { failures: [fix-it messages], screenshots: [paths], approved: [paths] }.
export async function runUiCheck({
  dir = '.', url = 'http://localhost:3000', start, pages = ['/'], sizes = Object.keys(SIZES), out, timeoutMs,
  baselines = '.ui-baselines', approve = false,
} = {}) {
  const root = resolve(dir);
  const { chromium, axeSource } = await load(root);
  if (`${start ?? ''} ${url}`.includes('{port}')) {
    const port = await freePort();
    [start, url] = [fillPort(start, port), fillPort(url, port)];
  }
  const shots = out ? resolve(out) : mkdtempSync(join(tmpdir(), 'ui-check-'));
  mkdirSync(shots, { recursive: true });
  const baselineDir = resolve(root, baselines);
  const approved = [];
  const server = start ? await startServer(start, url, root, timeoutMs) : null;
  const browser = await chromium.launch();
  const found = [];
  const screenshots = [];
  try {
    for (const page of pages) {
      for (const size of sizes) {
        const context = await browser.newContext({ viewport: SIZES[size], bypassCSP: true });
        const tab = await context.newPage();
        tab.on('console', (m) => { if (m.type() === 'error') found.push({ problem: consoleProblem(page, m.text()), size }); });
        tab.on('pageerror', (e) => found.push({ problem: consoleProblem(page, `uncaught ${e.message}`), size }));
        const response = await tab.goto(new URL(page, url).href, { waitUntil: 'load' });
        if (!response || response.status() >= 400) {
          found.push({ problem: `Page ${page} answered ${response?.status() ?? 'nothing'}. Check the path, or the server.`, size });
          await context.close();
          continue;
        }
        await tab.waitForLoadState('networkidle').catch(() => {});
        const wide = await tab.evaluate(() => {
          const width = document.documentElement.clientWidth;
          const scroll = document.documentElement.scrollWidth;
          if (scroll <= width + 1) return null;
          const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '')
            + (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).join('.')}` : '');
          const culprits = [...document.body.querySelectorAll('*')]
            .filter((el) => el.getBoundingClientRect().right > width + 1).slice(0, 3).map(name);
          return { width, scroll, culprits };
        });
        if (wide) found.push({ problem: overflowProblem(page, wide), size });
        await tab.evaluate(`${axeSource}\n;undefined`);
        const { violations } = await tab.evaluate(() => window.axe.run(document, { resultTypes: ['violations'] }));
        for (const problem of axeProblems(page, violations)) found.push({ problem, size });
        const name = `${slug(page)}-${size}.png`;
        const shot = join(shots, name);
        await tab.screenshot({ path: shot, fullPage: true, animations: 'disabled', caret: 'hide' });
        screenshots.push(shot);
        await context.close();
        const baseline = join(baselineDir, name);
        if (approve) {
          mkdirSync(baselineDir, { recursive: true });
          copyFileSync(shot, baseline);
          approved.push(baseline);
        } else if (existsSync(baseline)) {
          const result = await compareShots(browser, readFileSync(baseline), readFileSync(shot));
          if (result.was || result.changed) {
            const diff = join(shots, name.replace(/\.png$/, '-diff.png'));
            if (result.diff) writeFileSync(diff, Buffer.from(result.diff.split(',')[1], 'base64'));
            found.push({ problem: baselineProblem(page, result, diff), size });
          }
        }
      }
    }
  } finally {
    await browser.close();
    stopServer(server);
  }
  return { failures: groupBySize(found), screenshots, approved };
}

const testFile = ({ url, start, pages }) => `// UI checks on every page: accessibility (axe), console errors, and nothing wider than the
// screen, at phone, tablet and desktop sizes. Added by /city-app:ui:check. It runs with npm test,
// so an agent can't finish while a page fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runUiCheck } from '../scripts/ui-check.mjs';

test('every page passes the UI checks', async () => {
  const { failures } = await runUiCheck({ start: ${JSON.stringify(start)}, url: ${JSON.stringify(url)}, pages: ${JSON.stringify(pages)} });
  assert.deepEqual(failures, [], \`\\n\${failures.join('\\n')}\`);
});
`;

// Copies this file into the project and adds a test that runs it. Never overwrites.
export function addTest(dir, options) {
  const root = resolve(dir);
  const files = [
    ['scripts/ui-check.mjs', (to) => copyFileSync(fileURLToPath(import.meta.url), to)],
    ['test/ui.test.js', (to) => writeFileSync(to, testFile(options))],
  ];
  return files.map(([file, write]) => {
    const to = join(root, file);
    if (existsSync(to)) return `kept     ${file} (already there)`;
    mkdirSync(dirname(to), { recursive: true });
    write(to);
    return `added    ${file}`;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values: opt } = parseArgs({
    options: {
      url: { type: 'string', default: 'http://localhost:3000' },
      start: { type: 'string' },
      pages: { type: 'string', default: '/' },
      sizes: { type: 'string', default: Object.keys(SIZES).join(',') },
      out: { type: 'string' },
      dir: { type: 'string', default: '.' },
      'add-test': { type: 'boolean', default: false },
      approve: { type: 'boolean', default: false },
      baselines: { type: 'string', default: '.ui-baselines' },
    },
  });
  const pages = opt.pages.split(',').map((p) => p.trim()).filter(Boolean);
  const sizes = opt.sizes.split(',').map((s) => s.trim()).filter(Boolean);
  const unknown = sizes.filter((s) => !SIZES[s]);
  if (unknown.length) {
    console.error(`Unknown size: ${unknown.join(', ')}. Use ${Object.keys(SIZES).join(', ')}.`);
    process.exit(2);
  }
  if (opt['add-test']) {
    if (!opt.start) {
      console.error('--add-test needs --start (the command that serves the app) so the test can run on its own.');
      process.exit(2);
    }
    for (const line of addTest(opt.dir, { url: opt.url, start: opt.start, pages })) console.log(line);
    console.log('npm test now runs the UI checks. They need playwright and axe-core as dev dependencies.');
    process.exit(0);
  }
  try {
    const { failures, screenshots, approved } = await runUiCheck({
      dir: opt.dir, url: opt.url, start: opt.start, pages, sizes, out: opt.out, baselines: opt.baselines, approve: opt.approve,
    });
    const shown = sizes.map((s) => `${s} ${SIZES[s].width}x${SIZES[s].height}`).join(', ');
    console.log(`UI check: ${pages.length} page(s) at ${shown}`);
    for (const failure of failures) console.log(`✗ ${failure}`);
    console.log(`Screenshots: ${screenshots.length ? dirname(screenshots[0]) : 'none'}`);
    if (approved.length) console.log(`Approved ${approved.length} screenshot(s) as the baseline in ${dirname(approved[0])}. Later checks fail when a page looks different.`);
    console.log(failures.length
      ? `${failures.length} problem(s). Fix them and run the check again.`
      : 'Every page passes: no accessibility problems, no console errors, nothing wider than the screen.');
    process.exit(failures.length ? 1 : 0);
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
}

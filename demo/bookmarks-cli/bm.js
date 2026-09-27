#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function dataFile() {
  return process.env.BM_FILE || 'bookmarks.json';
}

function load() {
  const file = dataFile();
  if (!existsSync(file)) return { nextId: 1, bookmarks: [] };
  return JSON.parse(readFileSync(file, 'utf8'));
}

function save(data) {
  writeFileSync(dataFile(), JSON.stringify(data, null, 2));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cmdAdd(args) {
  const [url, ...tags] = args;
  if (!url) fail('usage: bm add <url> [tags...]');
  const data = load();
  const id = data.nextId;
  data.bookmarks.push({ id, url, tags });
  data.nextId = id + 1;
  save(data);
}

function formatLine(bookmark) {
  const parts = [bookmark.id, bookmark.url, ...bookmark.tags];
  return parts.join(' ');
}

function cmdList(args) {
  let tagFilter = null;
  const tagIndex = args.indexOf('--tag');
  if (tagIndex !== -1) tagFilter = args[tagIndex + 1];

  const data = load();
  const bookmarks = tagFilter
    ? data.bookmarks.filter((b) => b.tags.includes(tagFilter))
    : data.bookmarks;

  for (const bookmark of [...bookmarks].reverse()) {
    console.log(formatLine(bookmark));
  }
}

function cmdRm(args) {
  const [idArg] = args;
  if (!idArg) fail('usage: bm rm <id>');
  const id = Number(idArg);
  const data = load();
  const index = data.bookmarks.findIndex((b) => b.id === id);
  if (index === -1) fail(`no bookmark with id ${idArg}`);
  data.bookmarks.splice(index, 1);
  save(data);
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'add') return cmdAdd(args);
  if (command === 'list') return cmdList(args);
  if (command === 'rm') return cmdRm(args);
  fail('usage: bm <add|list|rm> ...');
}

main();

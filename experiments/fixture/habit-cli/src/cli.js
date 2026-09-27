#!/usr/bin/env node
import { add, done, list } from './commands.js';

const [command, ...args] = process.argv.slice(2);

const commands = {
  add: () => add(args.join(' ')),
  done: () => done(args.join(' ')),
  list: () => list(),
};

if (!commands[command]) {
  console.log('Usage: habit <add|done|list> [name]');
  process.exit(command ? 1 : 0);
}

console.log(commands[command]());

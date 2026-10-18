// Finds a POSIX shell to run check commands and fixture scripts (`sh -c "grep -q x file"`, `bash fixture.sh`).
// macOS and Linux have one. Windows needs Git for Windows' bash.exe; WSL's bash.exe (System32 or the
// WindowsApps alias) is skipped because it runs inside a Linux VM, with Linux paths and no access to the
// Windows temp folders these scripts work in.
import { existsSync } from 'node:fs';
import { delimiter, dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const isWsl = (p) => /[\\/](system32|windowsapps)[\\/]/i.test(p);
let cached; // undefined = not looked yet, null = none found

function gitBashCandidates() {
  const found = [];
  const add = (root) => root && found.push(join(root, 'bin', 'bash.exe'));
  try {
    // e.g. C:/Program Files/Git/mingw64/libexec/git-core: the Git root is a few folders up.
    let dir = execFileSync('git', ['--exec-path'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    for (let i = 0; i < 4 && dir; i++, dir = dirname(dir)) add(dir);
  } catch { /* git not on PATH */ }
  for (const dir of (process.env.PATH ?? '').split(delimiter).filter(Boolean)) {
    if (existsSync(join(dir, 'git.exe'))) add(dirname(dir)); // ...\Git\cmd\git.exe -> ...\Git
  }
  for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.ProgramW6432]) add(base && join(base, 'Git'));
  add(process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Programs', 'Git'));
  return found.map((p) => resolve(p));
}

// Absolute path of Git Bash on Windows, 'bash' elsewhere, or null if there is none.
export function posixShell() {
  if (cached !== undefined) return cached;
  if (process.platform !== 'win32') return (cached = 'bash');
  return (cached = gitBashCandidates().find((p) => existsSync(p) && !isWsl(p)) ?? null);
}

export const NO_SHELL_MESSAGE = 'No POSIX shell found. Install Git for Windows (it includes Git Bash) to run this on Windows.';

// Same arguments as spawnSync('sh', ['-c', command]) would take, with a shell that exists.
export function shellCommand(command) {
  const shell = posixShell();
  if (!shell) throw new Error(NO_SHELL_MESSAGE);
  return [shell, ['-c', command]];
}
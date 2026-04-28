import { Github, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const [theme, toggle] = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border-DEFAULT bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4 sm:px-8">
        <a
          href="#top"
          className="font-mono text-sm font-semibold tracking-tight text-fg-strong hover:text-accent"
        >
          city-app-framework
        </a>
        <nav className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="rounded-md p-2 text-fg-muted transition-colors hover:bg-surface hover:text-fg-strong"
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
          </button>
          <a
            href="https://github.com/balbonits/city-app-framework"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="rounded-md p-2 text-fg-muted transition-colors hover:bg-surface hover:text-fg-strong"
          >
            <Github size={18} aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}

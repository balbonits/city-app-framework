import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border-DEFAULT">
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm font-semibold text-fg-strong">city-app-framework</p>
            <p className="mt-1 text-sm text-fg-muted">
              v0.1 — early. Expected to evolve as patterns prove or fail in real use.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/balbonits/city-app-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent"
            >
              <Github size={16} aria-hidden />
              <span>GitHub</span>
            </a>
            <a
              href="https://github.com/balbonits/city-app-framework/blob/main/AGENTS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-fg-muted hover:text-accent"
            >
              AGENTS.md
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs text-fg-faint">
          Built with the framework it documents. See{' '}
          <a
            href="https://github.com/balbonits/city-app-framework/tree/main/examples/website"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            examples/website
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

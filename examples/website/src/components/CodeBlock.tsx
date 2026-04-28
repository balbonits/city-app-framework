import type { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  label?: string;
}

export function CodeBlock({ children, label }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-bg)]">
      {label ? (
        <div className="border-b border-[var(--color-code-border)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-fg-faint">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed text-fg-strong">
        <code>{children}</code>
      </pre>
    </div>
  );
}

import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';

export function Solution() {
  return (
    <Section id="solution">
      <Eyebrow>The shape</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Two layers.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        The framework is split into two files agents read in order. The universal layer is the same
        across every project. The per-project layer captures stack and footguns specific to one
        codebase.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <article className="rounded-lg border border-border-DEFAULT bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-faint">Layer 1</p>
          <h3 className="mt-2 text-xl font-semibold">Universal</h3>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Rules and patterns shared across every project. Anti-overengineering, escalation
            triggers, decision patterns, communication norms. Lives once, in a shared{' '}
            <code className="rounded bg-[var(--color-code-bg)] px-1.5 py-0.5 text-[0.85em]">
              AGENTS.md
            </code>
            .
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
            <li>· anti-overengineering</li>
            <li>· ask vs proceed</li>
            <li>· decision patterns</li>
            <li>· communication norms</li>
          </ul>
        </article>

        <article className="rounded-lg border border-border-DEFAULT bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-faint">Layer 2</p>
          <h3 className="mt-2 text-xl font-semibold">Per-project</h3>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Stack, commands, file layout, naming, footguns specific to one codebase. Lives in the
            project's own{' '}
            <code className="rounded bg-[var(--color-code-bg)] px-1.5 py-0.5 text-[0.85em]">
              AGENTS.md
            </code>
            . Overrides defaults from Layer 1.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
            <li>· stack &amp; versions</li>
            <li>· dev / build / test commands</li>
            <li>· project layout tree</li>
            <li>· naming &amp; "what not to do"</li>
          </ul>
        </article>
      </div>

      <div className="mt-10 rounded-lg border border-border-DEFAULT bg-surface p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-faint">How it loads</p>
        <pre className="mt-3 overflow-x-auto text-sm leading-relaxed text-fg-strong">
          <code>{`# Agent opens a project
1. Reads project's AGENTS.md (stack + specifics)
2. Follows link to universal AGENTS.md (rules + patterns)
3. Starts work already aligned`}</code>
        </pre>
      </div>
    </Section>
  );
}

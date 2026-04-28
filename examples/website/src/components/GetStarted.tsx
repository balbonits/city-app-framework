import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight, Github } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  body: string;
  code?: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Clone or copy',
    body: 'The framework lives in one repo. Clone it, or just copy the templates and conventions into your own setup.',
    code: 'git clone https://github.com/balbonits/city-app-framework',
  },
  {
    number: '02',
    title: 'Drop in the templates',
    body: 'Copy the per-project starter files into your project. Fill in stack, commands, layout, naming.',
    code: `cp templates/project-AGENTS.md /your/project/AGENTS.md
cp templates/project-CLAUDE.md /your/project/CLAUDE.md
cp templates/project-GROK.md   /your/project/GROK.md`,
  },
  {
    number: '03',
    title: 'Open in your agent and ship',
    body: 'Claude Code, Cursor, Grok — they read AGENTS.md automatically at session start. The agent shows up already aligned with how you build.',
  },
];

export function GetStarted() {
  return (
    <Section id="get-started">
      <Eyebrow>Get started</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Three steps.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        No CLI to install. No config to maintain. Just markdown an agent can read.
      </p>

      <ol className="mt-10 space-y-8">
        {steps.map((step) => (
          <li
            key={step.number}
            className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-8"
          >
            <div className="font-mono text-3xl font-semibold text-accent sm:text-4xl">
              {step.number}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-fg-muted">{step.body}</p>
              {step.code ? (
                <pre className="mt-4 overflow-x-auto rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-bg)] px-4 py-3 text-sm leading-relaxed text-fg-strong">
                  <code>{step.code}</code>
                </pre>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <a
          href="https://github.com/balbonits/city-app-framework"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          <Github size={16} aria-hidden />
          View on GitHub
          <ArrowRight size={16} aria-hidden />
        </a>
        <a
          href="https://github.com/balbonits/city-app-framework/blob/main/AGENTS.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-3 text-sm font-semibold text-fg-strong transition-colors hover:bg-surface"
        >
          Read AGENTS.md
        </a>
      </div>
    </Section>
  );
}

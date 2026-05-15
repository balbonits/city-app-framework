import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/Button';
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
    title: 'Clone the framework',
    body: 'The framework lives in one repo. Clone it once, reuse across every project.',
    code: 'git clone https://github.com/balbonits/city-app-framework',
  },
  {
    number: '02',
    title: 'Run the bootstrap script',
    body: 'One command scaffolds a new project with AGENTS.md, CLAUDE.md, GROK.md, README.md, BACKLOG.md skeleton, docs/decisions/, and git init — prompts for description and repo URL inline.',
    code: `./scripts/new-project.sh ~/Projects/my-app "My App"`,
  },
  {
    number: '03',
    title: 'Open in your agent and ship',
    body: 'Claude Code, Cursor, Grok — they read AGENTS.md automatically at session start. The agent shows up already aligned with how you build. For Claude Code specifically: skills, custom subagents, MCP, and hooks have their own conventions under conventions/claude-code/.',
  },
];

export function GetStarted() {
  return (
    <Section id="get-started">
      <Eyebrow>Get started</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight">Three steps.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        No CLI to install. No config to maintain. Just markdown an agent can read.
      </p>

      <ol className="mt-10 space-y-8">
        {steps.map((step) => (
          <li key={step.number} className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-8">
            <div className="font-mono text-3xl font-semibold text-accent">{step.number}</div>
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
        <Button href="https://github.com/balbonits/city-app-framework" external>
          <Github size={16} aria-hidden />
          View on GitHub
          <ArrowRight size={16} aria-hidden />
        </Button>
        <Button
          href="https://github.com/balbonits/city-app-framework/blob/main/AGENTS.md"
          variant="secondary"
          external
        >
          Read AGENTS.md
        </Button>
      </div>
    </Section>
  );
}

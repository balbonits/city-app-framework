import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

interface RuleGroup {
  title: string;
  description: string;
  bullets: string[];
  link: { href: string; label: string };
}

const groups: RuleGroup[] = [
  {
    title: 'Anti-overengineering',
    description:
      'Build exactly what was asked. Stop at working. Three patterns before abstracting. Suggest improvements as text — never implement them silently.',
    bullets: [
      'Build exactly what\'s asked for. No bonus features.',
      'Stop at working. Don\'t add polish that wasn\'t requested.',
      'Abstract only after 3+ identical patterns exist.',
      'Suggest adjacent improvements; don\'t implement them.',
    ],
    link: {
      href: 'https://github.com/balbonits/city-app-framework/blob/main/conventions/anti-overengineering.md',
      label: 'conventions/anti-overengineering.md',
    },
  },
  {
    title: 'Ask vs proceed',
    description:
      'A concrete table that tells an agent when to escalate to the human and when to act autonomously. No more "should I ask?" tax on every decision.',
    bullets: [
      'ASK: new dependency, scope change, irreversible op, architectural choice, prod deploy.',
      'PROCEED: bug fix, lint/build/test, file moves, doc edits, existing patterns.',
      'When in doubt, ask. Cost of asking is one round-trip.',
      'Escalation format includes options + recommendation, not "what should I do?"',
    ],
    link: {
      href: 'https://github.com/balbonits/city-app-framework/blob/main/conventions/escalation.md',
      label: 'conventions/escalation.md',
    },
  },
  {
    title: 'Decision patterns',
    description:
      'Recurring tradeoffs with strong defaults the agent can follow without asking. Defaults can be overridden — but they\'re documented, not invented from scratch every project.',
    bullets: [
      'User perception vs technical simplicity',
      'Engine vs vanilla (games)',
      'Good enough vs perfect',
      'Build vs buy',
      'Optimize now vs later',
    ],
    link: {
      href: 'https://github.com/balbonits/city-app-framework/tree/main/decision-patterns',
      label: 'decision-patterns/',
    },
  },
  {
    title: 'Engineering practices',
    description:
      'Testing, CI/CD, DevOps, and releases for AI-built code. Evidence-based with primary-source citations (Anthropic, Google SRE, Meta Engineering, Kent Beck, peer-reviewed papers). Documents what AI gets wrong and how to catch it.',
    bullets: [
      'Testing: property-based + mutation testing for AI blind spots',
      'CI/CD: pin actions to SHA, concurrency cancels, AI review never blocks merge',
      'DevOps: OTel GenAI conventions, sandbox isolation, cost controls',
      'Releases: git-cliff, trunk-based, accurate AI co-author attribution',
    ],
    link: {
      href: 'https://github.com/balbonits/city-app-framework/blob/main/conventions/testing.md',
      label: 'conventions/{testing,ci-cd,devops,releases}.md',
    },
  },
  {
    title: 'Claude Code primitives',
    description:
      'When and how to use Claude Code\'s five extensibility primitives — skills, custom subagents, MCP servers, hooks, plugins. Each doc flags what NOT to convert (most conventions stay as markdown, not skills). Subfolder pattern matches conventions/ui-design/.',
    bullets: [
      'Skills: load-on-trigger procedures, not always-loaded reference',
      'Custom subagents: when isolation is the point',
      'MCP servers: 3 deployment models; recommended servers per stack',
      'Hooks: load-bearing for blocking, theater for guidance',
    ],
    link: {
      href: 'https://github.com/balbonits/city-app-framework/tree/main/conventions/claude-code',
      label: 'conventions/claude-code/',
    },
  },
];

export function Rules() {
  return (
    <Section id="rules">
      <Eyebrow>What's encoded</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight">The rules.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        Five groups. Operational rules with worked examples. Strong defaults — overridable when the
        project demands it. Engineering practices and Claude Code primitive guidance are evidence-based
        with primary-source citations.
      </p>

      <div className="mt-10 space-y-6">
        {groups.map((group) => (
          <article
            key={group.title}
            className="rounded-lg border border-border-DEFAULT bg-surface p-6"
          >
            <h3 className="text-xl font-semibold">{group.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{group.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-fg">
              {group.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <a
              href={group.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block font-mono text-sm text-accent hover:text-accent-hover"
            >
              → {group.link.label}
            </a>
          </article>
        ))}
      </div>

      <VisualRules />
    </Section>
  );
}

function VisualRules() {
  return (
    <div className="mt-16">
      <p className="mb-6 font-mono text-sm uppercase tracking-wider text-fg-faint">
        Three rules, made visible
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <RuleDemo
          rule="Hierarchy via contrast"
          file="conventions/ui-design/hierarchy.md"
          before={<HierarchyBefore />}
          after={<HierarchyAfter />}
        />
        <RuleDemo
          rule="Buttons get five states"
          file="conventions/ui-design/states-feedback.md"
          before={<ButtonsBefore />}
          after={<ButtonsAfter />}
        />
        <RuleDemo
          rule="Semantic > brand for status"
          file="conventions/ui-design/color.md"
          before={<ChipsBefore />}
          after={<ChipsAfter />}
        />
      </div>
    </div>
  );
}

function RuleDemo({
  rule,
  file,
  before,
  after,
}: {
  rule: string;
  file: string;
  before: React.ReactNode;
  after: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-border-DEFAULT bg-surface p-5">
      <h4 className="text-base font-semibold text-fg-strong">{rule}</h4>
      <p className="mt-1 font-mono text-sm text-fg-muted">{file}</p>
      <div className="mt-4 grid gap-3">
        <div>
          <p className="mb-1.5 font-mono text-sm uppercase tracking-wider text-fg-faint">Before</p>
          <div className="rounded border border-border-faint bg-bg p-3">{before}</div>
        </div>
        <div>
          <p className="mb-1.5 font-mono text-sm uppercase tracking-wider text-accent">After</p>
          <div className="rounded border border-border-faint bg-bg p-3">{after}</div>
        </div>
      </div>
    </article>
  );
}

/* Hierarchy demos: same content, with vs without size/position/color contrast */

function HierarchyBefore() {
  return (
    <div className="space-y-1 text-base text-fg">
      <p>Pro plan</p>
      <p>$29/month</p>
      <p>Unlimited links, custom domains, team access</p>
    </div>
  );
}

function HierarchyAfter() {
  return (
    <div>
      <p className="text-sm text-fg-muted">Pro plan</p>
      <p className="text-xl font-semibold text-fg-strong">$29/month</p>
      <p className="mt-1 text-sm text-fg-muted">
        Unlimited links, custom domains, team access
      </p>
    </div>
  );
}

/* Button states demos: hover-only vs full state coverage */

function ButtonsBefore() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-contrast"
      >
        Save
      </button>
      <span className="font-mono text-sm text-fg-muted">hover only</span>
    </div>
  );
}

function ButtonsAfter() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">Save</Button>
      <Button size="sm" loading>
        Save
      </Button>
      <Button size="sm" disabled>
        Save
      </Button>
    </div>
  );
}

/* Chip demos: brand-only colors vs semantic colors */

function ChipsBefore() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full border border-border-DEFAULT bg-accent/15 px-2.5 py-0.5 text-sm font-medium text-accent">
        Live
      </span>
      <span className="rounded-full border border-border-DEFAULT bg-accent/15 px-2.5 py-0.5 text-sm font-medium text-accent">
        Failed
      </span>
      <span className="rounded-full border border-border-DEFAULT bg-accent/15 px-2.5 py-0.5 text-sm font-medium text-accent">
        Pending
      </span>
    </div>
  );
}

function ChipsAfter() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip tone="success">Live</Chip>
      <Chip tone="danger">Failed</Chip>
      <Chip tone="warning">Pending</Chip>
    </div>
  );
}

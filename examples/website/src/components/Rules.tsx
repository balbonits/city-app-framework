import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';

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
];

export function Rules() {
  return (
    <Section id="rules">
      <Eyebrow>What's encoded</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">The rules.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        Three groups of rules. Each one is short, operational, and lives next to a worked example.
        Strong defaults — overridable when the project demands it.
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
              className="mt-5 inline-block font-mono text-xs text-accent hover:text-accent-hover"
            >
              → {group.link.label}
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}

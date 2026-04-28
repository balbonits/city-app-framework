import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';

export function Problem() {
  return (
    <Section id="problem">
      <Eyebrow>The problem</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Stateless agents, first-prompt forever.
      </h2>
      <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-fg-muted">
        <p>
          AI coding agents don't remember how you built last time. Every project is "first prompt"
          again. Without a baked-in answer to{' '}
          <em className="text-fg">
            "how does this person structure code, name files, escalate decisions, weigh tradeoffs?"
          </em>{' '}
          — the agent guesses. And guesses differently each time.
        </p>
        <p>
          One AI generates one shape. A second AI generates a different shape. Three months in, the
          codebase has three voices. Reviews catch some of it. The rest becomes drift.
        </p>
        <p className="text-fg">
          The fix isn't a smarter agent. It's giving the agent a persistent foundation to read at
          session start.
        </p>
      </div>
    </Section>
  );
}

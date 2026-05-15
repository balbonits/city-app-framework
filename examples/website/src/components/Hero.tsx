import { ArrowRight, Github, FileText } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto w-full max-w-4xl px-6 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-20"
    >
      <Eyebrow>An operating system for AI-assisted development</Eyebrow>
      <h1 className="text-3xl font-semibold tracking-tight text-fg-strong sm:text-6xl">
        Rules AI agents read first.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
        <strong className="text-fg">city-app-framework</strong> is a slim, opinionated set of
        conventions and decision patterns that AI coding agents — Claude, Grok, others — load at
        the start of every session. Universal across projects; extensible per-stack. So you stop
        re-explaining how you build.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button href="https://github.com/balbonits/city-app-framework" external>
          <Github size={16} aria-hidden />
          View on GitHub
          <ArrowRight size={16} aria-hidden />
        </Button>
        <Button href="#problem" variant="secondary">
          Read the rules
        </Button>
      </div>

      <ProductPreview />
    </section>
  );
}

function ProductPreview() {
  return (
    <figure
      aria-label="Excerpt from the framework's AGENTS.md file"
      className="mt-14 overflow-hidden rounded-lg border border-border-DEFAULT bg-surface shadow-2xl shadow-black/30 dark:shadow-black/50"
    >
      <div className="flex items-center gap-2 border-b border-border-DEFAULT bg-surface-raised px-4 py-2.5">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-fg-faint/60" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-fg-faint/60" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-fg-faint/60" />
        <span className="ml-2 inline-flex items-center gap-1.5 font-mono text-sm text-fg-muted">
          <FileText size={13} aria-hidden />
          AGENTS.md
        </span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 text-sm leading-relaxed text-fg">
        <code>
          <span className="text-accent">## Hard rules — never violate</span>
          {'\n\n'}
          1. <span className="text-fg-strong">Build exactly what's asked for.</span> No bonus
          features.{'\n'}
          2. <span className="text-fg-strong">Stop at working.</span> Don't add polish that
          wasn't requested.{'\n'}
          3. <span className="text-fg-strong">Abstract only after 3+ identical patterns exist.</span>
          {'\n'}
          4. <span className="text-fg-strong">Ask before adding dependencies.</span>
          {'\n'}
          5. <span className="text-fg-strong">Ask before scope changes.</span>
          {'\n'}
          6. <span className="text-fg-strong">One change per response.</span>
          {'\n\n'}
          <span className="text-fg-muted">
            Detail in conventions/anti-overengineering.md.
          </span>
        </code>
      </pre>
    </figure>
  );
}

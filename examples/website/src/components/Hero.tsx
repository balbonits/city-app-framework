import { ArrowRight, Github } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto w-full max-w-4xl px-6 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-20"
    >
      <Eyebrow>An operating system for AI-assisted development</Eyebrow>
      <h1 className="text-4xl font-semibold tracking-tight text-fg-strong sm:text-6xl">
        Rules AI agents read first.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
        <strong className="text-fg">city-app-framework</strong> is a slim, opinionated set of
        conventions and decision patterns that AI coding agents — Claude, Grok, others — load at
        the start of every session. Universal across projects; extensible per-stack. So you stop
        re-explaining how you build.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-3">
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
          href="#problem"
          className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-3 text-sm font-semibold text-fg-strong transition-colors hover:bg-surface"
        >
          Read the rules
        </a>
      </div>
    </section>
  );
}

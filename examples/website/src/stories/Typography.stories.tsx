import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const sizes = [
  { className: 'text-6xl', label: 'text-6xl', px: '60px', use: 'Hero h1 (desktop)' },
  { className: 'text-3xl', label: 'text-3xl', px: '30px', use: 'Section h2 / hero h1 (mobile)' },
  { className: 'text-xl', label: 'text-xl', px: '20px', use: 'h3, hero subhead' },
  { className: 'text-lg', label: 'text-lg', px: '18px', use: 'body emphasis' },
  { className: 'text-base', label: 'text-base', px: '16px', use: 'default body' },
  { className: 'text-sm', label: 'text-sm', px: '14px', use: 'captions, eyebrows, labels' },
];

export const Scale: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Type scale</h1>
        <p className="mt-2 text-base text-fg-muted">
          Six sizes total — the limit for landing pages per the design rules. Headings inherit
          tightened letter-spacing (-2%) and line-height (1.15) globally.
        </p>
      </header>
      <ul className="divide-y divide-border-DEFAULT rounded-lg border border-border-DEFAULT bg-surface">
        {sizes.map((s) => (
          <li key={s.label} className="flex items-baseline gap-6 px-5 py-4">
            <span className="w-24 shrink-0 font-mono text-sm text-fg-muted">{s.label}</span>
            <span className="w-16 shrink-0 font-mono text-sm text-fg-faint">{s.px}</span>
            <span className={`${s.className} flex-1 truncate text-fg-strong`}>The quick brown fox</span>
            <span className="hidden w-48 shrink-0 text-sm text-fg-muted sm:block">{s.use}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const Tightening: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Header tightening</h1>
        <p className="mt-2 text-base text-fg-muted">
          The single highest-leverage typography change: large text gets letter-spacing -2% and
          line-height 1.15. Default browser values (~normal / 1.4) look loose at scale.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border-DEFAULT bg-surface p-6">
          <p className="mb-3 font-mono text-sm uppercase tracking-wider text-fg-faint">
            Default (loose)
          </p>
          <p className="text-3xl font-semibold" style={{ letterSpacing: 'normal', lineHeight: 1.4 }}>
            Rules AI agents read first.
          </p>
        </div>
        <div className="rounded-lg border-2 border-accent bg-surface p-6">
          <p className="mb-3 font-mono text-sm uppercase tracking-wider text-accent">
            Tightened (default in this site)
          </p>
          <p className="text-3xl font-semibold tracking-tight" style={{ lineHeight: 1.15 }}>
            Rules AI agents read first.
          </p>
        </div>
      </div>
    </div>
  ),
};

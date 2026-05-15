import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const spacings = [
  { token: 'gap-1 / p-1', px: '4px', use: 'inline icon offset' },
  { token: 'gap-2 / p-2', px: '8px', use: 'tight grouping (label ↔ icon)' },
  { token: 'gap-3 / p-3', px: '12px', use: 'related items in a row' },
  { token: 'gap-4 / p-4', px: '16px', use: 'card interior padding' },
  { token: 'gap-6 / p-6', px: '24px', use: 'card → card horizontal' },
  { token: 'gap-8 / p-8', px: '32px', use: 'default item gap (vertical)' },
  { token: 'py-20 / py-28', px: '80px / 112px', use: 'section vertical padding' },
];

export const Scale: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Spacing scale</h1>
        <p className="mt-2 text-base text-fg-muted">
          4-point grid. Every value is a multiple of 4 — halves cleanly, scales consistently. Section
          gaps exceed the 64px threshold per the layout rules.
        </p>
      </header>
      <ul className="divide-y divide-border-DEFAULT rounded-lg border border-border-DEFAULT bg-surface">
        {spacings.map((s) => (
          <li key={s.token} className="flex items-center gap-6 px-5 py-4">
            <span className="w-32 shrink-0 font-mono text-sm text-fg-strong">{s.token}</span>
            <span className="w-24 shrink-0 font-mono text-sm text-fg-muted">{s.px}</span>
            <div className="flex-1">
              <div
                aria-hidden
                className="h-3 rounded bg-accent"
                style={{ width: s.px.split(' ')[0] }}
              />
            </div>
            <span className="hidden w-56 shrink-0 text-sm text-fg-muted sm:block">{s.use}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Color',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

interface Swatch {
  name: string;
  cssVar: string;
  note?: string;
}

const surfaces: Swatch[] = [
  { name: 'bg', cssVar: '--color-bg', note: 'page background' },
  { name: 'surface', cssVar: '--color-surface', note: 'cards, sections' },
  { name: 'surface-raised', cssVar: '--color-surface-raised', note: 'popovers, raised cards' },
];

const text: Swatch[] = [
  { name: 'fg-strong', cssVar: '--color-fg-strong', note: 'headings' },
  { name: 'fg', cssVar: '--color-fg', note: 'body' },
  { name: 'fg-muted', cssVar: '--color-fg-muted', note: 'subtext, captions' },
  { name: 'fg-faint', cssVar: '--color-fg-faint', note: 'placeholders, disabled' },
];

const accent: Swatch[] = [
  { name: 'accent', cssVar: '--color-accent', note: 'brand: primary CTA, links' },
  { name: 'accent-hover', cssVar: '--color-accent-hover', note: 'brand: hover state' },
];

const semantic: Swatch[] = [
  { name: 'success', cssVar: '--color-success', note: 'green — completion, deployed' },
  { name: 'danger', cssVar: '--color-danger', note: 'red — destructive, error' },
  { name: 'warning', cssVar: '--color-warning', note: 'yellow — caution, pending' },
  { name: 'info', cssVar: '--color-info', note: 'blue — informational, new' },
];

const borders: Swatch[] = [
  { name: 'border-faint', cssVar: '--color-border-faint' },
  { name: 'border', cssVar: '--color-border' },
  { name: 'border-strong', cssVar: '--color-border-strong' },
];

function Group({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-fg-faint">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {swatches.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-4 rounded-md border border-border-DEFAULT bg-surface p-3"
          >
            <div
              aria-hidden
              className="h-12 w-12 shrink-0 rounded border border-border-faint"
              style={{ background: `var(${s.cssVar})` }}
            />
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold text-fg-strong">{s.name}</p>
              <p className="font-mono text-sm text-fg-muted">{s.cssVar}</p>
              {s.note ? <p className="mt-0.5 text-sm text-fg-muted">{s.note}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl space-y-10 p-8">
      <Group title="Surfaces" swatches={surfaces} />
      <Group title="Text" swatches={text} />
      <Group title="Accent (brand)" swatches={accent} />
      <Group title="Semantic" swatches={semantic} />
      <Group title="Borders" swatches={borders} />
    </div>
  ),
};

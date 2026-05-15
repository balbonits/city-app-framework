import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Mail } from 'lucide-react';

interface Swatch {
  name: string;
  cssVar: string;
}

const surfaces: Swatch[] = [
  { name: 'bg', cssVar: '--color-bg' },
  { name: 'surface', cssVar: '--color-surface' },
  { name: 'surface-raised', cssVar: '--color-surface-raised' },
];

const text: Swatch[] = [
  { name: 'fg-strong', cssVar: '--color-fg-strong' },
  { name: 'fg', cssVar: '--color-fg' },
  { name: 'fg-muted', cssVar: '--color-fg-muted' },
  { name: 'fg-faint', cssVar: '--color-fg-faint' },
];

const semantic: Swatch[] = [
  { name: 'success', cssVar: '--color-success' },
  { name: 'danger', cssVar: '--color-danger' },
  { name: 'warning', cssVar: '--color-warning' },
  { name: 'info', cssVar: '--color-info' },
];

export function DesignSystem() {
  return (
    <Section id="design-system">
      <Eyebrow>Design system</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight">The rules, made visible.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        Every primitive on this page is built from the same tokens described in{' '}
        <code className="rounded bg-[var(--color-code-bg)] px-1.5 py-0.5 font-mono text-base">
          conventions/ui-design/
        </code>
        . The site dogfoods its own design rules.
      </p>

      <div className="mt-12 space-y-12">
        <Subsection title="Color tokens">
          <SwatchRow label="Surfaces" swatches={surfaces} />
          <SwatchRow label="Text" swatches={text} />
          <SwatchRow label="Semantic" swatches={semantic} />
        </Subsection>

        <Subsection title="Buttons (all five states)">
          <div className="space-y-4">
            {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
              <div
                key={variant}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border-DEFAULT bg-surface p-4"
              >
                <span className="w-20 font-mono text-sm text-fg-muted">{variant}</span>
                <Button variant={variant}>Default</Button>
                <Button variant={variant} loading>
                  Loading
                </Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
              </div>
            ))}
          </div>
        </Subsection>

        <Subsection title="Inputs (all five states)">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Default" placeholder="jane@example.com" />
            <Input
              label="With hint"
              placeholder="jane@example.com"
              hint="We'll never share it."
              leadingIcon={<Mail size={16} aria-hidden />}
            />
            <Input
              label="Error"
              defaultValue="not-an-email"
              error="Enter a valid email address."
            />
            <Input
              label="Warning"
              defaultValue="jane@example"
              warning="Did you mean jane@example.com?"
            />
            <Input label="Disabled" defaultValue="jane@example.com" disabled />
          </div>
        </Subsection>

        <Subsection title="Semantic chips">
          <div className="flex flex-wrap gap-3 rounded-lg border border-border-DEFAULT bg-surface p-4">
            <Chip>Neutral</Chip>
            <Chip tone="success">
              <CheckCircle2 size={12} aria-hidden /> Deployed
            </Chip>
            <Chip tone="danger">
              <AlertCircle size={12} aria-hidden /> Failed
            </Chip>
            <Chip tone="warning">
              <AlertTriangle size={12} aria-hidden /> Pending
            </Chip>
            <Chip tone="info">
              <Info size={12} aria-hidden /> New
            </Chip>
          </div>
          <p className="mt-3 text-sm text-fg-muted">
            Semantic colors override brand. Even when the brand is amber, destructive stays red,
            success stays green.
          </p>
        </Subsection>
      </div>
    </Section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-sm uppercase tracking-wider text-fg-faint">{title}</h3>
      {children}
    </div>
  );
}

function SwatchRow({ label, swatches }: { label: string; swatches: Swatch[] }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-sm text-fg-muted">{label}</p>
      <div className="flex flex-wrap gap-3">
        {swatches.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-md border border-border-DEFAULT bg-surface px-3 py-2"
          >
            <span
              aria-hidden
              className="h-6 w-6 rounded border border-border-faint"
              style={{ background: `var(${s.cssVar})` }}
            />
            <span className="font-mono text-sm text-fg">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

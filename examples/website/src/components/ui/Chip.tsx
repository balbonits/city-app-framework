import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

interface ChipProps {
  children: ReactNode;
  tone?: Tone;
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-surface-raised text-fg-muted border-border-DEFAULT',
  success:
    'bg-[color-mix(in_oklch,var(--color-success)_15%,transparent)] text-[var(--color-success)] border-[color-mix(in_oklch,var(--color-success)_30%,transparent)]',
  danger:
    'bg-[color-mix(in_oklch,var(--color-danger)_15%,transparent)] text-[var(--color-danger)] border-[color-mix(in_oklch,var(--color-danger)_30%,transparent)]',
  warning:
    'bg-[color-mix(in_oklch,var(--color-warning)_15%,transparent)] text-[var(--color-warning)] border-[color-mix(in_oklch,var(--color-warning)_30%,transparent)]',
  info:
    'bg-[color-mix(in_oklch,var(--color-info)_15%,transparent)] text-[var(--color-info)] border-[color-mix(in_oklch,var(--color-info)_30%,transparent)]',
};

export function Chip({ children, tone = 'neutral' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-medium ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
}

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <p className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-accent">
      <span aria-hidden="true">§ </span>
      {children}
    </p>
  );
}

import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-4xl px-6 py-20 sm:px-8 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

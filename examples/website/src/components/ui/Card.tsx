import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  raised?: boolean;
  className?: string;
}

export function Card({ children, raised = false, className = '' }: CardProps) {
  const surface = raised ? 'bg-surface-raised' : 'bg-surface';
  return (
    <div className={`rounded-lg border border-border-DEFAULT ${surface} p-6 ${className}`}>
      {children}
    </div>
  );
}

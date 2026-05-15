import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  warning?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const stateBorder = {
  default: 'border-border-strong focus-within:border-accent',
  error: 'border-[var(--color-danger)] focus-within:border-[var(--color-danger)]',
  warning: 'border-[var(--color-warning)] focus-within:border-[var(--color-warning)]',
};

const stateMessage = {
  default: 'text-fg-muted',
  error: 'text-[var(--color-danger)]',
  warning: 'text-[var(--color-warning)]',
};

export function Input({
  label,
  hint,
  error,
  warning,
  leadingIcon,
  trailingIcon,
  id,
  disabled,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const state: keyof typeof stateBorder = error ? 'error' : warning ? 'warning' : 'default';
  const message = error || warning || hint;
  const messageId = message ? `${inputId}-msg` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-fg-strong">
          {label}
        </label>
      ) : null}
      <div
        className={`flex items-center gap-2 rounded-md border bg-surface px-3 py-2 transition-colors ${stateBorder[state]} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {leadingIcon ? <span className="shrink-0 text-fg-muted">{leadingIcon}</span> : null}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={messageId}
          className="flex-1 bg-transparent text-base text-fg-strong placeholder:text-fg-faint focus:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {trailingIcon ? <span className="shrink-0 text-fg-muted">{trailingIcon}</span> : null}
      </div>
      {message ? (
        <p id={messageId} className={`text-sm ${stateMessage[state]}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}

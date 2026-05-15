import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

interface ButtonAsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  external?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: undefined;
  'aria-label'?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-contrast hover:bg-accent-hover active:brightness-95 disabled:opacity-50 disabled:hover:bg-accent disabled:cursor-not-allowed',
  secondary:
    'border border-border-strong text-fg-strong hover:bg-surface active:bg-surface-raised disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed',
  ghost:
    'text-fg-muted hover:bg-surface hover:text-fg-strong active:bg-surface-raised disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed',
};

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors';

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
  } = props;

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  const content = loading ? <Spinner /> : children;

  if ('href' in props && props.href) {
    const { disabled, href, external } = props;
    const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <a
        href={disabled ? undefined : href}
        onClick={disabled ? undefined : props.onClick}
        aria-disabled={disabled || loading || undefined}
        aria-label={props['aria-label']}
        className={classes}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  const {
    children: _c,
    variant: _v,
    size: _s,
    loading: _l,
    type = 'button',
    disabled,
    ...rest
  } = props as ButtonAsButton;
  void _c;
  void _v;
  void _s;
  void _l;
  return (
    <button type={type} disabled={disabled || loading} className={classes} {...rest}>
      {content}
    </button>
  );
}

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

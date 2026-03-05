import React, { useCallback } from 'react';
import styles from './Link.module.css';
import { cn } from '@/lib/utils';
import type { LinkProps } from './types';

// Re-export types
export type { LinkProps, LinkVariant } from './types';

export function Link({
  href,
  variant = 'default',
  openNewTab = false,
  disabled = false,
  onClick,
  children,
  className,
  style,
  target,
  rel,
  ...props
}: LinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    },
    [disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLAnchorElement>);
      }
    },
    [disabled, onClick]
  );

  const finalTarget = openNewTab ? '_blank' : target;
  const finalRel = openNewTab ? (rel || 'noopener noreferrer') : rel;

  return (
    <a
      href={disabled ? undefined : href}
      target={finalTarget}
      rel={finalRel}
      className={cn(
        styles.link,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        className
      )}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

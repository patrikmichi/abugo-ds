import React, { useCallback } from 'react';
import styles from './Link.module.css';
import { cn } from '@/lib/utils';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** The destination URL */
  href: string;
  /** Link variant */
  variant?: 'default' | 'secondary';
  /** Whether the link opens in a new browser tab */
  openNewTab?: boolean;
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Children - link text content */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Link Component
 * 
 * Link component for navigating users to different locations.
 * Matches Atlassian Design System's Link API.
 * 
 * @example
 * ```tsx
 * <Link href="https://example.com" openNewTab>
 *   External Link
 * </Link>
 * <Link href="/internal" onClick={handleClick}>
 *   Internal Link
 * </Link>
 * ```
 */
export function Link({
  href,
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
        onClick?.(e as any);
      }
    },
    [disabled, onClick]
  );

  // Determine target and rel attributes
  const finalTarget = openNewTab ? '_blank' : target;
  const finalRel = openNewTab
    ? rel || 'noopener noreferrer'
    : rel;

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

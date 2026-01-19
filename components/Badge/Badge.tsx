import React from 'react';
import styles from './Badge.module.css';
import { cn } from '@/lib/utils';

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'promo';
export type BadgeSize = 'default' | 'small';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Number to show in badge */
  count?: number;
  /** Show a red dot instead of count */
  dot?: boolean;
  /** Maximum number to show before showing overflow (e.g., 99+) */
  overflowCount?: number;
  /** Whether to show badge when count is 0 */
  showZero?: boolean;
  /** Status dot with predefined colors */
  status?: BadgeStatus;
  /** Color variant for badge (count/dot mode) */
  variant?: BadgeVariant;
  /** Text to display next to status dot */
  text?: React.ReactNode;
  /** Size of badge */
  size?: BadgeSize;
  /** Title text for badge (tooltip) */
  title?: string;
  /** Children - element to attach badge to */
  children?: React.ReactNode;
}

/**
 * Badge component - Display count, dot, or status indicator
 * 
 * Badge component:
 * - Count badge with overflow support
 * - Dot indicator
 * - Status indicator with text
 * 
 * @example
 * ```tsx
 * // Count badge
 * <Badge count={5}>
 *   <Button>Notifications</Button>
 * </Badge>
 * 
 * // Dot badge
 * <Badge dot>
 *   <Button>Messages</Button>
 * </Badge>
 * 
 * // Status badge
 * <Badge status="success" text="Online" />
 * 
 * // Standalone count
 * <Badge count={99} />
 * 
 * // Color variants
 * <Badge count={5} variant="success" />
 * <Badge count={3} variant="warning" />
 * <Badge count={1} variant="danger" />
 * <Badge count={10} variant="promo" />
 * ```
 */
export function Badge({
  count,
  dot = false,
  overflowCount = 99,
  showZero = false,
  status,
  variant,
  text,
  size = 'default',
  title,
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  // Determine if badge should be shown
  const shouldShowCount = count !== undefined && (showZero || count > 0);
  const shouldShowDot = dot && !status;
  const shouldShowStatus = !!status;
  const hasBadge = shouldShowCount || shouldShowDot || shouldShowStatus;
  const hasChildren = !!children;

  // Calculate count display
  const displayCount = shouldShowCount
    ? count! > overflowCount
      ? `${overflowCount}+`
      : count!.toString()
    : '';

  // If status mode, render differently
  if (shouldShowStatus) {
    return (
      <span
        className={cn(styles.badgeWrapper, className)}
        style={style}
        {...props}
      >
        <span
          className={cn(
            styles.statusDot,
            styles[status],
            size === 'small' && styles.small
          )}
        />
        {text && <span className={styles.statusText}>{text}</span>}
        {children}
      </span>
    );
  }

  // If no children, render standalone badge
  if (!hasChildren) {
    if (shouldShowCount || shouldShowDot) {
      return (
        <span
          className={cn(
            styles.badge,
            shouldShowDot && styles.dot,
            shouldShowCount && !shouldShowDot && styles.count,
            size === 'small' && styles.small,
            variant && styles[variant],
            className
          )}
          style={{
            position: 'static',
            transform: 'none',
            display: 'inline-flex',
            ...style,
          }}
          title={title || (shouldShowCount ? displayCount : undefined)}
          {...props}
        >
          {shouldShowCount && !shouldShowDot && displayCount}
        </span>
      );
    }
    return null;
  }

  // Wrapper mode with children
  return (
    <span
      className={cn(styles.badgeWrapper, className)}
      style={style}
      {...props}
    >
      {children}
      {hasBadge && (
        <span
          className={cn(
            styles.badge,
            shouldShowDot && styles.dot,
            shouldShowCount && !shouldShowDot && styles.count,
            size === 'small' && styles.small,
            !shouldShowCount && shouldShowDot && styles.dotOnly,
            variant && styles[variant]
          )}
          title={title || (shouldShowCount ? displayCount : undefined)}
        >
          {shouldShowCount && !shouldShowDot && displayCount}
        </span>
      )}
    </span>
  );
}

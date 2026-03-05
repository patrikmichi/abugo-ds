import { cn } from '@/lib/utils';

import styles from './Badge.module.css';
import type { IProps } from './types';

const Badge = ({
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
}: IProps) => {
  const shouldShowCount = count !== undefined && (showZero || count > 0);
  const shouldShowDot = dot && !status;
  const shouldShowStatus = !!status;
  const hasBadge = shouldShowCount || shouldShowDot || shouldShowStatus;
  const hasChildren = !!children;

  const displayCount = shouldShowCount
    ? count! > overflowCount
      ? `${overflowCount}+`
      : count!.toString()
    : '';

  const isSingleDigit = displayCount.length === 1;

  // Status mode
  if (shouldShowStatus) {
    return (
      <span className={cn(styles.badgeWrapper, className)} style={style} {...props}>
        <span className={cn(styles.statusDot, styles[status], size === 'small' && styles.small)} />
        {text && <span className={styles.statusText}>{text}</span>}
        {children}
      </span>
    );
  }

  // Standalone badge (no children)
  if (!hasChildren) {
    if (!shouldShowCount && !shouldShowDot) return null;

    return (
      <span
        className={cn(
          styles.badge,
          shouldShowDot && styles.dot,
          shouldShowCount && !shouldShowDot && styles.count,
          isSingleDigit && styles.singleDigit,
          size === 'small' && styles.small,
          variant && styles[variant],
          className
        )}
        style={{ position: 'static', transform: 'none', display: 'inline-flex', ...style }}
        title={title || (shouldShowCount ? displayCount : undefined)}
        {...props}
      >
        {shouldShowCount && !shouldShowDot && displayCount}
      </span>
    );
  }

  // Wrapper mode with children
  return (
    <span className={cn(styles.badgeWrapper, className)} style={style} {...props}>
      {children}
      {hasBadge && (
        <span
          className={cn(
            styles.badge,
            shouldShowDot && styles.dot,
            shouldShowCount && !shouldShowDot && styles.count,
            isSingleDigit && styles.singleDigit,
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
};

export default Badge;

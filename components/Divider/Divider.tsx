import styles from './Divider.module.css';
import { cn } from '@/lib/utils';
import type { DividerProps } from './types';

const orientationClasses = {
  left: styles.orientationLeft,
  right: styles.orientationRight,
  center: styles.orientationCenter,
} as const;

export function Divider({
  type = 'horizontal',
  dashed = false,
  orientation = 'center',
  plain = false,
  className,
  children,
  ...props
}: DividerProps) {
  const hasText = !!children;

  if (type === 'vertical') {
    return (
      <span
        className={cn(styles.divider, styles.vertical, className)}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        styles.divider,
        styles.horizontal,
        dashed && styles.dashed,
        hasText && styles.withText,
        hasText && orientationClasses[orientation],
        plain && styles.plain,
        className
      )}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    >
      {hasText && (
        <span className={cn(styles.text, plain && styles.plainText)}>
          {children}
        </span>
      )}
    </div>
  );
}

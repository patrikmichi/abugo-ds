import React from 'react';
import styles from './Divider.module.css';
import { cn } from '@/lib/utils';

export type DividerType = 'horizontal' | 'vertical';
export type DividerOrientation = 'left' | 'right' | 'center';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Divider type */
  type?: DividerType;
  /** Dashed style */
  dashed?: boolean;
  /** Text orientation */
  orientation?: DividerOrientation;
  /** Plain text style */
  plain?: boolean;
  /** Custom class name */
  className?: string;
  /** Children (text content) */
  children?: React.ReactNode;
}

/**
 * Divider Component
 * 
 * Divider component. 
 * 
 * @example
 * ```tsx
 * <Divider />
 * <Divider type="vertical" />
 * <Divider dashed>Text</Divider>
 * ```
 */
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
        className={cn(
          styles.divider,
          styles.vertical,
          className
        )}
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
        hasText && styles[`orientation${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`],
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

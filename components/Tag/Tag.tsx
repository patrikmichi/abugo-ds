import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import styles from './Tag.module.css';
import type { IProps } from './types';

const sizeMap = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;

const variantMap = {
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
} as const;

const Tag = forwardRef<HTMLSpanElement, IProps>(
  function Tag(
    { variant = 'neutral', color, size = 'md', icon, children, className, style, ...props },
    ref
  ) {
    const customColorStyle = color
      ? {
          ...style,
          '--tag-bg': `color-mix(in srgb, ${color} 15%, transparent)`,
          '--tag-fg': color,
          '--tag-border': `color-mix(in srgb, ${color} 30%, transparent)`,
        } as React.CSSProperties
      : style;

    return (
      <span
        ref={ref}
        className={cn(
          styles.tag,
          sizeMap[size],
          !color && variantMap[variant],
          className
        )}
        style={customColorStyle}
        {...props}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
    );
  }
);

export default Tag;

import React from 'react';
import styles from './Badge.module.css';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        styles.badge,
        variant === 'default' && styles.default,
        variant === 'success' && styles.success,
        variant === 'warning' && styles.warning,
        variant === 'danger' && styles.danger,
        variant === 'info' && styles.info,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

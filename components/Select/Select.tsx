import React from 'react';
import styles from './Select.module.css';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'enabled' | 'error' | 'disabled';
}

export function Select({
  size = 'md',
  status = 'enabled',
  className,
  disabled,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        styles.select,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        status === 'error' && styles.error,
        (status === 'disabled' || disabled) && styles.disabled,
        className
      )}
      disabled={disabled || status === 'disabled'}
      {...props}
    >
      {children}
    </select>
  );
}

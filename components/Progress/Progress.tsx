import React from 'react';
import styles from './Progress.module.css';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'error';
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant = 'default',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn(styles.progress, className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div
        className={cn(
          styles.fill,
          variant === 'default' && styles.default,
          variant === 'success' && styles.success,
          variant === 'error' && styles.error
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'enabled' | 'error' | 'disabled';
}

export function Input({
  size = 'md',
  status = 'enabled',
  className,
  ...props
}: InputProps) {
  return (
    <input
      type="text"
      className={cn(
        styles.input,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        status === 'error' && styles.error,
        status === 'disabled' && styles.disabled,
        className
      )}
      disabled={status === 'disabled'}
      {...props}
    />
  );
}

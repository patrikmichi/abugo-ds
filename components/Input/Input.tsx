import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field has a validation error */
  error?: boolean;
  /** Leading adornment (e.g., icon on the left) */
  leadingAdornment?: React.ReactNode;
  /** Trailing adornment (e.g., icon on the right) */
  trailingAdornment?: React.ReactNode;
}

export function Input({
  size = 'md',
  error = false,
  className,
  disabled,
  leadingAdornment,
  trailingAdornment,
  ...props
}: InputProps) {
  return (
    <div 
      className={cn(
        styles.inputWrapper,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        leadingAdornment && styles.hasLeading,
        trailingAdornment && styles.hasTrailing,
        className
      )}
    >
      {leadingAdornment && (
        <div className={styles.leadingAdornment}>
          {leadingAdornment}
        </div>
      )}
      <input
        type="text"
        className={cn(
          styles.input,
          size === 'sm' && styles.sm,
          size === 'md' && styles.md,
          size === 'lg' && styles.lg,
          error && styles.error,
          disabled && styles.disabled
        )}
        disabled={disabled}
        {...props}
      />
      {trailingAdornment && (
        <div className={styles.trailingAdornment}>
          {trailingAdornment}
        </div>
      )}
    </div>
  );
}

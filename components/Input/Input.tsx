import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'enabled' | 'error' | 'disabled';
  /** Leading adornment (e.g., icon on the left) */
  leadingAdornment?: React.ReactNode;
  /** Trailing adornment (e.g., icon on the right) */
  trailingAdornment?: React.ReactNode;
}

export function Input({
  size = 'md',
  status = 'enabled',
  className,
  disabled,
  leadingAdornment,
  trailingAdornment,
  ...props
}: InputProps) {
  // Determine final status: prioritize status prop, but also check disabled prop
  const finalStatus: 'enabled' | 'disabled' | 'error' = 
    disabled || status === 'disabled' ? 'disabled' :
    status === 'error' ? 'error' :
    'enabled';
  const isDisabled = finalStatus === 'disabled' || disabled;
  
  return (
    <div 
      className={cn(
        styles.inputWrapper,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        leadingAdornment && styles.hasLeading,
        trailingAdornment && styles.hasTrailing
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
          finalStatus === 'error' && styles.error,
          finalStatus === 'disabled' && styles.disabled,
          className
        )}
        disabled={isDisabled}
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

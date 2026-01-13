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
  disabled,
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
        size === 'lg' && styles.lg
      )}
    >
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
    </div>
  );
}

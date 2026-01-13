import React from 'react';
import styles from './Textarea.module.css';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'enabled' | 'error' | 'disabled';
}

export function Textarea({
  size = 'md',
  status = 'enabled',
  className,
  disabled,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        styles.textarea,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        status === 'error' && styles.error,
        (status === 'disabled' || disabled) && styles.disabled,
        className
      )}
      disabled={disabled || status === 'disabled'}
      {...props}
    />
  );
}

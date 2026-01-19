import React from 'react';
import styles from './Textarea.module.css';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The size of the textarea */
  size?: 'sm' | 'md' | 'lg';
  /** Set validation status. When used with Field wrapper, Field manages this automatically. */
  error?: boolean;
  /** Whether the textarea is disabled */
  disabled?: boolean;
}

export function Textarea({
  size = 'md',
  error = false,
  className,
  disabled,
  ...props
}: TextareaProps) {
  return (
    <div className={styles.textareaWrapper}>
      <textarea
        className={cn(
          styles.textarea,
          size === 'sm' && styles.sm,
          size === 'md' && styles.md,
          size === 'lg' && styles.lg,
          error && styles.error,
          disabled && styles.disabled,
          className
        )}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}

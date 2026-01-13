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
  // Determine final status: prioritize status prop, but also check disabled prop
  const finalStatus: 'enabled' | 'disabled' | 'error' = 
    disabled || status === 'disabled' ? 'disabled' :
    status === 'error' ? 'error' :
    'enabled';
  const isDisabled = finalStatus === 'disabled' || disabled;
  
  return (
    <textarea
      className={cn(
        styles.textarea,
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
  );
}

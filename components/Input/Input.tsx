import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  /** The size of the input box */
  size?: 'sm' | 'md' | 'lg';
  /** Set validation status. When used with Field wrapper, Field manages this automatically. */
  error?: boolean;
  /** Prefix icon or content inside the input, positioned before the user's input */
  prefix?: React.ReactNode;
  /** Suffix icon or content inside the input, positioned after the user's input */
  suffix?: React.ReactNode;
  /** Addon element before (to the left of) the input field */
  addonBefore?: React.ReactNode;
  /** Addon element after (to the right of) the input field */
  addonAfter?: React.ReactNode;
  /** Callback when Enter key is pressed */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Input({
  size = 'md',
  error = false,
  className,
  disabled,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  onPressEnter,
  onKeyDown,
  ...props
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onPressEnter) {
      onPressEnter(e);
    }
    onKeyDown?.(e);
  };

  const inputElement = (
    <div 
      className={cn(
        styles.inputWrapper,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        prefix ? styles.hasPrefix : undefined,
        suffix ? styles.hasSuffix : undefined,
        className
      )}
    >
      {prefix && (
        <div className={styles.prefix}>
          {prefix}
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
        onKeyDown={handleKeyDown}
        {...props}
      />
      {suffix && (
        <div className={styles.suffix}>
          {suffix}
        </div>
      )}
    </div>
  );

  // If addons are present, wrap in addon container
  if (addonBefore || addonAfter) {
    return (
      <div className={cn(styles.addonWrapper, size === 'sm' && styles.sm, size === 'md' && styles.md, size === 'lg' && styles.lg)}>
        {addonBefore && (
          <div className={styles.addonBefore}>
            {addonBefore}
          </div>
        )}
        {inputElement}
        {addonAfter && (
          <div className={styles.addonAfter}>
            {addonAfter}
          </div>
        )}
      </div>
    );
  }

  return inputElement;
}

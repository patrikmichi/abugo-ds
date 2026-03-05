import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';
import type { InputProps } from './types';

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
    if (e.key === 'Enter') onPressEnter?.(e);
    onKeyDown?.(e);
  };

  const hasPrefix = !!prefix;
  const hasSuffix = !!suffix;
  const hasAddonBefore = !!addonBefore;
  const hasAddonAfter = !!addonAfter;
  const hasAddons = hasAddonBefore || hasAddonAfter;

  const inputElement = (
    <div
      className={cn(
        styles.inputWrapper,
        styles[size],
        hasPrefix && styles.hasPrefix,
        hasSuffix && styles.hasSuffix,
        hasAddonBefore && styles.hasAddonBefore,
        hasAddonAfter && styles.hasAddonAfter,
        !hasAddons && className
      )}
    >
      {prefix && <div className={styles.prefix}>{prefix}</div>}
      <input
        type="text"
        className={cn(
          styles.input,
          styles[size],
          error && styles.error,
          disabled && styles.disabled
        )}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {suffix && <div className={styles.suffix}>{suffix}</div>}
    </div>
  );

  if (!hasAddons) return inputElement;

  return (
    <div className={cn(styles.addonWrapper, styles[size], className)}>
      {addonBefore && <div className={styles.addonBefore}>{addonBefore}</div>}
      {inputElement}
      {addonAfter && <div className={styles.addonAfter}>{addonAfter}</div>}
    </div>
  );
}

import React from 'react';
import styles from './Toggle.module.css';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Toggle({
  label,
  className,
  checked,
  disabled,
  ...props
}: ToggleProps) {
  return (
    <label className={cn(styles.toggleWrapper, disabled && styles.disabled, className)}>
      <input
        type="checkbox"
        role="switch"
        className={cn(
          styles.toggle,
          checked && styles.on,
          !checked && styles.off,
          disabled && styles.disabled
        )}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

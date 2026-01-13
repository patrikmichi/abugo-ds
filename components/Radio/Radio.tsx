import React from 'react';
import styles from './Radio.module.css';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
}

export function Radio({
  label,
  name,
  className,
  checked,
  disabled,
  ...props
}: RadioProps) {
  return (
    <label className={cn(styles.radioWrapper, disabled && styles.disabled, className)}>
      <input
        type="radio"
        name={name}
        className={cn(
          styles.radio,
          checked && styles.checked,
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

import React from 'react';
import styles from './Checkbox.module.css';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({
  label,
  className,
  checked,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <label className={cn(styles.checkboxWrapper, disabled && styles.disabled, className)}>
      <input
        type="checkbox"
        className={cn(
          styles.checkbox,
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

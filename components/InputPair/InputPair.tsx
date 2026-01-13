import React, { useState } from 'react';
import styles from './InputPair.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

export interface InputPairProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** First input value */
  firstValue?: string;
  /** Second input value */
  secondValue?: string;
  /** First input change handler */
  onFirstChange?: (value: string) => void;
  /** Second input change handler */
  onSecondChange?: (value: string) => void;
  /** First input placeholder */
  firstPlaceholder?: string;
  /** Second input placeholder */
  secondPlaceholder?: string;
  /** ARIA label for the first input */
  firstAriaLabel?: string;
  /** ARIA label for the second input */
  secondAriaLabel?: string;
}

/**
 * InputPair component - Compound field with two inputs side by side
 * 
 * @example
 * ```tsx
 * <InputPair
 *   firstValue={firstValue}
 *   secondValue={secondValue}
 *   onFirstChange={setFirstValue}
 *   onSecondChange={setSecondValue}
 * />
 * ```
 */
export function InputPair({
  size = 'md',
  error = false,
  disabled = false,
  firstValue = '',
  secondValue = '',
  onFirstChange,
  onSecondChange,
  firstPlaceholder = 'Placeholder',
  secondPlaceholder = 'Value',
  firstAriaLabel = 'First input',
  secondAriaLabel = 'Second input',
  className,
  ...props
}: InputPairProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div
      className={cn(
        styles.inputPair,
        size && styles[size],
        error && styles.error,
        disabled && styles.disabled,
        isFocused && styles.focused,
        className
      )}
      role="group"
      {...props}
    >
      <Input
        type="text"
        value={firstValue}
        onChange={(e) => onFirstChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={firstPlaceholder}
        disabled={disabled}
        error={error}
        size={size}
        className={styles.firstInput}
        aria-label={firstAriaLabel}
      />
      
      <div className={styles.separator} />
      
      <Input
        type="text"
        value={secondValue}
        onChange={(e) => onSecondChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={secondPlaceholder}
        disabled={disabled}
        error={error}
        size={size}
        className={styles.secondInput}
        aria-label={secondAriaLabel}
      />
    </div>
  );
}

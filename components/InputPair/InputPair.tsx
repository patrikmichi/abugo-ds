import React, { useState } from 'react';
import styles from './InputPair.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

export interface InputPairProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Field status */
  status?: 'enabled' | 'disabled' | 'error';
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error state (deprecated - use status prop) */
  error?: boolean;
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
  status,
  disabled = false,
  error = false,
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
  
  // Determine status: priority is status prop > disabled > error prop
  const finalStatus: 'enabled' | 'disabled' | 'error' = 
    status || 
    (disabled ? 'disabled' : (error ? 'error' : 'enabled'));
  const isDisabled = finalStatus === 'disabled' || disabled;
  const hasError = finalStatus === 'error' || error;
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div
      className={cn(
        styles.inputPair,
        size && styles[size],
        hasError && styles.error,
        isDisabled && styles.disabled,
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
        disabled={isDisabled}
        size={size}
        status={finalStatus}
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
        disabled={isDisabled}
        size={size}
        status={finalStatus}
        className={styles.secondInput}
        aria-label={secondAriaLabel}
      />
    </div>
  );
}

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

import styles from './InputPair.module.css';
import type { IProps } from './types';

const InputPair = ({
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
}: IProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={cn(
        styles.inputPair,
        styles[size],
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
};

export default InputPair;

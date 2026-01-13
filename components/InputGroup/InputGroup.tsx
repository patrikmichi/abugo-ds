import React, { useState } from 'react';
import styles from './InputGroup.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Input value */
  inputValue?: string;
  /** Select value */
  selectValue?: string;
  /** Input change handler */
  onInputChange?: (value: string) => void;
  /** Select change handler */
  onSelectChange?: (value: string) => void;
  /** Input placeholder */
  inputPlaceholder?: string;
  /** Select options */
  selectOptions?: Array<{ value: string; label: string }>;
  /** ARIA label for the input */
  inputAriaLabel?: string;
  /** ARIA label for the select */
  selectAriaLabel?: string;
}

/**
 * InputGroup component - Compound field with input and select side by side
 * 
 * @example
 * ```tsx
 * <InputGroup
 *   inputValue={inputValue}
 *   selectValue={selectValue}
 *   onInputChange={setInputValue}
 *   onSelectChange={setSelectValue}
 *   selectOptions={[{ value: 'kg', label: 'kg' }]}
 * />
 * ```
 */
export function InputGroup({
  size = 'md',
  error = false,
  disabled = false,
  inputValue = '',
  selectValue = '',
  onInputChange,
  onSelectChange,
  inputPlaceholder = 'Placeholder',
  selectOptions = [],
  inputAriaLabel = 'Input',
  selectAriaLabel = 'Select',
  className,
  ...props
}: InputGroupProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div
      className={cn(
        styles.inputGroup,
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
        value={inputValue}
        onChange={(e) => onInputChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={inputPlaceholder}
        disabled={disabled}
        error={error}
        size={size}
        className={styles.input}
        aria-label={inputAriaLabel}
      />
      
      <div className={styles.separator} />
      
      <Select
        value={selectValue}
        onChange={(e) => onSelectChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        error={error}
        size={size}
        className={styles.select}
        aria-label={selectAriaLabel}
      >
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

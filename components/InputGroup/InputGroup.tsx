import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

import styles from './InputGroup.module.css';
import type { IProps } from './types';

const InputGroup = ({
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
}: IProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSelectChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value;
    onSelectChange?.(selectedValue);
  };

  return (
    <div
      className={cn(
        styles.inputGroup,
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
        options={selectOptions}
        onChange={handleSelectChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        error={error}
        size={size}
        className={styles.select}
        aria-label={selectAriaLabel}
      />
    </div>
  );
};

export default InputGroup;

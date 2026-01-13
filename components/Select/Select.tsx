import React, { useState, useRef, useMemo } from 'react';
import styles from './Select.module.css';
import { cn } from '@/lib/utils';
import { SelectDropdown, SelectOption } from './SelectDropdown';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field has a validation error */
  error?: boolean;
  /** Options array (alternative to children) */
  options?: SelectOption[];
  /** Selected value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

export function Select({
  size = 'md',
  error = false,
  className,
  disabled,
  children,
  options: optionsProp,
  value: valueProp,
  onChange,
  placeholder = 'Select...',
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Parse options from children or use options prop
  const options: SelectOption[] = useMemo(() => {
    if (optionsProp) {
      return optionsProp;
    }

    // Parse from children (option elements)
    const opts: SelectOption[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        opts.push({
          value: child.props.value || '',
          label: typeof child.props.children === 'string' ? child.props.children : child.props.value || '',
          disabled: child.props.disabled,
        });
      }
    });
    return opts;
  }, [children, optionsProp]);

  // Find selected option label
  const selectedOption = options.find(opt => opt.value === valueProp);
  const displayValue = selectedOption?.label || placeholder;

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleChange = (newValue: string | string[]) => {
    if (typeof newValue === 'string') {
      onChange?.(newValue);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className={cn(
        styles.selectWrapper,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        className
      )} 
      ref={triggerRef}
    >
      <div
        className={cn(
          styles.select,
          size === 'sm' && styles.sm,
          size === 'md' && styles.md,
          size === 'lg' && styles.lg,
          error && styles.error,
          disabled && styles.disabled,
          isOpen && styles.open
        )}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={cn(styles.selectValue, !selectedOption && styles.placeholder)}>
          {displayValue}
        </span>
        <span
          className={cn('material-symbols-outlined', styles.chevron)}
          aria-hidden="true"
        >
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>
      <SelectDropdown
        isOpen={isOpen}
        options={options}
        value={valueProp}
        onChange={handleChange}
        onClose={handleClose}
        size={size}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
        triggerRef={triggerRef}
      />
      {/* Hidden native select for form compatibility */}
      <select
        {...props}
        value={valueProp}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={styles.hiddenSelect}
        aria-hidden="true"
        tabIndex={-1}
      >
        {children}
      </select>
    </div>
  );
}

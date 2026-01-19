import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './AutoComplete.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { SelectDropdown } from '@/components/Select/SelectDropdown';
import { filterOptions } from '@/components/Select/util';
import type { SelectOption } from '@/components/Select/Select';

export type AutoCompleteValue = string;

export interface AutoCompleteOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export type AutoCompleteDataSource = string | AutoCompleteOption | (string | AutoCompleteOption)[];

export interface AutoCompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSelect' | 'value' | 'defaultValue' | 'size'> {
  /** Current value (controlled) */
  value?: AutoCompleteValue;
  /** Default value (uncontrolled) */
  defaultValue?: AutoCompleteValue;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Options data source */
  options?: AutoCompleteOption[];
  /** Data source (legacy prop name) */
  dataSource?: AutoCompleteDataSource;
  /** Filter options */
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean);
  /** Callback when searching */
  onSearch?: (searchText: string) => void;
  /** Callback when option is selected */
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  /** Placeholder */
  placeholder?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow clear */
  allowClear?: boolean;
  /** Default active first option */
  defaultActiveFirstOption?: boolean;
  /** Backfill selected item into input when using keyboard */
  backfill?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
  /** Whether dropdown matches input width */
  dropdownMatchSelectWidth?: boolean;
  /** Content to show when no options match */
  notFoundContent?: React.ReactNode;
}

/**
 * AutoComplete Component
 * 
 * Auto complete input component with search and suggestions.
 * 
 * @example
 * ```tsx
 * <AutoComplete
 *   options={[
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ]}
 *   onSearch={(text) => console.log(text)}
 *   onSelect={(value) => console.log(value)}
 * />
 * ```
 */
export function AutoComplete({
  value: controlledValue,
  defaultValue = '',
  onChange,
  options: propOptions,
  dataSource,
  filterOption = true,
  onSearch,
  onSelect,
  placeholder,
  size = 'md',
  error = false,
  disabled = false,
  allowClear = false,
  defaultActiveFirstOption = false,
  backfill = false,
  className,
  style,
  getPopupContainer,
  popupClassName,
  popupStyle,
  dropdownMatchSelectWidth = true,
  notFoundContent = 'No data',
  ...props
}: AutoCompleteProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Normalize options from dataSource or options prop
  const normalizedOptions = useMemo<SelectOption[]>(() => {
    if (propOptions) {
      return propOptions.map(opt => ({
        value: opt.value,
        label: opt.label,
        disabled: opt.disabled,
      }));
    }
    if (dataSource) {
      if (typeof dataSource === 'string') {
        return [{ label: dataSource, value: dataSource }];
      }
      if (Array.isArray(dataSource)) {
        return dataSource.map((item) => {
          if (typeof item === 'string') {
            return { label: item, value: item };
          }
          return {
            value: item.value,
            label: item.label,
            disabled: item.disabled,
          };
        });
      }
      return [{
        value: dataSource.value,
        label: dataSource.label,
        disabled: dataSource.disabled,
      }];
    }
    return [];
  }, [propOptions, dataSource]);

  // Filter options based on search value
  const filteredOptions = useMemo(() => {
    return filterOptions(
      normalizedOptions,
      searchValue,
      filterOption,
      'label'
    );
  }, [normalizedOptions, searchValue, filterOption]);

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      setSearchValue(newValue);
      setOpen(true);
      onSearch?.(newValue);
    },
    [isControlled, onChange, onSearch]
  );

  const handleSelect = useCallback(
    (selectedValue: string, option: SelectOption) => {
      if (!isControlled) {
        setInternalValue(selectedValue);
      }
      onChange?.(selectedValue);
      setSearchValue('');
      setOpen(false);
      onSelect?.(selectedValue, {
        value: option.value,
        label: option.label,
        disabled: option.disabled,
      });
    },
    [isControlled, onChange, onSelect]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (disabled) return;
    // Show dropdown on focus if there are any options (filtered or not)
    if (normalizedOptions.length > 0 || searchValue.length > 0) {
      setOpen(true);
    }
  }, [disabled, normalizedOptions.length, searchValue.length]);

  const handleBlur = useCallback(() => {
    // Delay to allow click events on options
    setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    setSearchValue('');
    setOpen(false);
  }, [isControlled, onChange]);

  // Update search value when value changes externally
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={cn(styles.autocompleteWrapper, className)} style={style}>
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        size={size}
        error={error}
        disabled={disabled}
        suffix={
          allowClear && value ? (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)', cursor: 'pointer' }}
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur
            >
              close
            </span>
          ) : undefined
        }
        {...props}
      />
      <SelectDropdown
        isOpen={open && (filteredOptions.length > 0 || (searchValue.length > 0 && normalizedOptions.length > 0))}
        options={filteredOptions}
        value={value}
        onChange={(val) => {
          if (typeof val === 'string') {
            handleSelect(val, filteredOptions.find(opt => opt.value === val) || { value: val, label: val });
          }
        }}
        onSelect={handleSelect}
        onClose={handleClose}
        size={size}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
        showSearch={false}
        notFoundContent={notFoundContent}
        triggerRef={containerRef}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        dropdownClassName={popupClassName}
        dropdownStyle={popupStyle}
        getPopupContainer={getPopupContainer}
        defaultActiveFirstOption={defaultActiveFirstOption}
      />
    </div>
  );
}

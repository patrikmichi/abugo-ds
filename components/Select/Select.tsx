import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SelectDropdown } from './SelectDropdown';
import { Chip } from '@/components/Chip/Chip';
import { filterOptions } from './util';
import styles from './Select.module.css';

export type SelectMode = 'default' | 'multiple' | 'tags';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  groupLabel?: string;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** Current value (controlled) */
  value?: string | string[];
  /** Default value (uncontrolled) */
  defaultValue?: string | string[];
  /** Callback when value changes */
  onChange?: (value: string | string[]) => void;
  /** Options array */
  options?: SelectOption[];
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Mode */
  mode?: SelectMode;
  /** Show search */
  showSearch?: boolean;

  /** Allow clear */
  allowClear?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Max tag count for multiple mode */
  maxTagCount?: number;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name for dropdown */
  dropdownClassName?: string;
  /** Custom style for dropdown */
  dropdownStyle?: React.CSSProperties;
  /** Whether dropdown matches trigger width */
  matchTriggerWidth?: boolean;
  /** Whether to show checkbox in dropdown options */
  showCheckbox?: boolean;
  /** Empty content (no results) */
  emptyContent?: React.ReactNode;
}

export function Select({
  value: controlledValue,
  defaultValue,
  onChange,
  options = [],
  size = 'md',
  error = false,
  disabled = false,
  loading = false,
  mode = 'default',
  showSearch = false,
  allowClear = false,
  placeholder = 'Select...',
  maxTagCount,
  getPopupContainer,
  dropdownClassName,
  dropdownStyle,
  matchTriggerWidth = true,
  showCheckbox = false,
  emptyContent,
  className,
  style,
  ...props
}: SelectProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue !== undefined ? defaultValue : mode === 'multiple' || mode === 'tags' ? [] : ''
  );
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<{ scrollTo: (index: number) => void }>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchValue) return options;
    return filterOptions(options, searchValue, true, 'label');
  }, [options, searchValue, showSearch]);

  const isMultiple = mode === 'multiple' || mode === 'tags';

  const handleChange = useCallback(
    (newValue: string | string[]) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const handleSelect = useCallback(
    (selectedValue: string) => {
      if (isMultiple) {
        const currentValues = Array.isArray(value) ? value : [];
        if (currentValues.includes(selectedValue)) {
          handleChange(currentValues.filter((v) => v !== selectedValue));
        } else {
          handleChange([...currentValues, selectedValue]);
        }
      } else {
        handleChange(selectedValue);
        setOpen(false);
      }
    },
    [isMultiple, value, handleChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange(isMultiple ? [] : '');
      setSearchValue('');
    },
    [isMultiple, handleChange]
  );

  const displayValue = useMemo(() => {
    if (isMultiple) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (mode === 'tags') {
        // Tags mode - return empty string, tags will be rendered separately
        return '';
      }
      if (maxTagCount && values.length > maxTagCount) {
        return `${values.slice(0, maxTagCount).join(', ')} +${values.length - maxTagCount}`;
      }
      return values.join(', ');
    }
    if (showSearch && open) return searchValue;
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.label : (value as string) || placeholder;
  }, [isMultiple, value, options, placeholder, maxTagCount, showSearch, open, searchValue, mode]);

  // Get selected options for tag rendering
  const selectedOptions = useMemo(() => {
    if (!isMultiple || !Array.isArray(value)) return [];
    return options.filter(opt => value.includes(opt.value));
  }, [isMultiple, value, options]);

  // Handle tag removal
  const handleTagRemove = useCallback(
    (e: React.MouseEvent, tagValue: string) => {
      e.stopPropagation();
      if (isMultiple) {
        const currentValues = Array.isArray(value) ? value : [];
        handleChange(currentValues.filter((v) => v !== tagValue));
      }
    },
    [isMultiple, value, handleChange]
  );

  // Reset activeIndex when dropdown closes or options change
  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
    } else if (open && filteredOptions.length > 0 && activeIndex === -1) {
      // Set to first enabled option when opening
      const firstEnabled = filteredOptions.findIndex(opt => !opt.disabled);
      if (firstEnabled >= 0) {
        setActiveIndex(firstEnabled);
      }
    }
  }, [open, filteredOptions, activeIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    // If search input is focused and user types, don't handle navigation
    if (showSearch && inputRef.current === document.activeElement) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        inputRef.current?.blur();
        // Focus will return to trigger, which will handle the arrow key
        return;
      }
      // Allow typing in search input
      return;
    }

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          const option = filteredOptions[activeIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          const nextIndex = activeIndex < filteredOptions.length - 1
            ? activeIndex + 1
            : 0;
          // Skip disabled options
          let foundIndex = nextIndex;
          let attempts = 0;
          while (attempts < filteredOptions.length && filteredOptions[foundIndex]?.disabled) {
            foundIndex = foundIndex < filteredOptions.length - 1 ? foundIndex + 1 : 0;
            attempts++;
          }
          if (!filteredOptions[foundIndex]?.disabled) {
            setActiveIndex(foundIndex);
            dropdownRef.current?.scrollTo(foundIndex);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          const prevIndex = activeIndex > 0
            ? activeIndex - 1
            : filteredOptions.length - 1;
          // Skip disabled options
          let foundIndex = prevIndex;
          let attempts = 0;
          while (attempts < filteredOptions.length && filteredOptions[foundIndex]?.disabled) {
            foundIndex = foundIndex > 0 ? foundIndex - 1 : filteredOptions.length - 1;
            attempts++;
          }
          if (!filteredOptions[foundIndex]?.disabled) {
            setActiveIndex(foundIndex);
            dropdownRef.current?.scrollTo(foundIndex);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (open) {
          setOpen(false);
          setSearchValue('');
        }
        break;
      case 'Tab':
        if (open) {
          setOpen(false);
          setSearchValue('');
        }
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          const firstEnabled = filteredOptions.findIndex(opt => !opt.disabled);
          if (firstEnabled >= 0) {
            setActiveIndex(firstEnabled);
            dropdownRef.current?.scrollTo(firstEnabled);
          }
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          let lastEnabled = filteredOptions.length - 1;
          while (lastEnabled >= 0 && filteredOptions[lastEnabled]?.disabled) {
            lastEnabled--;
          }
          if (lastEnabled >= 0) {
            setActiveIndex(lastEnabled);
            dropdownRef.current?.scrollTo(lastEnabled);
          }
        }
        break;
    }
  }, [open, activeIndex, filteredOptions, disabled, loading, showSearch, handleSelect]);

  // Generate ID for active descendant
  const activeDescendantId = useMemo(() => {
    if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
      return `select-option-${filteredOptions[activeIndex].value}`;
    }
    return undefined;
  }, [open, activeIndex, filteredOptions]);

  return (
    <div
      ref={containerRef}
      className={cn(styles.selectWrapper, size && styles[size], error && styles.error, disabled && styles.disabled, className)}
      style={style}
      {...props}
    >
      <div
        ref={triggerRef}
        className={cn(styles.select, size && styles[size], open && styles.open, error && styles.error, disabled && styles.disabled, loading && styles.loading, allowClear && styles.hasClear)}
        onClick={() => !disabled && !loading && setOpen(!open)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? 'select-dropdown-list' : undefined}
        aria-activedescendant={activeDescendantId}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {showSearch && open ? (
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.selectValue}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus
            role="searchbox"
            aria-controls="select-dropdown-list"
            aria-activedescendant={activeDescendantId}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              margin: 0
            }}
          />
        ) : mode === 'tags' && isMultiple && Array.isArray(value) && value.length > 0 ? (
          <span className={cn(styles.selectValue, styles.multipleValue)}>
            {maxTagCount && selectedOptions.length > maxTagCount ? (
              <>
                {selectedOptions.slice(0, maxTagCount).map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    size="small"
                    onDelete={!disabled ? (e) => handleTagRemove(e, option.value) : undefined}
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                ))}
                <span className={styles.tagCount}>+{selectedOptions.length - maxTagCount}</span>
              </>
            ) : (
              selectedOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  size="small"
                  onDelete={!disabled ? (e) => handleTagRemove(e, option.value) : undefined}
                  disabled={disabled}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))
            )}
          </span>
        ) : (
          <span className={cn(styles.selectValue, !value || (isMultiple && Array.isArray(value) && value.length === 0) ? styles.placeholder : undefined)}>
            {displayValue}
          </span>
        )}
        {allowClear && value && (isMultiple ? (Array.isArray(value) && value.length > 0) : value !== '') && !disabled && (
          <span
            className={styles.clearIcon}
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined">
              cancel
            </span>
          </span>
        )}
        {loading ? (
          <span className={styles.loadingIcon}>
            <span className={cn('material-symbols-outlined', styles.loadingIconSpinner)} style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
              sync
            </span>
          </span>
        ) : (
          <span className={styles.chevron}>
            <span className="material-symbols-outlined">
              {open ? 'expand_less' : 'expand_more'}
            </span>
          </span>
        )}
      </div>
      {open && (
        <SelectDropdown
          ref={dropdownRef}
          isOpen={open}
          options={filteredOptions}
          value={value}
          onSelect={(selectedValue) => handleSelect(selectedValue)}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onClose={() => {
            setOpen(false);
            setSearchValue('');
            setActiveIndex(-1);
          }}
          size={size}
          error={error}
          disabled={disabled}
          placeholder={placeholder}
          showSearch={false}
          triggerRef={containerRef as React.RefObject<HTMLElement>}
          matchTriggerWidth={matchTriggerWidth}
          showCheckbox={showCheckbox}
          dropdownClassName={dropdownClassName}
          dropdownStyle={dropdownStyle}
          getPopupContainer={getPopupContainer}
          emptyContent={emptyContent}
        />
      )}
    </div>
  );
}

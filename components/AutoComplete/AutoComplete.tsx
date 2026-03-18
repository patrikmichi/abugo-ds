import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { SelectDropdown, filterOptions } from '@/components/Select';
import type { SelectOption } from '@/components/Select/types';

import styles from './AutoComplete.module.css';
import type { IProps, AutoCompleteOption, AutoCompleteDataSource } from './types';

const normalizeDataSource = (dataSource: AutoCompleteDataSource): SelectOption[] => {
  if (typeof dataSource === 'string') {
    return [{ label: dataSource, value: dataSource }];
  }
  if (Array.isArray(dataSource)) {
    return dataSource.map((item) =>
      typeof item === 'string'
        ? { label: item, value: item }
        : { value: item.value, label: String(item.label), disabled: item.disabled }
    );
  }
  return [{ value: dataSource.value, label: String(dataSource.label), disabled: dataSource.disabled }];
};

const normalizeOptions = (
  propOptions?: AutoCompleteOption[],
  dataSource?: AutoCompleteDataSource
): SelectOption[] => {
  if (propOptions) {
    return propOptions.map((opt) => ({
      value: opt.value,
      label: String(opt.label),
      disabled: opt.disabled,
    }));
  }
  if (dataSource) {
    return normalizeDataSource(dataSource);
  }
  return [];
};

const AutoComplete = ({
  value: controlledValue,
  defaultValue = '',
  onChange,
  options: propOptions,
  dataSource,
  filterOption = true,
  placeholder,
  size = 'md',
  error = false,
  disabled = false,
  allowClear = false,
  className,
  style,
  getPopupContainer,
  popupClassName,
  popupStyle,
  dropdownMatchSelectWidth = true,
  notFoundContent = 'No data',
  ...props
}: IProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const normalizedOptions = useMemo(
    () => normalizeOptions(propOptions, dataSource),
    [propOptions, dataSource]
  );

  const filteredOptions = useMemo(
    () => filterOptions(normalizedOptions, searchValue, filterOption, 'label'),
    [normalizedOptions, searchValue, filterOption]
  );

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) setInternalValue(newValue);
      onChange?.(newValue);
      setSearchValue(newValue);
      setOpen(true);
    },
    [isControlled, onChange]
  );

  const handleSelect = useCallback(
    (selectedValue: string) => {
      if (!isControlled) setInternalValue(selectedValue);
      onChange?.(selectedValue);
      setSearchValue('');
      setOpen(false);
    },
    [isControlled, onChange]
  );

  const handleFocus = useCallback(() => {
    if (disabled) return;
    if (normalizedOptions.length > 0 || searchValue.length > 0) {
      setOpen(true);
    }
  }, [disabled, normalizedOptions.length, searchValue.length]);

  const handleBlur = useCallback(() => {
    setTimeout(() => setOpen(false), 200);
  }, []);

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    setSearchValue('');
    setOpen(false);
  }, [isControlled, onChange]);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const showDropdown = open && (filteredOptions.length > 0 || (searchValue.length > 0 && normalizedOptions.length > 0));
  const showClear = allowClear && value && !disabled;
  const iconSize = size === 'sm' ? 'var(--token-component-icon-field-sm, 20px)' : 'var(--token-component-icon-field-md, 24px)';

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
          showClear ? (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: iconSize, cursor: 'pointer' }}
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
            >
              cancel
            </span>
          ) : undefined
        }
        {...props}
      />
      <SelectDropdown
        isOpen={showDropdown}
        options={filteredOptions}
        value={value}
        onChange={(val) => {
          if (typeof val === 'string') handleSelect(val);
        }}
        onSelect={(val) => handleSelect(val)}
        onClose={() => setOpen(false)}
        size={size}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
        showSearch={false}
        emptyContent={notFoundContent}
        triggerRef={containerRef as React.RefObject<HTMLElement>}
        matchTriggerWidth={dropdownMatchSelectWidth}
        dropdownClassName={popupClassName}
        dropdownStyle={popupStyle}
        getPopupContainer={getPopupContainer}
      />
    </div>
  );
};

export default AutoComplete;

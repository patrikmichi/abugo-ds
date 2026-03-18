import { useState, useRef, useCallback, useMemo, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { SelectDropdown } from './SelectDropdown';
import { SelectTags } from './SelectTags';
import { filterOptions } from './utils';
import { useSelectKeyboard } from './useSelectKeyboard';
import styles from './styles.module.css';
import type { IProps } from './types';

const Select = ({
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
}: IProps) => {
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
  const isMultiple = mode === 'multiple' || mode === 'tags';

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchValue) return options;
    return filterOptions(options, searchValue, true, 'label');
  }, [options, searchValue, showSearch]);

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

  const displayValue = useMemo(() => {
    if (isMultiple) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (mode === 'tags') return '';
      if (maxTagCount && values.length > maxTagCount) {
        return `${values.slice(0, maxTagCount).join(', ')} +${values.length - maxTagCount}`;
      }
      return values.join(', ');
    }
    if (showSearch && open) return searchValue;
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.label : (value as string) || placeholder;
  }, [isMultiple, value, options, placeholder, maxTagCount, showSearch, open, searchValue, mode]);

  const selectedOptions = useMemo(() => {
    if (!isMultiple || !Array.isArray(value)) return [];
    return options.filter((opt) => value.includes(opt.value));
  }, [isMultiple, value, options]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
    } else if (open && filteredOptions.length > 0 && activeIndex === -1) {
      const firstEnabled = filteredOptions.findIndex((opt) => !opt.disabled);
      if (firstEnabled >= 0) {
        setActiveIndex(firstEnabled);
      }
    }
  }, [open, filteredOptions, activeIndex]);

  const { handleKeyDown } = useSelectKeyboard({
    open,
    activeIndex,
    filteredOptions,
    disabled,
    loading,
    showSearch,
    inputRef,
    dropdownRef,
    setOpen,
    setActiveIndex,
    setSearchValue,
    handleSelect,
  });

  const activeDescendantId = useMemo(() => {
    if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
      return `select-option-${filteredOptions[activeIndex].value}`;
    }
    return undefined;
  }, [open, activeIndex, filteredOptions]);

  const showClearButton =
    allowClear &&
    value &&
    (isMultiple ? Array.isArray(value) && value.length > 0 : value !== '') &&
    !disabled;
  const showTagsMode = mode === 'tags' && isMultiple && Array.isArray(value) && value.length > 0;
  const isPlaceholder = !value || (isMultiple && Array.isArray(value) && value.length === 0);

  return (
    <div
      ref={containerRef}
      className={cn(
        styles.selectWrapper,
        size && styles[size],
        error && styles.error,
        disabled && styles.disabled,
        className
      )}
      style={style}
      {...props}
    >
      <div
        ref={triggerRef}
        className={cn(
          styles.select,
          size && styles[size],
          open && styles.open,
          error && styles.error,
          disabled && styles.disabled,
          loading && styles.loading,
          allowClear && styles.hasClear
        )}
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
            className={cn(styles.selectValue, styles.searchInput)}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus
            role="searchbox"
            aria-controls="select-dropdown-list"
            aria-activedescendant={activeDescendantId}
          />
        ) : showTagsMode ? (
          <SelectTags
            selectedOptions={selectedOptions}
            maxTagCount={maxTagCount}
            disabled={disabled}
            onTagRemove={handleTagRemove}
          />
        ) : (
          <span className={cn(styles.selectValue, isPlaceholder && styles.placeholder)}>
            {displayValue}
          </span>
        )}
        {showClearButton && (
          <span
            className={styles.clearIcon}
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined">cancel</span>
          </span>
        )}
        {loading ? (
          <span className={styles.loadingIcon}>
            <span className={cn('material-symbols-outlined', styles.loadingIconSpinner)}>sync</span>
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
};

export default Select;

import React, { useState, useRef, useEffect } from 'react';
import styles from './SelectDropdown.module.css';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Options to display */
  options: SelectOption[];
  /** Selected value(s) - string for single select, string[] for multi-select */
  value?: string | string[];
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Callback when dropdown should close */
  onClose?: () => void;
  /** Whether to allow multiple selection */
  multiple?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Container ref for positioning */
  triggerRef?: React.RefObject<HTMLElement>;
}

export function SelectDropdown({
  isOpen,
  options,
  value,
  onChange,
  onClose,
  multiple = false,
  size = 'md',
  error = false,
  disabled = false,
  placeholder = 'Select...',
  triggerRef,
}: SelectDropdownProps) {
  const [pendingValue, setPendingValue] = useState<string | string[]>(value || (multiple ? [] : ''));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update pending value when value prop changes
  useEffect(() => {
    setPendingValue(value || (multiple ? [] : ''));
  }, [value, multiple]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleItemClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(pendingValue) ? pendingValue : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      setPendingValue(newValues);
    } else {
      setPendingValue(optionValue);
    }
  };

  const handleSave = () => {
    onChange?.(pendingValue);
    onClose?.();
  };

  const handleCancel = () => {
    setPendingValue(value || (multiple ? [] : ''));
    onClose?.();
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(pendingValue) && pendingValue.includes(optionValue);
    }
    return pendingValue === optionValue;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        styles.dropdown,
        styles[size],
        error && styles.error,
        disabled && styles.disabled
      )}
      role="listbox"
      aria-multiselectable={multiple}
    >
      <div className={styles.list}>
        {options.map((option) => {
          const selected = isSelected(option.value);
          const isOptionDisabled = disabled || option.disabled;

          return (
            <div
              key={option.value}
              className={cn(
                styles.item,
                selected && styles.selected,
                isOptionDisabled && styles.itemDisabled
              )}
              onClick={() => !isOptionDisabled && handleItemClick(option.value)}
              role="option"
              aria-selected={selected}
              aria-disabled={isOptionDisabled}
            >
              <span className={styles.itemLabel}>{option.label}</span>
              {selected && (
                <svg
                  className={styles.checkmark}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="8" fill="currentColor" />
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          CANCEL
        </button>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

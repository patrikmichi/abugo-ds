import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { SelectOption as SelectOptionType } from './Select';
import styles from './SelectOption.module.css';

export interface SelectOptionProps {
  /** The option data */
  option: SelectOptionType;
  /** Whether this option is selected */
  isSelected: boolean;
  /** Whether this option is active (hovered/keyboard focused) */
  isActive: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show a checkbox on the right side */
  showCheckbox?: boolean;
  /** Callback when option is clicked */
  onClick: (option: SelectOptionType) => void;
  /** Callback when mouse enters the option */
  onMouseEnter: () => void;
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  ({ option, isSelected, isActive, disabled, size = 'md', showCheckbox, onClick, onMouseEnter }, ref) => {
    return (
      <li
        ref={ref}
        id={`select-option-${option.value}`}
        className={cn(
          styles.option,
          size && styles[size],
          isSelected && styles.selected,
          isActive && styles.active,
          option.disabled && styles.disabled
        )}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || disabled}
        onClick={() => onClick(option)}
        onMouseEnter={onMouseEnter}
      >
        <span className={styles.optionLabel}>{option.label}</span>
        {showCheckbox && (
          <span
            className={cn('material-symbols-outlined', styles.checkbox, isSelected && styles.checked)}
            aria-hidden="true"
          >
            {isSelected ? 'check_box' : 'check_box_outline_blank'}
          </span>
        )}
        {!showCheckbox && isSelected && (
          <span className={cn('material-symbols-outlined', styles.checkmark)} aria-hidden="true">
            check_circle
          </span>
        )}
      </li>
    );
  }
);

SelectOption.displayName = 'SelectOption';

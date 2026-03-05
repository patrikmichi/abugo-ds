import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/Checkbox';
import styles from './SelectOption.module.css';
import type { SelectOptionProps } from './types';

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
          <Checkbox
            checked={isSelected}
            disabled={option.disabled || disabled}
            className={styles.checkbox}
            aria-hidden="true"
            tabIndex={-1}
          />
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

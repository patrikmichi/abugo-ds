import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { SelectOption as SelectOptionComponent } from './SelectOption';
import styles from './SelectDropdown.module.css';
import type { SelectDropdownProps, SelectDropdownRef, SelectOption } from './types';

export const SelectDropdown = forwardRef<SelectDropdownRef, SelectDropdownProps>(({
  isOpen,
  options,
  value,
  onChange,
  onSelect,
  onClose,
  activeIndex = -1,
  onActiveIndexChange,
  size = 'md',
  error = false,
  disabled = false,
  placeholder,
  showSearch = false,
  emptyContent = 'No data',
  triggerRef,
  matchTriggerWidth = true,
  dropdownClassName,
  dropdownStyle,
  getPopupContainer,
  showCheckbox,
}, ref) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const isMultiple = Array.isArray(value);

  // Expose scrollTo method via ref
  useImperativeHandle(ref, () => ({
    scrollTo: (index: number) => {
      const optionElement = optionRefs.current.get(index);
      if (optionElement && dropdownRef.current) {
        optionElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    },
  }));

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  const handleOptionClick = useCallback(
    (option: SelectOption) => {
      if (option.disabled || disabled) return;

      if (onSelect) {
        onSelect(option.value, option);
      } else if (onChange) {
        if (isMultiple) {
          const currentValues = Array.isArray(value) ? value : [];
          if (currentValues.includes(option.value)) {
            onChange(currentValues.filter((v) => v !== option.value));
          } else {
            onChange([...currentValues, option.value]);
          }
        } else {
          onChange(option.value);
          onClose?.();
        }
      }
    },
    [disabled, isMultiple, value, onChange, onSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(styles.dropdown, size && styles[size], dropdownClassName)}
      style={dropdownStyle}
      tabIndex={-1}
    >
      <div
        className={styles.dropdownContent}
        onWheel={(e) => {
          // Allow wheel scrolling
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Allow touch scrolling
          e.stopPropagation();
        }}
      >
        {options.length === 0 ? (
          <div className={styles.notFound}>{emptyContent}</div>
        ) : (
          <ul
            className={styles.optionsList}
            role="listbox"
            id="select-dropdown-list"
            aria-multiselectable={isMultiple}
          >
            {options.map((option, index) => {
              const isSelected = isMultiple
                ? Array.isArray(value) && value.includes(option.value)
                : value === option.value;
              const isActive = index === activeIndex;

              return (
                <SelectOptionComponent
                  key={option.value}
                  ref={(el) => {
                    if (el) {
                      optionRefs.current.set(index, el);
                    } else {
                      optionRefs.current.delete(index);
                    }
                  }}
                  option={option}
                  isSelected={isSelected}
                  isActive={isActive}
                  disabled={disabled}
                  size={size}
                  showCheckbox={showCheckbox}
                  onClick={handleOptionClick}
                  onMouseEnter={() => onActiveIndexChange?.(index)}
                />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
});

SelectDropdown.displayName = 'SelectDropdown';

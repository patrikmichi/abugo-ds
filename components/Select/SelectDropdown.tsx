import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import domAlign from 'dom-align';
import { cn } from '@/lib/utils';
import type { SelectOption } from './Select';
import { SelectOption as SelectOptionComponent } from './SelectOption';
import styles from './SelectDropdown.module.css';

export interface SelectDropdownProps {
  /** Whether dropdown is open */
  isOpen: boolean;
  /** Options to display */
  options: SelectOption[];
  /** Current value */
  value?: string | string[];
  /** Callback when option is clicked */
  onChange?: (value: string | string[]) => void;
  /** Callback when option is selected */
  onSelect?: (value: string, option: SelectOption) => void;
  /** Callback when dropdown closes */
  onClose?: () => void;
  /** Active index (controlled from parent) */
  activeIndex?: number;
  /** Callback when active index changes (from mouse hover) */
  onActiveIndexChange?: (index: number) => void;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Show search */
  showSearch?: boolean;
  /** Empty content (no results) */
  emptyContent?: React.ReactNode;
  /** Trigger ref for positioning */
  triggerRef?: React.RefObject<HTMLElement>;
  /** Whether dropdown matches trigger width */
  matchTriggerWidth?: boolean;
  /** Custom class name */
  dropdownClassName?: string;
  /** Custom style */
  dropdownStyle?: React.CSSProperties;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Whether to show checkboxes in options */
  showCheckbox?: boolean;
}

export interface SelectDropdownRef {
  scrollTo: (index: number) => void;
}

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
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width?: number } | null>(null);
  const optionRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const isMultiple = Array.isArray(value);

  // Update position when dropdown opens
  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    if (!triggerRef?.current) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const dropdown = dropdownRef.current;
      if (!trigger || !dropdown) return;

      // Initially hide for measurement
      dropdown.style.visibility = 'hidden';
      dropdown.style.display = 'block';
      dropdown.style.position = 'fixed';
      dropdown.style.top = '-9999px';
      dropdown.style.left = '-9999px';

      const triggerRect = trigger.getBoundingClientRect();

      // Calculate width
      const width = matchTriggerWidth ? triggerRect.width : undefined;

      // Get offset from CSS variable
      const offsetVar = getComputedStyle(document.documentElement).getPropertyValue('--token-component-select-dropdown-offset') || '4px';
      const offsetVal = parseInt(offsetVar, 10) || 4;

      // Use dom-align for positioning
      const alignConfig = {
        points: ['tl', 'bl'] as [string, string],
        offset: [0, offsetVal],
        overflow: {
          adjustX: true,
          adjustY: true,
          alwaysByViewport: true,
        },
        useCssTransform: false,
        useCssRight: false,
        useCssBottom: false,
      };

      domAlign(dropdown, trigger, alignConfig);

      // Get final position
      const computedStyle = window.getComputedStyle(dropdown);
      const top = parseFloat(computedStyle.top) || triggerRect.bottom + offsetVal;
      const left = parseFloat(computedStyle.left) || triggerRect.left;

      setPosition({ top, left, width });
      dropdown.style.visibility = 'visible';
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      updatePosition();
      // Double-check after a microtask
      setTimeout(updatePosition, 0);
    });

    const onScroll = (e: Event) => {
      // Ignore scroll events from within the dropdown
      if (dropdownRef.current && e.target instanceof Node && dropdownRef.current.contains(e.target)) {
        return;
      }
      updatePosition();
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, triggerRef, matchTriggerWidth]);

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

  const container = getPopupContainer && triggerRef?.current
    ? getPopupContainer(triggerRef.current)
    : document.body;

  return createPortal(
    <div
      ref={dropdownRef}
      className={cn(styles.dropdown, size && styles[size], dropdownClassName)}
      style={{
        ...dropdownStyle,
        position: 'fixed',
        top: position ? `${position.top}px` : '-9999px',
        left: position ? `${position.left}px` : '-9999px',
        width: position?.width ? `${position.width}px` : undefined,
        visibility: position ? 'visible' : 'hidden',
      }}
      tabIndex={-1}
    >
      <div
        ref={dropdownContentRef}
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
    </div>,
    container
  );
});

SelectDropdown.displayName = 'SelectDropdown';

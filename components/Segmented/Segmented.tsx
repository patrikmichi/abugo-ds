import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styles from './Segmented.module.css';
import { cn } from '@/lib/utils';

export type SegmentedSize = 'small' | 'default' | 'large';

export interface SegmentedOption {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export type SegmentedOptionType = string | number | SegmentedOption;

export interface SegmentedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of segment options */
  options: SegmentedOptionType[];
  /** Current selected value (controlled) */
  value?: string | number;
  /** Default selected value (uncontrolled) */
  defaultValue?: string | number;
  /** Callback when selection changes */
  onChange?: (value: string | number) => void;
  /** Whether to stretch to fit parent width */
  block?: boolean;
  /** Size of segmented control */
  size?: SegmentedSize;
  /** Whether all segments are disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Segmented Component
 * 
 * Compact control for selecting a single option from multiple choices.
 * Compact control for selecting a single option from multiple choices.
 * 
 * @example
 * ```tsx
 * <Segmented
 *   options={['Option 1', 'Option 2', 'Option 3']}
 *   defaultValue="Option 1"
 *   onChange={(value) => console.log(value)}
 * />
 * 
 * <Segmented
 *   options={[
 *     { label: 'List', value: 'list', icon: <ListIcon /> },
 *     { label: 'Grid', value: 'grid', icon: <GridIcon /> },
 *   ]}
 *   size="large"
 *   block
 * />
 * ```
 */
export function Segmented({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  block = false,
  size = 'default',
  disabled = false,
  className,
  style,
  ...props
}: SegmentedProps) {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Normalize options - memoized to prevent unnecessary recalculations
  const normalizedOptions = useMemo<SegmentedOption[]>(() => {
    return options.map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return { label: option, value: option };
      }
      return option;
    });
  }, [options]);

  // Update indicator position when value or options change
  useEffect(() => {
    if (!indicatorRef.current || !containerRef.current || value === undefined) {
      // Hide indicator if no value selected
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = '0';
      }
      return;
    }

    const selectedIndex = normalizedOptions.findIndex((opt) => opt.value === value);
    if (selectedIndex === -1) {
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = '0';
      }
      return;
    }

    const container = containerRef.current;
    const indicator = indicatorRef.current;
    const segments = container.querySelectorAll<HTMLElement>(`.${styles.segment}`);
    
    if (segments[selectedIndex]) {
      const selectedSegment = segments[selectedIndex];
      const containerRect = container.getBoundingClientRect();
      const segmentRect = selectedSegment.getBoundingClientRect();
      
      // Calculate position relative to container
      const left = segmentRect.left - containerRect.left;
      const width = segmentRect.width;
      const height = segmentRect.height;
      
      // Update indicator position and size
      indicator.style.width = `${width}px`;
      indicator.style.height = `${height}px`;
      indicator.style.transform = `translateX(${left}px)`;
      indicator.style.opacity = '1';
    }
  }, [value, normalizedOptions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, optionValue: string | number) => {
      if (disabled) return;

      const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          // Find previous enabled option
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (!normalizedOptions[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          // Wrap to end if at beginning
          if (nextIndex === currentIndex) {
            for (let i = normalizedOptions.length - 1; i > currentIndex; i--) {
              if (!normalizedOptions[i].disabled) {
                nextIndex = i;
                break;
              }
            }
          }
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          // Find next enabled option
          for (let i = currentIndex + 1; i < normalizedOptions.length; i++) {
            if (!normalizedOptions[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          // Wrap to beginning if at end
          if (nextIndex === currentIndex) {
            for (let i = 0; i < currentIndex; i++) {
              if (!normalizedOptions[i].disabled) {
                nextIndex = i;
                break;
              }
            }
          }
          break;
        case 'Home':
          e.preventDefault();
          // Find first enabled option
          for (let i = 0; i < normalizedOptions.length; i++) {
            if (!normalizedOptions[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          break;
        case 'End':
          e.preventDefault();
          // Find last enabled option
          for (let i = normalizedOptions.length - 1; i >= 0; i--) {
            if (!normalizedOptions[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex && nextIndex >= 0) {
        const nextOption = normalizedOptions[nextIndex];
        if (!isControlled) {
          setInternalValue(nextOption.value);
        }
        onChange?.(nextOption.value);
        // Focus the next segment
        const segments = containerRef.current?.querySelectorAll<HTMLButtonElement>(`.${styles.segment}`);
        if (segments && segments[nextIndex]) {
          segments[nextIndex].focus();
        }
      }
    },
    [disabled, value, normalizedOptions, isControlled, onChange]
  );

  const handleClick = useCallback(
    (optionValue: string | number, optionDisabled?: boolean) => {
      if (disabled || optionDisabled) return;
      if (value === optionValue) return;

      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
    },
    [disabled, value, isControlled, onChange]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        styles.segmented,
        styles[size],
        block && styles.block,
        disabled && styles.disabled,
        className
      )}
      style={style}
      role="tablist"
      aria-orientation="horizontal"
      {...props}
    >
      <div ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
      {normalizedOptions.map((option, index) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={typeof option.value === 'string' || typeof option.value === 'number' ? option.value : index}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            tabIndex={isSelected && !isDisabled ? 0 : -1}
            className={cn(
              styles.segment,
              isSelected && styles.selected,
              isDisabled && styles.segmentDisabled,
              option.className
            )}
            onClick={() => handleClick(option.value, option.disabled)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

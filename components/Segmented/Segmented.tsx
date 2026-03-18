import React, { useState, useCallback, useRef, useMemo } from 'react';

import { cn } from '@/lib/utils';

import styles from './Segmented.module.css';
import type { IProps, SegmentedOption, SegmentedSize } from './types';

const findNextEnabledIndex = (
  options: SegmentedOption[],
  currentIndex: number,
  direction: 'forward' | 'backward'
): number => {
  const step = direction === 'forward' ? 1 : -1;
  const length = options.length;

  for (let i = 1; i <= length; i++) {
    const nextIndex = (currentIndex + i * step + length) % length;
    if (!options[nextIndex].disabled) {
      return nextIndex;
    }
  }

  return currentIndex;
};

const findEdgeEnabledIndex = (
  options: SegmentedOption[],
  edge: 'first' | 'last'
): number => {
  if (edge === 'first') {
    return options.findIndex((opt) => !opt.disabled);
  }

  for (let i = options.length - 1; i >= 0; i--) {
    if (!options[i].disabled) return i;
  }

  return -1;
};

const Segmented = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  block = false,
  size = 'default',
  disabled = false,
  className,
  ...props
}: IProps) => {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const normalizedOptions = useMemo<SegmentedOption[]>(
    () =>
      options.map((option) =>
        typeof option === 'string' || typeof option === 'number'
          ? { label: option, value: option }
          : option
      ),
    [options]
  );

  const selectedIndex = useMemo(
    () => normalizedOptions.findIndex((opt) => opt.value === value),
    [normalizedOptions, value]
  );

  const optionCount = normalizedOptions.length;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = findNextEnabledIndex(normalizedOptions, currentIndex, 'backward');
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = findNextEnabledIndex(normalizedOptions, currentIndex, 'forward');
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = findEdgeEnabledIndex(normalizedOptions, 'first');
          break;
        case 'End':
          e.preventDefault();
          nextIndex = findEdgeEnabledIndex(normalizedOptions, 'last');
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

        const segments = containerRef.current?.querySelectorAll<HTMLButtonElement>(
          `.${styles.segment}`
        );
        segments?.[nextIndex]?.focus();
      }
    },
    [disabled, value, normalizedOptions, isControlled, onChange]
  );

  const handleClick = useCallback(
    (optionValue: string | number, optionDisabled?: boolean) => {
      if (disabled || optionDisabled || value === optionValue) return;

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
      role="tablist"
      aria-orientation="horizontal"
      style={{ '--segment-count': optionCount } as React.CSSProperties}
      {...props}
    >
      <div
        className={cn(styles.indicator, selectedIndex >= 0 && styles.visible)}
        style={{ '--selected-index': selectedIndex } as React.CSSProperties}
        aria-hidden="true"
      />
      {normalizedOptions.map((option, index) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const isIconOnly = !!(option.icon && (!option.label || option.label === ''));

        return (
          <button
            key={option.value}
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
              isIconOnly && styles.iconOnly,
              option.className
            )}
            onClick={() => handleClick(option.value, option.disabled)}
            onKeyDown={handleKeyDown}
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            {!isIconOnly && <span className={styles.label}>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default Segmented;

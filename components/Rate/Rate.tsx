import React, { useState, useRef, useCallback, useMemo } from 'react';
import styles from './Rate.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';

export interface RateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (controlled) */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Callback when hover value changes */
  onHoverChange?: (value: number) => void;
  /** Whether clicking selected star clears rating */
  allowClear?: boolean;
  /** Whether to allow half star selection */
  allowHalf?: boolean;
  /** Number of stars */
  count?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Tooltips for each star */
  tooltips?: string[];
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Rate Component
 * 
 * Interactive star rating component. 
 * 
 * @example
 * ```tsx
 * <Rate
 *   defaultValue={3}
 *   onChange={(value) => console.log(value)}
 *   allowHalf
 * />
 * ```
 */
export function Rate({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onHoverChange,
  allowClear = true,
  allowHalf = false,
  count = 5,
  disabled = false,
  tooltips,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: RateProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const displayValue = hoverValue !== undefined ? hoverValue : value;

  const getCharacter = useCallback(
    (index: number) => {
      if (character) {
        return typeof character === 'function' ? character(index) : character;
      }
      return (
        <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
          star
        </span>
      );
    },
    [character]
  );

  const getValueFromPosition = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number): number => {
      if (!allowHalf) {
        return index + 1;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const isHalf = clickX < width / 2;

      return index + (isHalf ? 0.5 : 1);
    },
    [allowHalf]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (disabled) return;

      const newValue = getValueFromPosition(e, index);

      // Allow clear: if clicking the same value, clear it
      if (allowClear && newValue === value) {
        const clearedValue = 0;
        if (!isControlled) {
          setInternalValue(clearedValue);
        }
        onChange?.(clearedValue);
        return;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [disabled, allowClear, value, isControlled, onChange, getValueFromPosition]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (disabled) return;
      const newHoverValue = getValueFromPosition(e, index);
      setHoverValue(newHoverValue);
      onHoverChange?.(newHoverValue);
    },
    [disabled, onHoverChange, getValueFromPosition]
  );

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    setHoverValue(undefined);
    onHoverChange?.(0);
  }, [disabled, onHoverChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (disabled) return;

      let newValue = value;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newValue = Math.min(count, value + (allowHalf ? 0.5 : 1));
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newValue = Math.max(0, value - (allowHalf ? 0.5 : 1));
          break;
        case 'Home':
          e.preventDefault();
          newValue = 0;
          break;
        case 'End':
          e.preventDefault();
          newValue = count;
          break;
        default:
          return;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [disabled, value, count, allowHalf, isControlled, onChange]
  );

  const renderStar = useCallback(
    (index: number) => {
      const starValue = index + 1;
      const isFilled = displayValue >= starValue;
      const isHalfFilled = allowHalf && displayValue >= index + 0.5 && displayValue < starValue;
      const isActive = focusedIndex === index;

      const starContent = (
        <div
          key={index}
          className={cn(
            styles.star,
            isFilled && styles.filled,
            isHalfFilled && styles.halfFilled,
            isActive && styles.focused,
            disabled && styles.disabled
          )}
          onClick={(e) => handleClick(e, index)}
          onMouseEnter={(e) => handleMouseEnter(e, index)}
          onMouseLeave={handleMouseLeave}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => {
            setFocusedIndex(index);
            onFocus?.(e as any);
          }}
          onBlur={(e) => {
            setFocusedIndex(null);
            onBlur?.(e as any);
          }}
          tabIndex={disabled ? -1 : 0}
          role="radio"
          aria-checked={isFilled}
          aria-label={tooltips?.[index] || `Rate ${starValue}`}
        >
          <span className={styles.starFirst}>{getStarIcon()}</span>
          {allowHalf && <span className={styles.starSecond}>{getStarIcon()}</span>}
        </div>
      );

      if (tooltips && tooltips[index]) {
        return (
          <Tooltip key={index} title={tooltips[index]} placement="top">
            {starContent}
          </Tooltip>
        );
      }

      return starContent;
    },
    [
      displayValue,
      allowHalf,
      focusedIndex,
      disabled,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleKeyDown,
      onFocus,
      onBlur,
      getStarIcon,
      tooltips,
    ]
  );

  return (
    <div
      ref={containerRef}
      className={cn(styles.rating, disabled && styles.disabled, className)}
      style={style}
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {Array.from({ length: count }).map((_, index) => renderStar(index))}
    </div>
  );
}

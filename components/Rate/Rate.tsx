import React, { useState, useRef } from 'react';
import styles from './Rate.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';
import type { RateProps } from './types';

const StarIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-2)' }}>
    star
  </span>
);

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
  character,
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
  const displayValue = hoverValue ?? value;

  const getCharacter = (index: number) => {
    if (!character) return <StarIcon />;
    return typeof character === 'function' ? character(index) : character;
  };

  const getValueFromPosition = (e: React.MouseEvent<HTMLDivElement>, index: number): number => {
    if (!allowHalf) return index + 1;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    return index + (isHalf ? 0.5 : 1);
  };

  const updateValue = (newValue: number) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    const newValue = getValueFromPosition(e, index);
    if (allowClear && newValue === value) {
      updateValue(0);
    } else {
      updateValue(newValue);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    const newHoverValue = getValueFromPosition(e, index);
    setHoverValue(newHoverValue);
    onHoverChange?.(newHoverValue);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverValue(undefined);
    onHoverChange?.(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const step = allowHalf ? 0.5 : 1;
    let newValue = value;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(count, value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(0, value - step);
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
    updateValue(newValue);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;
    const isHalfFilled = allowHalf && displayValue >= index + 0.5 && displayValue < starValue;

    const starContent = (
      <div
        key={index}
        className={cn(
          styles.star,
          isFilled && styles.filled,
          isHalfFilled && styles.halfFilled,
          focusedIndex === index && styles.focused,
          disabled && styles.disabled
        )}
        onClick={(e) => handleClick(e, index)}
        onMouseEnter={(e) => handleMouseEnter(e, index)}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setFocusedIndex(index);
          onFocus?.(e as React.FocusEvent<HTMLDivElement>);
        }}
        onBlur={(e) => {
          setFocusedIndex(null);
          onBlur?.(e as React.FocusEvent<HTMLDivElement>);
        }}
        tabIndex={disabled ? -1 : 0}
        role="radio"
        aria-checked={isFilled}
        aria-label={tooltips?.[index] || `Rate ${starValue}`}
      >
        <span className={styles.starFirst}>{getCharacter(index)}</span>
        {allowHalf && <span className={styles.starSecond}>{getCharacter(index)}</span>}
      </div>
    );

    if (tooltips?.[index]) {
      return (
        <Tooltip key={index} title={tooltips[index]} placement="top">
          {starContent}
        </Tooltip>
      );
    }

    return starContent;
  };

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
      {Array.from({ length: count }, (_, i) => renderStar(i))}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import styles from './Rate.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';
import type { RateProps } from './types';

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <span
    className="material-symbols-outlined"
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    star
  </span>
);

export function Rate({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onHoverChange,
  allowClear = true,
  count = 5,
  disabled = false,
  tooltips,
  character,
  size = 'md',
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
    if (character) {
      return typeof character === 'function' ? character(index) : character;
    }
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;
    return <StarIcon filled={isFilled} />;
  };

  const updateValue = (newValue: number) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClick = (_e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    const newValue = index + 1;
    if (allowClear && newValue === value) {
      updateValue(0);
    } else {
      updateValue(newValue);
    }
  };

  const handleMouseEnter = (_e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    const newHoverValue = index + 1;
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
    let newValue = value;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(count, value + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(0, value - 1);
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

    const starContent = (
      <div
        key={index}
        className={cn(
          styles.star,
          isFilled && styles.filled,
          focusedIndex === index && styles.focused,
          disabled && styles.disabled
        )}
        onClick={(e) => { handleClick(e, index); e.currentTarget.blur(); }}
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
        {getCharacter(index)}
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
      className={cn(styles.rating, styles[size], disabled && styles.disabled, className)}
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

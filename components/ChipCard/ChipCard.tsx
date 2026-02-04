import React, { useCallback } from 'react';
import styles from './ChipCard.module.css';
import { cn } from '@/lib/utils';

export interface ChipCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The headline text */
  headline: React.ReactNode;
  /** Optional subtext displayed below the headline */
  subtext?: React.ReactNode;
  /** If true, the chip card is in selected state */
  selected?: boolean;
  /** If true, the component is disabled */
  disabled?: boolean;
  /** The component used for the root node */
  component?: React.ElementType;
}

/**
 * ChipCard Component
 *
 * A selectable card-like chip with a headline and optional subtext.
 * Supports default, hover, selected, and disabled states.
 *
 * @example
 * ```tsx
 * // Basic chip card
 * <ChipCard headline="Option A" />
 *
 * // With subtext
 * <ChipCard headline="Option A" subtext="Description text" />
 *
 * // Selected state
 * <ChipCard headline="Option A" subtext="Description" selected />
 *
 * // Disabled state
 * <ChipCard headline="Option A" subtext="Description" disabled />
 * ```
 */
export function ChipCard({
  headline,
  subtext,
  selected = false,
  disabled = false,
  component,
  className,
  onClick,
  onKeyDown,
  ...props
}: ChipCardProps) {
  const RootComponent = component || 'button';

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled && onClick) {
        onClick(e);
      }
    },
    [disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onClick?.(e as any);
        return;
      }
      onKeyDown?.(e);
    },
    [disabled, onClick, onKeyDown]
  );

  return (
    <RootComponent
      className={cn(
        styles.chipCard,
        selected && styles.selected,
        disabled && styles.disabled,
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled && RootComponent === 'button' ? disabled : undefined}
      tabIndex={!disabled ? 0 : undefined}
      role={RootComponent !== 'button' ? 'button' : undefined}
      aria-disabled={disabled}
      aria-pressed={selected}
      type={RootComponent === 'button' ? 'button' : undefined}
      {...props}
    >
      <span className={styles.headline}>{headline}</span>
      {subtext && <span className={styles.subtext}>{subtext}</span>}
    </RootComponent>
  );
}

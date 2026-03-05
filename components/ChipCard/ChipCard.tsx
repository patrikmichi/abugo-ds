import React, { useCallback } from 'react';

import { cn } from '@/lib/utils';

import styles from './ChipCard.module.css';
import type { IProps } from './types';

const ChipCard = ({
  headline,
  subtext,
  selected = false,
  disabled = false,
  component,
  className,
  onClick,
  onKeyDown,
  ...props
}: IProps) => {
  const RootComponent = component || 'button';

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled || !onClick) return;
      onClick(e);
    },
    [disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
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
};

export default ChipCard;

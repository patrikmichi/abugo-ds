import React, { useCallback } from 'react';

import { cn } from '@/lib/utils';

import styles from './Chip.module.css';
import type { IProps, ChipSize } from './types';

const DeleteIcon = () => (
  <span className={cn('material-symbols-outlined', styles.trailingIconSymbol)}>
    cancel
  </span>
);

const ExpandIcon = () => (
  <span className={cn('material-symbols-outlined', styles.trailingIconSymbol)}>
    expand_more
  </span>
);

const getSizeKey = (size: ChipSize): string => {
  if (size === 'small') return 'sm';
  if (size === 'large') return 'lg';
  return 'md';
};

const getAvatarSize = (size: ChipSize): string => {
  if (size === 'small') return 'xs';
  if (size === 'large') return 'lg';
  return 'md';
};

const Chip = ({
  avatar,
  clickable = false,
  component,
  deleteIcon,
  disabled = false,
  icon,
  label,
  onDelete,
  expandable = false,
  onExpand,
  size = 'medium',
  selected = false,
  className,
  onClick,
  onKeyDown,
  children,
  ...props
}: IProps) => {
  const hasDelete = !!onDelete;
  const hasExpand = expandable && !!onExpand;
  const displayLabel = label ?? children;
  const isClickable = clickable || !!onClick;
  const hasLeadingIcon = !!(icon || avatar);
  const hasTrailingIcon = hasDelete || hasExpand;

  const RootComponent = component || (isClickable ? 'button' : 'div');
  const sizeKey = getSizeKey(size);
  const avatarSize = getAvatarSize(size);

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (disabled || !onDelete) return;
      onDelete(e);
    },
    [disabled, onDelete]
  );

  const handleExpand = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (disabled || !onExpand) return;
      onExpand(e);
    },
    [disabled, onExpand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (hasDelete && (e.key === 'Backspace' || e.key === 'Delete') && !disabled) {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(e as unknown as React.MouseEvent<HTMLElement>);
        return;
      }

      if (isClickable && (e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
        return;
      }

      onKeyDown?.(e);
    },
    [hasDelete, isClickable, disabled, onDelete, onClick, onKeyDown]
  );

  const handleTrailingKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    handler: (e: React.MouseEvent<HTMLElement>) => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handler(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const deleteIconElement = deleteIcon || (hasDelete ? <DeleteIcon /> : null);

  return (
    <RootComponent
      className={cn(
        styles.chip,
        styles[sizeKey],
        selected && styles.selected,
        isClickable && styles.clickable,
        disabled && styles.disabled,
        hasLeadingIcon && styles.hasLeadingIcon,
        hasTrailingIcon && styles.hasTrailingIcon,
        className
      )}
      onClick={isClickable && !disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      disabled={disabled && RootComponent === 'button' ? disabled : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {avatar && (
        <span className={styles.avatar}>
          {React.isValidElement(avatar)
            ? React.cloneElement(avatar, { size: avatarSize } as React.Attributes)
            : avatar}
        </span>
      )}

      {icon && !avatar && (
        <span className={styles.icon}>{icon}</span>
      )}

      {displayLabel && (
        <span className={styles.label}>{displayLabel}</span>
      )}

      {hasDelete && deleteIconElement && (
        <span
          className={styles.trailingIcon}
          onClick={handleDelete}
          onKeyDown={(e) => handleTrailingKeyDown(e, handleDelete)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Delete"
        >
          {deleteIconElement}
        </span>
      )}

      {hasExpand && (
        <span
          className={styles.trailingIcon}
          onClick={handleExpand}
          onKeyDown={(e) => handleTrailingKeyDown(e, handleExpand)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Expand"
        >
          <ExpandIcon />
        </span>
      )}
    </RootComponent>
  );
};

export default Chip;

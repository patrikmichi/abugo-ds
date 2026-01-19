import React, { useCallback } from 'react';
import styles from './Chip.module.css';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

export type ChipSize = 'small' | 'medium' | 'large';

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /** An element to display as an avatar within the chip (leading adornment) */
  avatar?: React.ReactElement;
  /** If true, the chip will appear clickable and raise when pressed, even if onClick is not defined */
  clickable?: boolean;
  /** The component used for the root node. Either a string to use a HTML element or a component */
  component?: React.ElementType;
  /** Override the default delete icon element */
  deleteIcon?: React.ReactElement;
  /** If true, the component is disabled */
  disabled?: boolean;
  /** Icon element (leading adornment) */
  icon?: React.ReactElement;
  /** The content of the component */
  label?: React.ReactNode;
  /** Callback fired when the delete icon is clicked. If set, the delete icon will be shown */
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void;
  /** If true, shows expand icon for dropdown menu functionality */
  expandable?: boolean;
  /** Callback fired when expand icon is clicked */
  onExpand?: (event: React.MouseEvent<HTMLElement>) => void;
  /** The size of the component */
  size?: ChipSize;
  /** If true, the chip is in selected state */
  selected?: boolean;
  /** Children - used as label if label prop is not provided */
  children?: React.ReactNode;
}

/**
 * Chip Component
 * 
 * Compact element that represents an input, attribute, or action.
 * Supports leading adornment (icon/avatar), trailing icon (delete/expand), and clickable filter functionality.
 * 
 * @example
 * ```tsx
 * // Basic chip
 * <Chip label="Chip" />
 * 
 * // Deletable chip
 * <Chip label="Chip" onDelete={() => {}} />
 * 
 * // Clickable filter chip
 * <Chip label="Filter" clickable onClick={() => {}} />
 * 
 * // Selected chip
 * <Chip label="Selected" selected />
 * 
 * // Chip with leading icon
 * <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" />
 * 
 * // Chip with avatar
 * <Chip avatar={<Avatar>M</Avatar>} label="Chip" />
 * 
 * // Expandable chip for dropdown
 * <Chip label="Menu" expandable onExpand={() => {}} />
 * ```
 */
export function Chip({
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
}: ChipProps) {
  const hasDelete = !!onDelete;
  const hasExpand = expandable && !!onExpand;
  const displayLabel = label ?? children;
  const isClickable = clickable || !!onClick;

  // Determine root component
  const RootComponent = component || (isClickable ? 'button' : 'div');

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (!disabled && onDelete) {
        onDelete(e);
      }
    },
    [disabled, onDelete]
  );

  const handleExpand = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (!disabled && onExpand) {
        onExpand(e);
      }
    },
    [disabled, onExpand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      // Handle delete on Backspace or Delete key
      if (hasDelete && (e.key === 'Backspace' || e.key === 'Delete') && !disabled) {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(e as any);
        return;
      }

      // Handle Enter/Space for clickable chips
      if (isClickable && (e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onClick?.(e as any);
        return;
      }

      onKeyDown?.(e);
    },
    [hasDelete, isClickable, disabled, onDelete, onClick, onKeyDown]
  );

  // Default delete icon
  const defaultDeleteIcon = (
    <span className={cn('material-symbols-outlined', styles.trailingIconSymbol)}>
      close
    </span>
  );

  // Default expand icon
  const defaultExpandIcon = (
    <span className={cn('material-symbols-outlined', styles.trailingIconSymbol)}>
      expand_more
    </span>
  );

  const deleteIconElement = deleteIcon || (hasDelete ? defaultDeleteIcon : null);
  const expandIconElement = hasExpand ? defaultExpandIcon : null;

  // Size mapping
  const sizeKey = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md';

  return (
    <RootComponent
      className={cn(
        styles.chip,
        styles[sizeKey],
        selected && styles.selected,
        isClickable && styles.clickable,
        disabled && styles.disabled,
        (hasDelete || hasExpand) && styles.hasTrailingIcon,
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
          {React.isValidElement(avatar) ? React.cloneElement(avatar, { size: size === 'small' ? 'xs' : size === 'large' ? 'lg' : 'md' } as any) : avatar}
        </span>
      )}
      {icon && !avatar && (
        <span className={styles.icon}>
          {icon}
        </span>
      )}
      {displayLabel && (
        <span className={styles.label}>
          {displayLabel}
        </span>
      )}
      {hasDelete && deleteIconElement && (
        <span
          className={styles.trailingIcon}
          onClick={handleDelete}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(e as any);
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Delete"
        >
          {deleteIconElement}
        </span>
      )}
      {hasExpand && expandIconElement && (
        <span
          className={styles.trailingIcon}
          onClick={handleExpand}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleExpand(e as any);
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Expand"
        >
          {expandIconElement}
        </span>
      )}
    </RootComponent>
  );
}

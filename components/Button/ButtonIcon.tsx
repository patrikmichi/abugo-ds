import React from 'react';

/**
 * Material Icons helper component for buttons
 * Uses Material Symbols Outlined font
 */
export interface ButtonIconProps {
  /** Material Icon name (e.g., 'add', 'delete', 'arrow_forward') */
  name: string;
  /** Icon size */
  size?: number | string;
  /** Additional className */
  className?: string;
}

/**
 * ButtonIcon component for rendering Material Icons in buttons
 * 
 * @example
 * ```tsx
 * <ButtonIcon name="add" size={24} />
 * ```
 */
export function ButtonIcon({ name, size = 24, className }: ButtonIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className || ''}`}
      style={{ 
        fontSize: size, 
        width: size, 
        height: size, 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        lineHeight: 1,
        color: 'inherit',
        flexShrink: 0
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

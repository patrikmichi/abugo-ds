import React from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

/**
 * Valid button type and variant combinations
 */
const VALID_COMBINATIONS: Record<string, string[]> = {
  primary: ['filled', 'plain'],
  secondary: ['outline', 'plain'],
  tertiary: ['outline'],
  danger: ['filled', 'plain'],
  upgrade: ['filled'],
};

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The semantic variant of the button (primary, secondary, etc.) */
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'upgrade';
  /** The visual type of the button (filled, plain, outline) */
  type?: 'filled' | 'plain' | 'outline';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** The content of the button */
  children: React.ReactNode;
}

/**
 * Button component with multiple variants, types, and sizes.
 * All styling is driven by design tokens for consistency.
 * 
 * Valid combinations:
 * - Primary: filled, plain
 * - Secondary: outline, plain
 * - Tertiary: outline
 * - Danger: filled, plain
 * - Upgrade: filled
 * 
 * @example
 * ```tsx
 * <Button variant="primary" type="filled" size="md">
 *   Click me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      type,
      size = 'md',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) {
  // Determine default type based on variant if not provided
  const defaultType = variant === 'primary' || variant === 'danger' || variant === 'upgrade' ? 'filled' : 'outline';
  const requestedType = type || defaultType;
  
  // Get valid types for this variant
  const validTypes = VALID_COMBINATIONS[variant] || [];
  
  // Validate combination (warn in development)
  if (process.env.NODE_ENV === 'development' && type && !validTypes.includes(requestedType)) {
    console.warn(
      `Invalid button combination: variant="${variant}" with type="${type}". ` +
      `Valid types for "${variant}" are: ${validTypes.join(', ')}. ` +
      `Using default type "${defaultType}" instead.`
    );
  }
  
  // Use valid type (fallback to first valid option if invalid)
  const finalType = validTypes.includes(requestedType) ? requestedType : (validTypes[0] || 'filled');
  
  // Create compound class name for variant + type
  const variantTypeClass = variant && finalType ? `${variant}${finalType.charAt(0).toUpperCase() + finalType.slice(1)}` : '';
  
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.button,
          variant && styles[variant],
          finalType && styles[finalType],
          variantTypeClass && styles[variantTypeClass],
          size && styles[size],
          disabled && styles.disabled,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

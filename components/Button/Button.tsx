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
  children?: React.ReactNode;
  /** Icon to display before the text */
  startIcon?: React.ReactNode;
  /** Icon to display after the text */
  endIcon?: React.ReactNode;
  /** Show loading spinner instead of content */
  loading?: boolean;
  /** Icon-only button (square) */
  iconOnly?: boolean;
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
const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      type,
      size = 'md',
      className,
      children,
      disabled,
      startIcon,
      endIcon,
      loading = false,
      iconOnly = false,
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
      `Using default type="${defaultType}" instead.`
    );
  }
  
  // Use valid type (fallback to first valid option if invalid)
  const finalType = validTypes.includes(requestedType) ? requestedType : (validTypes[0] || 'filled');
  
  // Create compound class name for variant + type
  const variantTypeClass = variant && finalType ? `${variant}${finalType.charAt(0).toUpperCase() + finalType.slice(1)}` : '';
  
  // Determine if button should be disabled (loading also disables)
  const isDisabled = disabled || loading;
  
  // Render loading spinner
  const renderLoadingSpinner = () => (
    <span className={styles.loadingSpinner} aria-hidden="true">
      <svg
        className={styles.spinner}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={styles.spinnerCircle}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="32"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="1.5s"
            values="0 32;16 16;0 32;0 32"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="1.5.5s"
            values="0;-16;-32;-32"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
  
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
        iconOnly && styles.iconOnly,
        loading && styles.loading,
        isDisabled && styles.disabled,
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        renderLoadingSpinner()
      ) : iconOnly ? (
        // Icon-only button: render children directly (should be an icon)
        children
      ) : (
        <>
          {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
          {children && <span className={styles.text}>{children}</span>}
          {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
        </>
      )}
    </button>
  );
  }
);

ButtonComponent.displayName = 'Button';

export const Button = ButtonComponent;

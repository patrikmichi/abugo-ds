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
 * Material Icon helper component (merged into Button file)
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

/**
 * Button component props - Standardized following major design system patterns
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** The semantic variant of the button (primary, secondary, etc.) */
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'upgrade';
  /** The visual type of the button (filled, plain, outline) */
  type?: 'filled' | 'plain' | 'outline';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** The content of the button */
  children?: React.ReactNode;
  
  /** Icon to display - can be a Material Icon name or React node */
  icon?: string | React.ReactNode;
  /** Position of the icon when using `icon` prop */
  iconPosition?: 'start' | 'end';
  /** Icon to display before the text (alternative to icon + iconPosition) */
  startIcon?: React.ReactNode;
  /** Icon to display after the text (alternative to icon + iconPosition) */
  endIcon?: React.ReactNode;
  
  /** Show loading spinner instead of content */
  loading?: boolean;
  /** Icon-only button (square) */
  iconOnly?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Render as link (href) instead of button */
  href?: string;
  /** Link target (when href is provided) */
  target?: string;
  /** Link rel (when href is provided) */
  rel?: string;
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
 * // Basic button
 * <Button variant="primary" type="filled" size="md">
 *   Click me
 * </Button>
 * 
 * // With icon
 * <Button icon="add" iconPosition="start">Add Item</Button>
 * 
 * // Link button
 * <Button href="/page" variant="primary">Go to Page</Button>
 * 
 * // Full width
 * <Button fullWidth variant="primary">Submit</Button>
 * ```
 */
const ButtonComponent = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      type,
      size = 'md',
      className,
      children,
      disabled,
      icon,
      iconPosition = 'start',
      startIcon,
      endIcon,
      loading = false,
      iconOnly = false,
      fullWidth = false,
      href,
      target,
      rel,
      onClick,
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
  
  // Handle icon prop - convert to startIcon/endIcon
  let resolvedStartIcon = startIcon;
  let resolvedEndIcon = endIcon;
  
  if (icon) {
    const iconElement = typeof icon === 'string' ? <ButtonIcon name={icon} /> : icon;
    if (iconPosition === 'start') {
      resolvedStartIcon = iconElement;
    } else {
      resolvedEndIcon = iconElement;
    }
  }
  
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
            dur="1.5s"
            values="0;-16;-32;-32"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
  
  // Build className
  const buttonClassName = cn(
    styles.button,
    variant && styles[variant],
    finalType && styles[finalType],
    variantTypeClass && styles[variantTypeClass],
    size && styles[size],
    iconOnly && styles.iconOnly,
    loading && styles.loading,
    isDisabled && styles.disabled,
    fullWidth && styles.fullWidth,
    className
  );
  
  // Render content
  const renderContent = () => {
    if (loading) {
      return renderLoadingSpinner();
    }
    if (iconOnly) {
      // Icon-only button: render children directly (should be an icon)
      return children;
    }
    return (
      <>
        {resolvedStartIcon && <span className={styles.startIcon}>{resolvedStartIcon}</span>}
        {children && <span className={styles.text}>{children}</span>}
        {resolvedEndIcon && <span className={styles.endIcon}>{resolvedEndIcon}</span>}
      </>
    );
  };
  
  // Render as link if href is provided
  if (href) {
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={buttonClassName}
        aria-busy={loading}
        aria-disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e as any);
        }}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {renderContent()}
      </a>
    );
  }
  
  // Render as button
  return (
    <button
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      type="button"
      className={buttonClassName}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
  }
);

ButtonComponent.displayName = 'Button';

export const Button = ButtonComponent;

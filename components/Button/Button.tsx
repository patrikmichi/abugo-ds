import React from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';

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
        width: '1em',
        height: '1em',
        display: 'block',
        lineHeight: 1,
        fontFamily: "'Material Symbols Outlined'",
        color: 'inherit',
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
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'onKeyDown'> {
  /** Click handler - accepts both button and anchor events */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Key down handler - accepts both button and anchor events */
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** The semantic variant of the button (primary, secondary, etc.) */
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'upgrade';
  /** The visual appearance of the button (filled, plain, outline) */
  appearance?: 'filled' | 'plain' | 'outline';
  /** @deprecated Use `appearance` instead. The visual type of the button (filled, plain, outline) */
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
  /** Icon-only button (square) - requires aria-label for accessibility */
  iconOnly?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Render as link (href) instead of button */
  href?: string;
  /** Link target (when href is provided) */
  target?: string;
  /** Link rel (when href is provided) */
  rel?: string;

  /** Tooltip text to show when button is disabled */
  disabledTooltip?: string;
  /** ARIA label for icon-only buttons (required when iconOnly is true) */
  'aria-label'?: string;
  /** ARIA describedby - ID of element that describes the button */
  'aria-describedby'?: string;
  /** ARIA expanded - Whether the button controls an expanded element */
  'aria-expanded'?: boolean;
  /** ARIA pressed - Whether the button is in a pressed state (toggle buttons) */
  'aria-pressed'?: boolean;
  /** ARIA controls - ID of element controlled by this button */
  'aria-controls'?: string;
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
// Type for button/anchor click events - use union types properly
type ButtonClickEvent = React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>;
type ButtonKeyboardEvent = React.KeyboardEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLAnchorElement>;

const ButtonComponent = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  function Button(
    {
      variant = 'primary',
      appearance,
      type, // Deprecated, use appearance instead
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
      onKeyDown,
      disabledTooltip,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'aria-controls': ariaControls,
      ...props
    },
    ref
  ) {
    // Validate icon-only buttons require aria-label
    if (iconOnly && !ariaLabel && !children && process.env.NODE_ENV === 'development') {
      console.warn(
        'Button: iconOnly buttons require an aria-label prop for accessibility. ' +
        'Please provide an aria-label describing the button\'s action.'
      );
    }

    // Use appearance prop, fallback to deprecated type prop
    const visualType = appearance || type;

    // Determine default type based on variant if not provided
    const defaultType = variant === 'primary' || variant === 'danger' || variant === 'upgrade' ? 'filled' : 'outline';
    const requestedType = visualType || defaultType;

    // Get valid types for this variant
    const validTypes = VALID_COMBINATIONS[variant] || [];

    // Validate combination (warn in development)
    if (process.env.NODE_ENV === 'development' && visualType && !validTypes.includes(requestedType)) {
      console.warn(
        `Invalid button combination: variant="${variant}" with appearance="${visualType}". ` +
        `Valid appearances for "${variant}" are: ${validTypes.join(', ')}. ` +
        `Using default appearance="${defaultType}" instead.`
      );
    }

    // Handle keyboard events - separate handlers for button and anchor
    const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Enter and Space keys
      if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
        e.preventDefault();
        // For buttons, programmatically trigger click which will call onClick
        e.currentTarget.click();
      }
      // Call user's onKeyDown handler with proper typing
      if (onKeyDown) {
        onKeyDown(e as React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>);
      }
    };

    const handleAnchorKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      // Handle Enter and Space keys
      if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
        e.preventDefault();
        e.currentTarget.click();
      }
      // Call user's onKeyDown handler - anchor keyboard events are compatible
      onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>);
    };

    // Handle click events - separate handlers for button and anchor
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      // Button click events are compatible with union type
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
    };

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      // Anchor click events are compatible with union type
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
    };

    // Use valid type (fallback to first valid option if invalid)
    const finalType = validTypes.includes(requestedType) ? requestedType : (validTypes[0] || 'filled');

    // Create compound class name for variant + type
    const variantTypeClass = variant && finalType ? `${variant}${finalType.charAt(0).toUpperCase() + finalType.slice(1)}` : '';

    // Determine if button should be disabled (loading also disables)
    const isDisabled = disabled || loading;

    // Determine icon size based on button size and appearance
    // Small plain buttons should use 20x20px icons
    const getIconSize = (): number => {
      if (size === 'sm' && (appearance === 'plain' || finalType === 'plain')) {
        return 20;
      }
      // Default icon sizes for other button sizes
      if (size === 'sm') return 20;
      if (size === 'md') return 24;
      if (size === 'lg') return 24;
      return 24; // default
    };

    const iconSize = getIconSize();

    // Helper to ensure icon has correct size if it's a ButtonIcon
    const ensureIconSize = (iconElement: React.ReactNode): React.ReactNode => {
      if (React.isValidElement(iconElement)) {
        // Check if it's a ButtonIcon by checking if it has a 'name' prop (ButtonIcon signature)
        const props = iconElement.props as any;
        if (props && 'name' in props && typeof props.name === 'string') {
          // It's likely a ButtonIcon, clone with correct size
          return React.cloneElement(iconElement as React.ReactElement<any>, { size: iconSize });
        }
      }
      return iconElement;
    };

    // Handle icon prop - convert to startIcon/endIcon
    let resolvedStartIcon = startIcon ? ensureIconSize(startIcon) : null;
    let resolvedEndIcon = endIcon ? ensureIconSize(endIcon) : null;

    if (icon) {
      const iconElement = typeof icon === 'string' ? <ButtonIcon name={icon} size={iconSize} /> : ensureIconSize(icon);
      if (iconPosition === 'start') {
        resolvedStartIcon = iconElement;
      } else {
        resolvedEndIcon = iconElement;
      }
    }

    // Render loading spinner
    const renderLoadingSpinner = () => (
      <span className={styles.loadingSpinner} aria-hidden="true">
        <span className="material-symbols-outlined" style={{
          fontSize: 'var(--token-primitive-icon-size-icon-size-2)',
          animation: 'spin 1s linear infinite',
          display: 'inline-block'
        }}>
          progress_activity
        </span>
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
        // Ensure icon uses the correct size if it's a ButtonIcon
        return ensureIconSize(children);
      }
      return (
        <>
          {resolvedStartIcon && <span className={styles.startIcon}>{resolvedStartIcon}</span>}
          {children && <span className={styles.text}>{children}</span>}
          {resolvedEndIcon && <span className={styles.endIcon}>{resolvedEndIcon}</span>}
        </>
      );
    };

    // Build ARIA attributes
    const ariaAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement> = {
      'aria-busy': loading,
      'aria-disabled': isDisabled,
      ...(ariaLabel && { 'aria-label': ariaLabel }),
      ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
      ...(ariaExpanded !== undefined && { 'aria-expanded': ariaExpanded }),
      ...(ariaPressed !== undefined && { 'aria-pressed': ariaPressed }),
      ...(ariaControls && { 'aria-controls': ariaControls }),
    };

    // Render as link if href is provided
    if (href) {
      const linkElement = (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          target={target}
          rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={buttonClassName}
          onClick={handleAnchorClick}
          onKeyDown={handleAnchorKeyDown}
          style={{ pointerEvents: isDisabled ? 'none' : undefined }}
          title={isDisabled && disabledTooltip ? disabledTooltip : undefined}
          {...ariaAttributes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}
        </a>
      );

      // Wrap with tooltip if disabled and tooltip provided
      if (isDisabled && disabledTooltip) {
        // For disabled links, we'll use title attribute (native tooltip)
        // Tooltip component requires hover which doesn't work well with pointer-events: none
        return linkElement;
      }

      return linkElement;
    }

    // Render as button
    const buttonElement = (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        className={buttonClassName}
        disabled={isDisabled}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        title={isDisabled && disabledTooltip ? disabledTooltip : undefined}
        {...ariaAttributes}
        {...props}
      >
        {renderContent()}
      </button>
    );

    // Wrap with tooltip if disabled and tooltip provided
    if (isDisabled && disabledTooltip) {
      return (
        <Tooltip content={disabledTooltip} placement="top">
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  }
);

ButtonComponent.displayName = 'Button';

// Memoize component for performance
export const Button = React.memo(ButtonComponent);

import React, { forwardRef, memo, isValidElement, cloneElement } from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';
import { ButtonIcon } from './ButtonIcon';
import { VALID_COMBINATIONS, ICON_SIZES } from './const';
import type { ButtonProps, ButtonAppearance } from './types';

// Re-export types
export type { ButtonProps, ButtonIconProps, ButtonVariant, ButtonAppearance, ButtonSize, BaseButtonProps } from './types';
export { ButtonIcon } from './ButtonIcon';

const ButtonComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      appearance,
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
      inverted = false,
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
    const isDisabled = disabled || loading;
    const visualType = appearance || type;
    const defaultAppearance: ButtonAppearance = variant === 'secondary' ? 'outline' : 'filled';
    const requestedAppearance = visualType || defaultAppearance;
    const validAppearances = VALID_COMBINATIONS[variant] || [];
    const finalAppearance = validAppearances.includes(requestedAppearance)
      ? requestedAppearance
      : validAppearances[0] || 'filled';

    // Dev warnings
    if (process.env.NODE_ENV === 'development') {
      if (iconOnly && !ariaLabel && !children) {
        console.warn('Button: iconOnly buttons require an aria-label prop for accessibility.');
      }
      if (visualType && !validAppearances.includes(requestedAppearance)) {
        console.warn(
          `Invalid button combination: variant="${variant}" with appearance="${visualType}". ` +
          `Valid: ${validAppearances.join(', ')}.`
        );
      }
    }

    const iconSize = ICON_SIZES[size];
    const variantAppearanceClass = `${variant}${finalAppearance.charAt(0).toUpperCase() + finalAppearance.slice(1)}`;

    const ensureIconSize = (iconElement: React.ReactNode): React.ReactNode => {
      if (!isValidElement(iconElement)) return iconElement;
      const iconProps = iconElement.props as { name?: string; size?: number };
      if (iconProps && 'name' in iconProps && typeof iconProps.name === 'string') {
        return cloneElement(iconElement as React.ReactElement<{ size?: number }>, { size: iconSize });
      }
      return iconElement;
    };

    let resolvedStartIcon = startIcon ? ensureIconSize(startIcon) : null;
    let resolvedEndIcon = endIcon ? ensureIconSize(endIcon) : null;

    if (icon) {
      const iconElement = typeof icon === 'string'
        ? <ButtonIcon name={icon} size={iconSize} />
        : ensureIconSize(icon);
      if (iconPosition === 'start') {
        resolvedStartIcon = iconElement;
      } else {
        resolvedEndIcon = iconElement;
      }
    }

    const buttonClassName = cn(
      styles.button,
      styles[variant],
      styles[finalAppearance],
      styles[variantAppearanceClass],
      styles[size],
      iconOnly && styles.iconOnly,
      inverted && styles.inverted,
      loading && styles.loading,
      isDisabled && styles.disabled,
      fullWidth && styles.fullWidth,
      className
    );

    const ariaAttributes = {
      'aria-busy': loading,
      'aria-disabled': isDisabled,
      ...(ariaLabel && { 'aria-label': ariaLabel }),
      ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
      ...(ariaExpanded !== undefined && { 'aria-expanded': ariaExpanded }),
      ...(ariaPressed !== undefined && { 'aria-pressed': ariaPressed }),
      ...(ariaControls && { 'aria-controls': ariaControls }),
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      }
      onKeyDown?.(e);
    };

    const renderContent = () => {
      if (loading) {
        return (
          <span className={styles.loadingSpinner} aria-hidden="true">
            <span className="material-symbols-outlined">progress_activity</span>
          </span>
        );
      }
      if (iconOnly) {
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

    if (href) {
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          target={target}
          rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={buttonClassName}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          style={{ pointerEvents: isDisabled ? 'none' : undefined }}
          title={isDisabled && disabledTooltip ? disabledTooltip : undefined}
          {...ariaAttributes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}
        </a>
      );
    }

    const buttonElement = (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        className={buttonClassName}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={isDisabled && disabledTooltip ? disabledTooltip : undefined}
        {...ariaAttributes}
        {...props}
      >
        {renderContent()}
      </button>
    );

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

export const Button = memo(ButtonComponent);

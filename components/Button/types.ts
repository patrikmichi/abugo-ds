import type React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'upgrade';
export type ButtonAppearance = 'filled' | 'plain' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonIconProps {
  /** Material Icon name (e.g., 'add', 'delete', 'arrow_forward') */
  name: string;
  /** Icon size */
  size?: number | string;
  /** Additional className */
  className?: string;
}

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'onKeyDown'> {
  /** Click handler - accepts both button and anchor events */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Key down handler - accepts both button and anchor events */
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** The semantic variant of the button */
  variant?: ButtonVariant;
  /** The visual appearance of the button */
  appearance?: ButtonAppearance;
  /** @deprecated Use `appearance` instead */
  type?: ButtonAppearance;
  /** The size of the button */
  size?: ButtonSize;
  /** The content of the button */
  children?: React.ReactNode;
  /** Icon to display - can be a Material Icon name or React node */
  icon?: string | React.ReactNode;
  /** Position of the icon when using `icon` prop */
  iconPosition?: 'start' | 'end';
  /** Icon to display before the text */
  startIcon?: React.ReactNode;
  /** Icon to display after the text */
  endIcon?: React.ReactNode;
  /** Show loading spinner instead of content */
  loading?: boolean;
  /** Icon-only button (square) - requires aria-label for accessibility */
  iconOnly?: boolean;
  /** Inverted colors for use on dark backgrounds */
  inverted?: boolean;
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
  /** ARIA label for icon-only buttons */
  'aria-label'?: string;
  /** ARIA describedby */
  'aria-describedby'?: string;
  /** ARIA expanded */
  'aria-expanded'?: boolean;
  /** ARIA pressed */
  'aria-pressed'?: boolean;
  /** ARIA controls */
  'aria-controls'?: string;
}

export type BaseButtonProps = Omit<ButtonProps, 'variant' | 'appearance'>;

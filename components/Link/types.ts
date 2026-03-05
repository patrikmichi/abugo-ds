import type React from 'react';

export type LinkVariant = 'default' | 'secondary';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** The destination URL */
  href: string;
  /** Link variant */
  variant?: LinkVariant;
  /** Whether the link opens in a new browser tab */
  openNewTab?: boolean;
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Children - link text content */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';
export type BadgeVariant = 'success' | 'warning' | 'error' | 'upgrade';
export type BadgeSize = 'default' | 'small';

export interface IProps extends HTMLAttributes<HTMLSpanElement> {
  /** Number to show in badge */
  count?: number;
  /** Show a red dot instead of count */
  dot?: boolean;
  /** Maximum number to show before showing overflow (e.g., 99+) */
  overflowCount?: number;
  /** Whether to show badge when count is 0 */
  showZero?: boolean;
  /** Status dot with predefined colors */
  status?: BadgeStatus;
  /** Color variant for badge (count/dot mode) */
  variant?: BadgeVariant;
  /** Text to display next to status dot */
  text?: ReactNode;
  /** Size of badge */
  size?: BadgeSize;
  /** Title text for badge (tooltip) */
  title?: string;
  /** Children - element to attach badge to */
  children?: ReactNode;
}

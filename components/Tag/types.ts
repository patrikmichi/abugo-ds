import { type HTMLAttributes, type ReactNode } from 'react';

export type TagVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export type TagSize = 'sm' | 'md' | 'lg';

export interface IProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color variant */
  variant?: TagVariant;
  /** Custom color (hex/rgb). Overrides variant. Auto-generates background and border. */
  color?: string;
  /** Tag size */
  size?: TagSize;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Label content */
  children?: ReactNode;
}

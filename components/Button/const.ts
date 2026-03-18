import type { ButtonVariant, ButtonAppearance } from './types';

export const VALID_COMBINATIONS: Record<ButtonVariant, ButtonAppearance[]> = {
  primary: ['filled', 'outline', 'plain'],
  secondary: ['filled', 'outline', 'plain'],
  danger: ['filled', 'outline', 'plain'],
  upgrade: ['filled'],
};

export const ICON_SIZES: Record<'sm' | 'md' | 'lg', number> = {
  sm: 20,
  md: 24,
  lg: 24,
};

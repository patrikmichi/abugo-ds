import type React from 'react';

export type RatingMode = 'multi' | 'single';
export type RatingSize = 'sm' | 'lg';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rating value (0-max) */
  value: number;
  /** Maximum rating value */
  max?: number;
  /** Number of reviews */
  count?: number;
  /** Display mode: 'multi' shows all stars, 'single' shows one star */
  mode?: RatingMode;
  /** Size variant */
  size?: RatingSize;
}

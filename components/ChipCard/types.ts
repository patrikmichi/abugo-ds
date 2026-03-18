import type React from 'react';

export interface IProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The headline text */
  headline: React.ReactNode;
  /** Optional subtext displayed below the headline */
  subtext?: React.ReactNode;
  /** If true, the chip card is in selected state */
  selected?: boolean;
  /** If true, the component is disabled */
  disabled?: boolean;
  /** The component used for the root node */
  component?: React.ElementType;
}

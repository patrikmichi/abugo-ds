import type React from 'react';

export type SpinnerAppearance = 'inherit' | 'invert';

export type SpinnerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  /** Determines the spinner's color scheme */
  appearance?: SpinnerAppearance;
  /** Delay in milliseconds before the spinner appears */
  delay?: number;
  /** Descriptive label for assistive technologies */
  label?: string;
  /** Size of the spinner */
  size?: SpinnerSize;
}

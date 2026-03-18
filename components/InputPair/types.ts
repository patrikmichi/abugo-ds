import type React from 'react';

export type InputPairSize = 'sm' | 'md' | 'lg';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field size */
  size?: InputPairSize;
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** First input value */
  firstValue?: string;
  /** Second input value */
  secondValue?: string;
  /** First input change handler */
  onFirstChange?: (value: string) => void;
  /** Second input change handler */
  onSecondChange?: (value: string) => void;
  /** First input placeholder */
  firstPlaceholder?: string;
  /** Second input placeholder */
  secondPlaceholder?: string;
  /** ARIA label for the first input */
  firstAriaLabel?: string;
  /** ARIA label for the second input */
  secondAriaLabel?: string;
}

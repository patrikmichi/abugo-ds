import type { HTMLAttributes } from 'react';

export type InputOTPLength = 4 | 6 | 8;
export type InputOTPSize = 'sm' | 'md' | 'lg';

export interface InputOTPProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Number of OTP cells */
  length?: InputOTPLength;
  /** Size variant — matches Input sizing */
  size?: InputOTPSize;
  /** Current value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when all cells are filled */
  onComplete?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Auto-focus first cell on mount */
  autoFocus?: boolean;
}

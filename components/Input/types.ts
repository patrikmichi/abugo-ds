import type { InputHTMLAttributes, ReactNode, KeyboardEvent } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  /** The size of the input box */
  size?: InputSize;
  /** Set validation status. When used with Field wrapper, Field manages this automatically. */
  error?: boolean;
  /** Prefix icon or content inside the input, positioned before the user's input */
  prefix?: ReactNode;
  /** Suffix icon or content inside the input, positioned after the user's input */
  suffix?: ReactNode;
  /** Addon element before (to the left of) the input field */
  addonBefore?: ReactNode;
  /** Addon element after (to the right of) the input field */
  addonAfter?: ReactNode;
  /** Callback when Enter key is pressed */
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

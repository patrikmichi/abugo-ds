import type React from 'react';

export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'prefix'> {
  /** The current value */
  value?: number | null;
  /** The initial value */
  defaultValue?: number | null;
  /** Callback when value changes */
  onChange?: (value: number | null) => void;
  /** The size of the input box */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is readonly */
  readOnly?: boolean;
  /** The minimum value */
  min?: number;
  /** The maximum value */
  max?: number;
  /** The step value */
  step?: number;
  /** The precision of input value */
  precision?: number;
  /** Format the displayed value */
  formatter?: (value: number) => string;
  /** Parse the input string to a number */
  parser?: (value: string) => number;
  /** Whether to show +- controls */
  controls?: boolean;
  /** The prefix content */
  prefix?: React.ReactNode;
  /** The suffix content */
  suffix?: React.ReactNode;
}

export interface InputNumberRef {
  focus: () => void;
  blur: () => void;
}

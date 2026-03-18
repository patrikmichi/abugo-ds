import type React from 'react';

export interface RadioChangeEvent {
  target: {
    value: string;
    checked: boolean;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: Event;
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Whether radio is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Value of radio */
  value?: string;
  /** Whether radio is disabled */
  disabled?: boolean;
  /** Callback when radio state changes */
  onChange?: (e: RadioChangeEvent) => void;
  /** Children (label content) */
  children?: React.ReactNode;
}

export interface RadioOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onChange?: (e: RadioChangeEvent) => void;
  /** Options array */
  options?: (string | RadioOption)[];
  /** Disable all radios */
  disabled?: boolean;
  /** Name attribute */
  name?: string;
  /** Children (Radio components) */
  children?: React.ReactNode;
}

export interface RadioGroupContextType {
  value?: string;
  onChange?: (e: RadioChangeEvent) => void;
  disabled?: boolean;
  name?: string;
}

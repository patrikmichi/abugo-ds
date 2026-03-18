import React from 'react';

export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: React.ChangeEvent<HTMLInputElement>['nativeEvent'];
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Whether the checkbox is checked by default (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox has error state */
  error?: boolean;
  /** Set indeterminate state */
  indeterminate?: boolean;
  /** Callback when state changes */
  onChange?: (e: CheckboxChangeEvent) => void;
  /** Auto focus */
  autoFocus?: boolean;
  /** Custom class name */
  className?: string;
  /** Children (label content) */
  children?: React.ReactNode;
}

export interface CheckboxOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current selected values (controlled) */
  value?: string[];
  /** Default selected values (uncontrolled) */
  defaultValue?: string[];
  /** Callback when selected values change */
  onChange?: (checkedValue: string[]) => void;
  /** Disable all checkboxes */
  disabled?: boolean;
  /** Name attribute for all checkboxes */
  name?: string;
  /** Options */
  options?: string[] | CheckboxOption[];
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Custom class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

export interface CheckboxGroupContextValue {
  value?: string[];
  disabled?: boolean;
  name?: string;
  onChange?: (checkedValue: string[]) => void;
  registerValue: (value: string) => void;
  cancelValue: (value: string) => void;
}

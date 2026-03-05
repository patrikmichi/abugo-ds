import type React from 'react';

export type InputGroupSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field size */
  size?: InputGroupSize;
  /** Whether the field has a validation error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Input value */
  inputValue?: string;
  /** Select value */
  selectValue?: string;
  /** Input change handler */
  onInputChange?: (value: string) => void;
  /** Select change handler */
  onSelectChange?: (value: string) => void;
  /** Input placeholder */
  inputPlaceholder?: string;
  /** Select options */
  selectOptions?: SelectOption[];
  /** ARIA label for the input */
  inputAriaLabel?: string;
  /** ARIA label for the select */
  selectAriaLabel?: string;
}

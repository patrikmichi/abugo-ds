import type React from 'react';

export type AutoCompleteValue = string;

export interface AutoCompleteOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export type AutoCompleteDataSource = string | AutoCompleteOption | (string | AutoCompleteOption)[];

export interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSelect' | 'value' | 'defaultValue' | 'size'> {
  /** Current value (controlled) */
  value?: AutoCompleteValue;
  /** Default value (uncontrolled) */
  defaultValue?: AutoCompleteValue;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Options data source */
  options?: AutoCompleteOption[];
  /** Data source (legacy prop name) */
  dataSource?: AutoCompleteDataSource;
  /** Filter options */
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean);
  /** Placeholder */
  placeholder?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow clear */
  allowClear?: boolean;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
  /** Whether dropdown matches input width */
  dropdownMatchSelectWidth?: boolean;
  /** Content to show when no options match */
  notFoundContent?: React.ReactNode;
}

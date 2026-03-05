import React from 'react';

export type DatePickerPicker = 'date' | 'week' | 'month' | 'quarter' | 'year';
export type DatePickerValue = Date | null;
export type DatePickerRangeValue = [Date | null, Date | null] | null;

export interface DatePickerPreset {
  label: string;
  value: Date | (() => Date);
}

export interface DatePickerRangePreset {
  label: string;
  value: DatePickerRangeValue | (() => DatePickerRangeValue);
}

export interface DatePickerShowTime {
  format?: string;
  defaultValue?: Date;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  hideDisabledOptions?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour?: number) => number[];
  disabledSeconds?: (selectedHour?: number, selectedMinute?: number) => number[];
}

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size'> {
  /** Current value (controlled) */
  value?: DatePickerValue;
  /** Default value (uncontrolled) */
  defaultValue?: DatePickerValue;
  /** Callback when value changes */
  onChange?: (date: DatePickerValue, dateString: string | string[]) => void;
  /** Picker type */
  picker?: DatePickerPicker;
  /** Date format */
  format?: string | string[];
  /** Show time picker */
  showTime?: boolean | DatePickerShowTime;
  /** Disable dates */
  disabledDate?: (current: Date) => boolean;
  /** Placeholder */
  placeholder?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Suffix icon */
  suffixIcon?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Get calendar container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Allow clear */
  allowClear?: boolean;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
  /** Quick-select presets shown in sidebar */
  presets?: DatePickerPreset[];
  /** Called when Cancel is clicked (presets mode) */
  onCancel?: () => void;
  /** Called when Save is clicked (presets mode) */
  onSave?: (date: DatePickerValue, dateString: string) => void;
  /** Cancel button label */
  cancelText?: string;
  /** Save button label */
  saveText?: string;
}

export interface RangePickerProps extends Omit<DatePickerProps, 'value' | 'defaultValue' | 'onChange' | 'presets' | 'onSave'> {
  /** Current value (controlled) */
  value?: DatePickerRangeValue;
  /** Default value (uncontrolled) */
  defaultValue?: DatePickerRangeValue;
  /** Callback when value changes */
  onChange?: (dates: DatePickerRangeValue, dateStrings: [string, string]) => void;
  /** Separator between dates */
  separator?: string;
  /** Quick-select presets shown in sidebar */
  presets?: DatePickerRangePreset[];
  /** Called when Save is clicked (presets mode) */
  onSave?: (dates: DatePickerRangeValue, dateStrings: [string, string]) => void;
}

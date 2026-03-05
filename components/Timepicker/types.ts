import type React from 'react';

export type TimePickerValue = Date | null;
export type TimePickerSize = 'sm' | 'md' | 'lg';

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size'> {
  /** Current value (controlled) */
  value?: TimePickerValue;
  /** Default value (uncontrolled) */
  defaultValue?: TimePickerValue;
  /** Callback when value changes */
  onChange?: (time: TimePickerValue, timeString: string) => void;
  /** Time format */
  format?: string;
  /** Use 12-hour format */
  use12Hours?: boolean;
  /** Hour step */
  hourStep?: number;
  /** Minute step */
  minuteStep?: number;
  /** Function to disable specific hours */
  disabledHours?: () => number[];
  /** Function to disable specific minutes */
  disabledMinutes?: (selectedHour?: number) => number[];
  /** Placeholder */
  placeholder?: string;
  /** Size */
  size?: TimePickerSize;
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
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Open state (controlled) */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Allow clear */
  allowClear?: boolean;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
}

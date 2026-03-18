import React from 'react';

export interface DurationPickerProps {
  /** Hours value (controlled) */
  hours?: number;
  /** Minutes value (controlled) */
  minutes?: number;
  /** Default hours (uncontrolled) */
  defaultHours?: number;
  /** Default minutes (uncontrolled) */
  defaultMinutes?: number;
  /** Change handler */
  onChange?: (hours: number, minutes: number) => void;
  /** Mode: 'hours-minutes' shows 2 columns, 'minutes' shows 1 column */
  mode?: 'hours-minutes' | 'minutes';
  /** Maximum hours in the picker (default: 24) */
  maxHours?: number;
  /** Hour step (default: 1) */
  hourStep?: number;
  /** Minute step (default: 15) */
  minuteStep?: number;
  /** Maximum minutes in minutes-only mode (default: 120) */
  maxMinutes?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow clearing the value */
  allowClear?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Suffix icon override */
  suffixIcon?: React.ReactNode;
  /** Open state (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
  /** ARIA label */
  'aria-label'?: string;
}

export interface DurationPickerPanelProps {
  mode: 'hours-minutes' | 'minutes';
  hours: number;
  minutes: number;
  hourOptions: number[];
  minuteOptions: number[];
  onHourSelect: (hour: number) => void;
  onMinuteSelect: (minute: number) => void;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
}

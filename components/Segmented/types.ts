import type React from 'react';

export type SegmentedSize = 'small' | 'default' | 'large';

export interface SegmentedOption {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export type SegmentedOptionType = string | number | SegmentedOption;

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of segment options */
  options: SegmentedOptionType[];
  /** Current selected value (controlled) */
  value?: string | number;
  /** Default selected value (uncontrolled) */
  defaultValue?: string | number;
  /** Callback when selection changes */
  onChange?: (value: string | number) => void;
  /** Whether to stretch to fit parent width */
  block?: boolean;
  /** Size of segmented control */
  size?: SegmentedSize;
  /** Whether all segments are disabled */
  disabled?: boolean;
}

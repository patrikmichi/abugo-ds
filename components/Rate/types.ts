import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';

export type RateSize = 'sm' | 'md' | 'lg';

export interface RateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (controlled) */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Callback when hover value changes */
  onHoverChange?: (value: number) => void;
  /** Whether clicking selected star clears rating */
  allowClear?: boolean;
  /** Number of stars */
  count?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Tooltips for each star */
  tooltips?: string[];
  /** Custom character for stars */
  character?: ReactNode | ((index: number) => ReactNode);
  /** Size variant */
  size?: RateSize;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
}

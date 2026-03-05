import type { HTMLAttributes, ReactNode } from 'react';

export type SliderValue = number | [number, number];

export interface SliderMarks {
  [key: number]: ReactNode | { style?: React.CSSProperties; label?: ReactNode };
}

export interface SliderTooltipProps {
  /** Whether tooltip is always visible */
  open?: boolean;
  /** Tooltip placement */
  placement?: 'top' | 'bottom';
  /** Custom formatter */
  formatter?: (value: number) => ReactNode;
}

export interface IProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current value (controlled) */
  value?: SliderValue;
  /** Default value (uncontrolled) */
  defaultValue?: SliderValue;
  /** Callback when value changes */
  onChange?: (value: SliderValue) => void;
  /** Callback after value changes (on mouse up) */
  onChangeComplete?: (value: SliderValue) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
  /** Range mode (dual thumbs) */
  range?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Vertical orientation */
  vertical?: boolean;
  /** Show dots for each step */
  dots?: boolean;
  /** Marks on slider */
  marks?: SliderMarks;
  /** Tooltip configuration */
  tooltip?: SliderTooltipProps | boolean;
}

export interface IHandleProps {
  value: number;
  index: number;
  min: number;
  max: number;
  disabled: boolean;
  vertical: boolean;
  isActive: boolean;
  tooltipConfig: SliderTooltipProps | null;
  tooltipVisible: boolean;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onTooltipVisibleChange: (index: number, visible: boolean) => void;
  getPercentage: (val: number) => number;
}

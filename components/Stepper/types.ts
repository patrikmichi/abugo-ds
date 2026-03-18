import type React from 'react';

export type StepperDirection = 'horizontal' | 'vertical';
export type StepperSize = 'default' | 'small';
export type StepperStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepperLabelPlacement = 'horizontal' | 'vertical';

export interface StepItem {
  /** Title of the step */
  title?: React.ReactNode;
  /** Subtitle of the step */
  subTitle?: React.ReactNode;
  /** Description of the step */
  description?: React.ReactNode;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Status of the step */
  status?: StepperStatus;
  /** Whether the step is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface StepperContextValue {
  current: number;
  direction: StepperDirection;
  size: StepperSize;
  status: StepperStatus;
  labelPlacement: StepperLabelPlacement;
  progressDot?: boolean | ((iconDot: React.ReactNode, info: { index: number; status: StepperStatus; title: React.ReactNode; description: React.ReactNode }) => React.ReactNode);
  onChange?: (current: number) => void;
}

export type ProgressDotRender = (
  iconDot: React.ReactNode,
  info: { index: number; status: StepperStatus; title: React.ReactNode; description: React.ReactNode }
) => React.ReactNode;

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current step (0-based) */
  current?: number;
  /** Initial step (0-based), used when uncontrolled */
  initial?: number;
  /** Layout direction */
  direction?: StepperDirection;
  /** Size of the steps */
  size?: StepperSize;
  /** Status of the current step */
  status?: StepperStatus;
  /** Label placement relative to the icon */
  labelPlacement?: StepperLabelPlacement;
  /** Show progress dot style instead of numbered icons */
  progressDot?: boolean | ProgressDotRender;
  /** Step configuration items (alternative to children) */
  items?: StepItem[];
  /** Callback when step changes */
  onChange?: (current: number) => void;
  /** Custom class name */
  className?: string;
  /** Children (Step components) - alternative to items prop */
  children?: React.ReactNode;
}

export interface StepProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title */
  title?: React.ReactNode;
  /** Subtitle */
  subTitle?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Status override */
  status?: StepperStatus;
  /** Whether the step is disabled */
  disabled?: boolean;
  /** Internal: step index */
  stepIndex?: number;
  /** Internal: total step count */
  stepCount?: number;
}

// Backwards-compatible type aliases
export type IProps = StepperProps;
export type StepperStepProps = StepProps;

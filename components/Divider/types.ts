import React from 'react';

export type DividerType = 'horizontal' | 'vertical';
export type DividerOrientation = 'left' | 'right' | 'center';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Divider type */
  type?: DividerType;
  /** Dashed style */
  dashed?: boolean;
  /** Text orientation */
  orientation?: DividerOrientation;
  /** Plain text style */
  plain?: boolean;
  /** Custom class name */
  className?: string;
  /** Children (text content) */
  children?: React.ReactNode;
}

import type React from 'react';

export type GridGutter =
  | number
  | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
export type GridAlign = 'top' | 'middle' | 'bottom';
export type GridJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';
export type GridSpan = number;
export type GridOffset = number;
export type GridOrder = number;
export type GridPull = number;
export type GridPush = number;
export type GridFlex = number | string;

export interface GridColProps {
  /** Number of columns to span (1-24) */
  span?: GridSpan;
  /** Number of columns to offset */
  offset?: GridOffset;
  /** Order of column */
  order?: GridOrder;
  /** Number of columns to pull */
  pull?: GridPull;
  /** Number of columns to push */
  push?: GridPush;
  /** Flex value */
  flex?: GridFlex;
  /** Responsive properties for xs breakpoint */
  xs?: GridSpan | { span?: GridSpan; offset?: GridOffset; order?: GridOrder; pull?: GridPull; push?: GridPush };
  /** Responsive properties for sm breakpoint */
  sm?: GridSpan | { span?: GridSpan; offset?: GridOffset; order?: GridOrder; pull?: GridPull; push?: GridPush };
  /** Responsive properties for md breakpoint */
  md?: GridSpan | { span?: GridSpan; offset?: GridOffset; order?: GridOrder; pull?: GridPull; push?: GridPush };
  /** Responsive properties for lg breakpoint */
  lg?: GridSpan | { span?: GridSpan; offset?: GridOffset; order?: GridOrder; pull?: GridPull; push?: GridPush };
  /** Responsive properties for xl breakpoint */
  xl?: GridSpan | { span?: GridSpan; offset?: GridOffset; order?: GridOrder; pull?: GridPull; push?: GridPush };
  /** Responsive properties for xxl breakpoint */
  xxl?: GridSpan | { span?: GridSpan; offset?: GridOffset; order?: GridOrder; pull?: GridPull; push?: GridPush };
}

export interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'align'> {
  /** Vertical alignment */
  align?: GridAlign;
  /** Horizontal alignment */
  justify?: GridJustify;
  /** Spacing between columns */
  gutter?: GridGutter;
  /** Whether to wrap */
  wrap?: boolean;
  /** Children */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface ColProps extends GridColProps, React.HTMLAttributes<HTMLDivElement> {
  /** Gutter (internal - passed from Row) */
  gutter?: GridGutter;
  /** Children */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

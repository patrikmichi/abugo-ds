import type React from 'react';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexJustify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexGap = 'small' | 'middle' | 'large' | number | [number, number];

export interface IProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical direction (deprecated, use direction instead) */
  vertical?: boolean;
  /** Flex direction */
  direction?: FlexDirection;
  /** Whether to wrap */
  wrap?: FlexWrap | boolean;
  /** Justify content */
  justify?: FlexJustify;
  /** Align items */
  align?: FlexAlign;
  /** Gap between items */
  gap?: FlexGap;
  /** Custom component type */
  component?: React.ElementType;
  /** Children */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

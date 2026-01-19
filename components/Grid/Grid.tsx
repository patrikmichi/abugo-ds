import React from 'react';
import styles from './Grid.module.css';
import { cn } from '@/lib/utils';

export type GridGutter = number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
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

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
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

/**
 * Row Component
 * 
 * Grid row component. 
 * 
 * @example
 * ```tsx
 * <Row gutter={16} justify="space-between">
 *   <Col span={12}>Column 1</Col>
 *   <Col span={12}>Column 2</Col>
 * </Row>
 * ```
 */
export function Row({
  align,
  justify,
  gutter,
  wrap = true,
  children,
  className,
  style,
  ...props
}: RowProps) {
  // Calculate gutter styles
  const gutterStyle: React.CSSProperties = {};
  if (gutter) {
    if (typeof gutter === 'number') {
      gutterStyle.marginLeft = `-${gutter / 2}px`;
      gutterStyle.marginRight = `-${gutter / 2}px`;
    } else {
      // Responsive gutter - use default for now
      gutterStyle.marginLeft = '-8px';
      gutterStyle.marginRight = '-8px';
    }
  }

  return (
    <div
      className={cn(
        styles.row,
        align && styles[`align-${align}`],
        justify && styles[`justify-${justify}`],
        !wrap && styles.nowrap,
        className
      )}
      style={{
        ...gutterStyle,
        ...style,
      }}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Pass gutter to Col children
          return React.cloneElement(child, {
            gutter,
          } as any);
        }
        return child;
      })}
    </div>
  );
}

/**
 * Col Component
 * 
 * Grid column component. 
 * 
 * @example
 * ```tsx
 * <Col span={12} offset={2}>
 *   Content
 * </Col>
 * ```
 */
export function Col({
  span,
  offset,
  order,
  pull,
  push,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  children,
  className,
  style,
  gutter,
  ...props
}: ColProps) {
  // Calculate column styles
  const colStyle: React.CSSProperties = { ...style };
  
  if (flex !== undefined) {
    colStyle.flex = typeof flex === 'number' ? `${flex} 1 0%` : flex;
  }

  // Calculate gutter padding
  if (gutter && typeof gutter === 'number') {
    colStyle.paddingLeft = `${gutter / 2}px`;
    colStyle.paddingRight = `${gutter / 2}px`;
  }

  // Build responsive classes
  const responsiveClasses: string[] = [];
  const breakpoints = [
    { name: 'xs', value: xs },
    { name: 'sm', value: sm },
    { name: 'md', value: md },
    { name: 'lg', value: lg },
    { name: 'xl', value: xl },
    { name: 'xxl', value: xxl },
  ];

  breakpoints.forEach(({ name, value }) => {
    if (value !== undefined) {
      if (typeof value === 'number') {
        responsiveClasses.push(styles[`${name}-${value}`]);
      } else {
        if (value.span !== undefined) responsiveClasses.push(styles[`${name}-${value.span}`]);
        if (value.offset !== undefined) responsiveClasses.push(styles[`${name}-offset-${value.offset}`]);
        if (value.order !== undefined) responsiveClasses.push(styles[`${name}-order-${value.order}`]);
        if (value.pull !== undefined) responsiveClasses.push(styles[`${name}-pull-${value.pull}`]);
        if (value.push !== undefined) responsiveClasses.push(styles[`${name}-push-${value.push}`]);
      }
    }
  });

  return (
    <div
      className={cn(
        styles.col,
        span !== undefined && styles[`span-${span}`],
        offset !== undefined && styles[`offset-${offset}`],
        order !== undefined && styles[`order-${order}`],
        pull !== undefined && styles[`pull-${pull}`],
        push !== undefined && styles[`push-${push}`],
        ...responsiveClasses,
        className
      )}
      style={colStyle}
      {...props}
    >
      {children}
    </div>
  );
}

// Attach Col to Row for convenience
(Row as any).Col = Col;

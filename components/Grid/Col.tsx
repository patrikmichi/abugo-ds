import { cn } from '@/lib/utils';

import styles from './Grid.module.css';
import type { ColProps } from './types';

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

const Col = ({
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
}: ColProps) => {
  const colStyle: React.CSSProperties = { ...style };

  if (flex !== undefined) {
    colStyle.flex = typeof flex === 'number' ? `${flex} 1 0%` : flex;
  }

  if (gutter && typeof gutter === 'number') {
    colStyle.paddingLeft = `${gutter / 2}px`;
    colStyle.paddingRight = `${gutter / 2}px`;
  }

  const responsiveClasses: string[] = [];
  const breakpointValues = { xs, sm, md, lg, xl, xxl };

  BREAKPOINTS.forEach((name) => {
    const value = breakpointValues[name];
    if (value !== undefined) {
      if (typeof value === 'number') {
        responsiveClasses.push(styles[`${name}-${value}`]);
      } else {
        if (value.span !== undefined) responsiveClasses.push(styles[`${name}-${value.span}`]);
        if (value.offset !== undefined)
          responsiveClasses.push(styles[`${name}-offset-${value.offset}`]);
        if (value.order !== undefined)
          responsiveClasses.push(styles[`${name}-order-${value.order}`]);
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
};

export default Col;

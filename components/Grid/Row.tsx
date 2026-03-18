import React from 'react';

import { cn } from '@/lib/utils';

import styles from './Grid.module.css';
import Col from './Col';
import type { RowProps } from './types';

const Row = ({
  align,
  justify,
  gutter,
  wrap = true,
  children,
  className,
  style,
  ...props
}: RowProps) => {
  const gutterStyle: React.CSSProperties = {};
  if (gutter) {
    if (typeof gutter === 'number') {
      gutterStyle.marginLeft = `-${gutter / 2}px`;
      gutterStyle.marginRight = `-${gutter / 2}px`;
    } else {
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
          return React.cloneElement(child, {
            gutter,
          } as React.Attributes);
        }
        return child;
      })}
    </div>
  );
};

Row.Col = Col;

export default Row;

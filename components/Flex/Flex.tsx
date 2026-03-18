import React from 'react';

import { cn } from '@/lib/utils';

import styles from './Flex.module.css';
import type { IProps, FlexWrap } from './types';

const GAP_MAP: Record<string, string> = {
  small: 'var(--token-semantic-gap-xs, 8px)',
  middle: 'var(--token-semantic-gap-sm, 16px)',
  large: 'var(--token-semantic-gap-md, 24px)',
};

const Flex = ({
  vertical = false,
  direction,
  wrap,
  justify,
  align,
  gap,
  component,
  children,
  className,
  style,
  ...props
}: IProps) => {
  const Component = component || 'div';

  const finalDirection = direction || (vertical ? 'column' : 'row');
  const finalWrap: FlexWrap =
    typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap || 'nowrap';

  const gapStyle: React.CSSProperties = {};
  if (gap) {
    if (typeof gap === 'string') {
      gapStyle.gap = GAP_MAP[gap] || gap;
    } else if (typeof gap === 'number') {
      gapStyle.gap = `${gap}px`;
    } else if (Array.isArray(gap)) {
      gapStyle.rowGap = `${gap[1]}px`;
      gapStyle.columnGap = `${gap[0]}px`;
    }
  }

  return (
    <Component
      className={cn(
        styles.flex,
        direction && styles[`direction-${finalDirection}`],
        !direction && vertical && styles.vertical,
        justify && styles[`justify-${justify}`],
        align && styles[`align-${align}`],
        finalWrap !== 'nowrap' && styles[`wrap-${finalWrap}`],
        className
      )}
      style={{
        ...gapStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Flex;

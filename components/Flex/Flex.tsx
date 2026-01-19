import React from 'react';
import styles from './Flex.module.css';
import { cn } from '@/lib/utils';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexJustify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexGap = 'small' | 'middle' | 'large' | number | [number, number];

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
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

/**
 * Flex Component
 * 
 * Flexible box layout component. 
 * 
 * @example
 * ```tsx
 * <Flex gap="middle" justify="space-between" align="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 */
export function Flex({
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
}: FlexProps) {
  const Component = component || 'div';

  // Determine direction
  const finalDirection = direction || (vertical ? 'column' : 'row');

  // Determine wrap
  const finalWrap: FlexWrap = typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : (wrap || 'nowrap');

  // Calculate gap styles
  const gapStyle: React.CSSProperties = {};
  if (gap) {
    if (typeof gap === 'string') {
      // Use token-based gap sizes
      const gapMap: Record<string, string> = {
        small: 'var(--token-semantic-gap-xs, 8px)',
        middle: 'var(--token-semantic-gap-sm, 16px)',
        large: 'var(--token-semantic-gap-md, 24px)',
      };
      gapStyle.gap = gapMap[gap] || gap;
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
}

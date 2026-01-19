import React, { useState, useEffect } from 'react';
import styles from './Spinner.module.css';
import { cn } from '@/lib/utils';

export type SpinnerAppearance = 'inherit' | 'invert';
export type SpinnerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  /** Determines the spinner's color scheme */
  appearance?: SpinnerAppearance;
  /** Delay in milliseconds before the spinner appears */
  delay?: number;
  /** Descriptive label for assistive technologies */
  label?: string;
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Spinner Component
 * 
 * Spinner component to indicate that content is being loaded.
 * 
 * @example
 * ```tsx
 * <Spinner size="medium" label="Loading" />
 * <Spinner size="large" appearance="invert" delay={300} />
 * ```
 */
export function Spinner({
  appearance = 'inherit',
  delay = 0,
  label = 'Loading',
  size = 'medium',
  className,
  style,
  ...props
}: SpinnerProps) {
  const [isVisible, setIsVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Map size to CSS class or use custom size
  const sizeClass = typeof size === 'string' ? size : 'custom';
  const customSize = typeof size === 'number' ? size : undefined;

  // Early return check must come AFTER all hooks
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        styles.spinner,
        styles[sizeClass],
        styles[appearance],
        className
      )}
      style={{
        ...(customSize && {
          width: `${customSize}px`,
          height: `${customSize}px`,
        }),
        ...style,
      }}
      role="status"
      aria-label={label}
      aria-live="polite"
      {...props}
    >
      <span className="material-symbols-outlined" style={{ 
        fontSize: typeof size === 'number' ? `${size}px` : undefined,
        animation: 'spin 1s linear infinite',
        display: 'inline-block'
      }} aria-hidden="true">
        progress_activity
      </span>
      {label && (
        <span className={styles.label} aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
}

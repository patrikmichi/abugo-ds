import React, { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import styles from './Spinner.module.css';
import type { IProps } from './types';

const Spinner = ({
  appearance = 'inherit',
  delay = 0,
  label = 'Loading',
  size = 'medium',
  className,
  style,
  ...props
}: IProps) => {
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

  const sizeClass = typeof size === 'string' ? size : 'custom';
  const customSize = typeof size === 'number' ? size : undefined;

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
      style={style}
      role="status"
      aria-label={label}
      aria-live="polite"
      {...props}
    >
      <div
        className={styles.iconContainer}
        style={customSize ? { width: customSize, height: customSize } : undefined}
      >
        <span
          className="material-symbols-outlined"
          style={customSize ? { fontSize: customSize, width: customSize, height: customSize } : undefined}
          aria-hidden="true"
        >
          progress_activity
        </span>
      </div>
      {label && (
        <span className={styles.label} aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
};

export default Spinner;

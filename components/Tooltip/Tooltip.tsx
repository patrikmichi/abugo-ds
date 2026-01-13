import React, { useState } from 'react';
import styles from './Tooltip.module.css';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn(styles.tooltipContainer, className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(styles.tooltip, styles[placement])} role="tooltip">
          <div className={styles.content}>{content}</div>
          <div className={cn(styles.arrow, styles[`arrow${placement.charAt(0).toUpperCase() + placement.slice(1)}`])} />
        </div>
      )}
    </div>
  );
}

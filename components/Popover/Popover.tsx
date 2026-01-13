import React from 'react';
import styles from './Popover.module.css';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  isOpen: boolean;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function Popover({
  isOpen,
  trigger,
  children,
  className,
  placement = 'bottom',
}: PopoverProps) {
  return (
    <div className={cn(styles.popoverContainer, className)}>
      {trigger}
      {isOpen && (
        <div className={cn(styles.popover, styles[placement])} role="tooltip">
          {children}
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

import styles from './ActionMenu.module.css';
import type { IProps, ActionMenuItem } from './types';

const ActionMenu = ({
  items,
  placement = 'bottomLeft',
  onItemClick,
  disabled = false,
  className,
  style,
  children,
  ...props
}: IProps) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setVisible((prev) => !prev);
  }, [disabled]);

  // Close on click outside
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, handleClose]);

  // Close on escape key
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleClose]);

  const handleItemClick = (item: ActionMenuItem) => {
    if (item.disabled) return;
    onItemClick?.(item.key);
    handleClose();
  };

  const renderPanel = () => {
    if (!visible) return null;

    return (
      <div className={cn(styles.panel, styles[placement])} role="menu">
        <div className={styles.panelContent}>
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.key} className={styles.divider} role="separator" />;
            }

            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                className={cn(
                  styles.item,
                  item.disabled && styles.itemDisabled,
                  item.danger && styles.danger
                )}
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                <span className={styles.itemLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(styles.actionMenu, className)}
      style={style}
      {...props}
    >
      <div onClick={handleToggle}>{children}</div>
      {renderPanel()}
    </div>
  );
};

export default ActionMenu;

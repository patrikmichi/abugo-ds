import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './ActionMenu.module.css';
import { cn } from '@/lib/utils';

export type ActionMenuPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight';

export interface ActionMenuItem {
  /** Unique key */
  key: string;
  /** Item label */
  label: React.ReactNode;
  /** Item icon */
  icon?: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether item is a danger action */
  danger?: boolean;
  /** Whether this is a divider (overrides other props) */
  divider?: boolean;
}

export interface ActionMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Menu items */
  items: ActionMenuItem[];
  /** Placement of the menu panel */
  placement?: ActionMenuPlacement;
  /** Callback when an item is clicked */
  onItemClick?: (key: string) => void;
  /** Whether the menu is disabled */
  disabled?: boolean;
  /** Children (trigger element, typically a Button) */
  children: React.ReactNode;
}

/**
 * ActionMenu Component
 *
 * A dropdown menu triggered by a button for contextual actions.
 * Styled like a select dropdown panel.
 *
 * @example
 * ```tsx
 * <ActionMenu
 *   items={[
 *     { key: 'edit', label: 'Edit', icon: <span className="material-symbols-outlined">edit</span> },
 *     { key: 'duplicate', label: 'Duplicate' },
 *     { key: 'divider', divider: true },
 *     { key: 'delete', label: 'Delete', danger: true },
 *   ]}
 *   onItemClick={(key) => console.log(key)}
 * >
 *   <Button>Actions</Button>
 * </ActionMenu>
 * ```
 */
export function ActionMenu({
  items,
  placement = 'bottomLeft',
  onItemClick,
  disabled = false,
  className,
  style,
  children,
  ...props
}: ActionMenuProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setVisible(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (visible) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [visible, handleOpen, handleClose]);

  // Update position when menu opens
  useEffect(() => {
    if (!visible || !containerRef.current || !panelRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const triggerElement = containerRef.current;
      const panelElement = panelRef.current;
      if (!triggerElement || !panelElement) return;

      const triggerRect = triggerElement.getBoundingClientRect();
      const panelRect = panelElement.getBoundingClientRect();
      const offset = 4;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'bottomLeft':
          top = triggerRect.bottom + offset;
          left = triggerRect.left;
          break;
        case 'bottomCenter':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
          break;
        case 'bottomRight':
          top = triggerRect.bottom + offset;
          left = triggerRect.right - panelRect.width;
          break;
        case 'topLeft':
          top = triggerRect.top - panelRect.height - offset;
          left = triggerRect.left;
          break;
        case 'topCenter':
          top = triggerRect.top - panelRect.height - offset;
          left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
          break;
        case 'topRight':
          top = triggerRect.top - panelRect.height - offset;
          left = triggerRect.right - panelRect.width;
          break;
      }

      // Viewport overflow adjustments
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 0) left = offset;
      else if (left + panelRect.width > viewportWidth) left = viewportWidth - panelRect.width - offset;

      if (top < 0) top = offset;
      else if (top + panelRect.height > viewportHeight) top = viewportHeight - panelRect.height - offset;

      setPosition({ top, left });
    };

    const timer = setTimeout(updatePosition, 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [visible, placement]);

  // Close on click outside
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
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

    const panelStyle: React.CSSProperties = {
      position: 'fixed',
      ...(position ? { top: `${position.top}px`, left: `${position.left}px` } : {}),
      ...(!position ? { visibility: 'hidden' } : {}),
    };

    return createPortal(
      <div
        ref={panelRef}
        className={styles.panel}
        style={panelStyle}
        role="menu"
      >
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
      </div>,
      document.body
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(styles.actionMenu, className)}
      style={style}
      {...props}
    >
      <div onClick={handleToggle}>
        {children}
      </div>
      {renderPanel()}
    </div>
  );
}

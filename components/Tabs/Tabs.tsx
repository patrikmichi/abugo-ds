import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './Tabs.module.css';
import { cn } from '@/lib/utils';

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsSize = 'large' | 'default' | 'small';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TabsItem {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
  icon?: React.ReactNode;
  forceRender?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Active tab key (controlled) */
  activeKey?: string;
  /** Default active tab key (uncontrolled) */
  defaultActiveKey?: string;
  /** Callback when tab changes */
  onChange?: (activeKey: string) => void;
  /** Tab type */
  type?: TabsType;
  /** Tab size */
  size?: TabsSize;
  /** Tab position */
  tabPosition?: TabsPosition;
  /** Tab items */
  items?: TabsItem[];
  /** Callback when tab is removed (for editable-card) */
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void;
  /** Hide all tab content */
  hideAdd?: boolean;
  /** Custom class name */
  className?: string;
  /** Children (TabPane components) */
  children?: React.ReactNode;
}

/**
 * Tabs Component
 * 
 * Tabs component. 
 * 
 * @example
 * ```tsx
 * <Tabs
 *   activeKey={activeKey}
 *   onChange={setActiveKey}
 *   items={[
 *     { key: '1', label: 'Tab 1', children: 'Content 1' },
 *     { key: '2', label: 'Tab 2', children: 'Content 2' },
 *   ]}
 * />
 * ```
 */
export function Tabs({
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  type = 'line',
  size = 'default',
  tabPosition = 'top',
  items: propItems,
  onEdit,
  hideAdd = false,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState<string | undefined>(defaultActiveKey);
  const tabListRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledActiveKey !== undefined;
  const activeKey = isControlled ? controlledActiveKey : internalActiveKey;

  // Extract items from children if items prop not provided
  const items = useMemo<TabsItem[]>(() => {
    if (propItems) return propItems;

    if (children) {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabPane) {
          return {
            key: child.props.tabKey || child.key as string,
            label: child.props.tab || child.props.label,
            children: child.props.children,
            disabled: child.props.disabled,
            closable: child.props.closable,
            icon: child.props.icon,
            forceRender: child.props.forceRender,
          };
        }
        return null;
      }).filter(Boolean) as TabsItem[];
    }

    return [];
  }, [propItems, children]);

  const activeItem = items.find((item) => item.key === activeKey) || items[0];
  const finalActiveKey = activeItem?.key || items[0]?.key;

  const handleTabChange = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (item?.disabled) return;

      if (!isControlled) {
        setInternalActiveKey(key);
      }
      onChange?.(key);
    },
    [isControlled, onChange, items]
  );

  const handleTabClose = useCallback(
    (e: React.MouseEvent, key: string) => {
      e.stopPropagation();
      onEdit?.(key, 'remove');
    },
    [onEdit]
  );

  const handleAdd = useCallback(() => {
    onEdit?.('', 'add');
  }, [onEdit]);

  // Update indicator position
  useEffect(() => {
    if (!indicatorRef.current || !tabListRef.current || type !== 'line') return;

    const activeTab = tabListRef.current.querySelector(`[data-tab-key="${finalActiveKey}"]`) as HTMLElement;
    if (!activeTab) return;

    const tabListRect = tabListRef.current.getBoundingClientRect();
    const activeTabRect = activeTab.getBoundingClientRect();

    if (tabPosition === 'top' || tabPosition === 'bottom') {
      indicatorRef.current.style.left = `${activeTabRect.left - tabListRect.left}px`;
      indicatorRef.current.style.width = `${activeTabRect.width}px`;
    } else {
      indicatorRef.current.style.top = `${activeTabRect.top - tabListRect.top}px`;
      indicatorRef.current.style.height = `${activeTabRect.height}px`;
    }
  }, [finalActiveKey, type, tabPosition]);

  const renderTabs = () => {
    return items.map((item) => (
      <div
        key={item.key}
        data-tab-key={item.key}
        className={cn(
          styles.tab,
          item.key === finalActiveKey && styles.active,
          item.disabled && styles.disabled,
          size === 'small' && styles.small,
          size === 'large' && styles.large,
          type === 'card' && styles.card,
          type === 'editable-card' && styles.editableCard
        )}
        onClick={() => !item.disabled && handleTabChange(item.key)}
        role="tab"
        aria-selected={item.key === finalActiveKey}
        aria-disabled={item.disabled}
      >
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={styles.label}>{item.label}</span>
        {item.closable && type === 'editable-card' && (
          <span
            className={styles.close}
            onClick={(e) => handleTabClose(e, item.key)}
            aria-label="Close tab"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              close
            </span>
          </span>
        )}
      </div>
    ));
  };

  const renderContent = () => {
    if (!activeItem) return null;

    // Force render all tabs if any has forceRender
    const shouldForceRender = items.some((item) => item.forceRender);

    return items.map((item) => {
      const isActive = item.key === finalActiveKey;
      if (!isActive && !item.forceRender && !shouldForceRender) {
        return null;
      }

      return (
        <div
          key={item.key}
          className={cn(
            styles.tabPane,
            isActive && styles.active,
            !isActive && styles.hidden
          )}
          role="tabpanel"
          aria-hidden={!isActive}
        >
          {item.children}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        styles.tabs,
        styles[tabPosition],
        type === 'card' && styles.cardType,
        type === 'editable-card' && styles.editableCardType,
        className
      )}
      {...props}
    >
      <div
        ref={tabListRef}
        className={cn(
          styles.tabList,
          styles[`tabList${tabPosition.charAt(0).toUpperCase() + tabPosition.slice(1)}`],
          type === 'card' && styles.cardTabList,
          type === 'editable-card' && styles.editableCardTabList
        )}
        role="tablist"
      >
        {renderTabs()}
        {type === 'line' && (
          <div ref={indicatorRef} className={styles.indicator} />
        )}
        {type === 'editable-card' && !hideAdd && (
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAdd}
            aria-label="Add tab"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
              add
            </span>
          </button>
        )}
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
}

export interface TabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tab key */
  tabKey?: string;
  /** Tab label */
  tab?: React.ReactNode;
  /** Tab label (alias) */
  label?: React.ReactNode;
  /** Disabled */
  disabled?: boolean;
  /** Closable (for editable-card) */
  closable?: boolean;
  /** Icon */
  icon?: React.ReactNode;
  /** Force render */
  forceRender?: boolean;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Tabs.TabPane Component
 * 
 * Individual tab pane component.
 */
export function TabPane({
  tabKey,
  tab,
  label,
  children,
  ...props
}: TabPaneProps) {
  // This component is mainly for API compatibility
  // The actual rendering is handled by Tabs component
  return null;
}

// Attach TabPane to Tabs
(Tabs as any).TabPane = TabPane;

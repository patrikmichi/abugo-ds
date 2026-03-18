import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

import { cn } from '@/lib/utils';

import TabPane from './TabPane';
import styles from './styles.module.css';
import type { IProps, TabItem, TabPaneProps } from './types';

const Tabs = ({
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  type = 'line',
  centered = false,
  items: propItems,
  className,
  children,
  ...props
}: IProps) => {
  const [internalActiveKey, setInternalActiveKey] = useState<string | undefined>(defaultActiveKey);
  const tabListRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledActiveKey !== undefined;
  const activeKey = isControlled ? controlledActiveKey : internalActiveKey;

  const items = useMemo<TabItem[]>(() => {
    if (propItems) return propItems;

    if (children) {
      return React.Children.toArray(children)
        .filter(
          (child): child is React.ReactElement<TabPaneProps> =>
            React.isValidElement(child) && child.type === TabPane
        )
        .map((child) => ({
          key: child.props.tabKey || (child.key as string) || '',
          label: child.props.label,
          children: child.props.children,
          disabled: child.props.disabled,
          icon: child.props.icon,
        }));
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

  useEffect(() => {
    if (!indicatorRef.current || !tabListRef.current || type !== 'line') return;

    const activeTab = tabListRef.current.querySelector(
      `[data-tab-key="${finalActiveKey}"]`
    ) as HTMLElement;
    if (!activeTab) return;

    const tabListRect = tabListRef.current.getBoundingClientRect();
    const activeTabRect = activeTab.getBoundingClientRect();

    indicatorRef.current.style.left = `${activeTabRect.left - tabListRect.left}px`;
    indicatorRef.current.style.width = `${activeTabRect.width}px`;
  }, [finalActiveKey, type]);

  return (
    <div className={cn(styles.tabs, className)} {...props}>
      <div
        ref={tabListRef}
        className={cn(
          styles.tabList,
          centered && styles.centered,
          type === 'card' && styles.cardTabList
        )}
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            data-tab-key={item.key}
            className={cn(
              styles.tab,
              item.key === finalActiveKey && styles.active,
              item.disabled && styles.disabled,
              type === 'card' && styles.card
            )}
            onClick={() => handleTabChange(item.key)}
            disabled={item.disabled}
            role="tab"
            aria-selected={item.key === finalActiveKey}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
        {type === 'line' && <div ref={indicatorRef} className={styles.indicator} />}
      </div>
      <div className={styles.content}>
        {items.map((item) => {
          const isActive = item.key === finalActiveKey;
          if (!isActive) return null;

          return (
            <div
              key={item.key}
              className={styles.tabPane}
              role="tabpanel"
            >
              {item.children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tabs.TabPane = TabPane;

export default Tabs;

import React, { useState } from 'react';
import styles from './Tabs.module.css';
import { cn } from '@/lib/utils';

export interface TabsProps {
  items: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultActiveId?: string;
  className?: string;
}

export function Tabs({
  items,
  defaultActiveId,
  className,
}: TabsProps) {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);

  const activeItem = items.find(item => item.id === activeId);

  return (
    <div className={cn(styles.tabsContainer, className)}>
      <div className={styles.tabsList} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeId === item.id}
            className={cn(
              styles.tab,
              activeId === item.id && styles.active
            )}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </button>
        ))}
        <div className={styles.indicator} />
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        {activeItem?.content}
      </div>
    </div>
  );
}

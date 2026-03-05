import { useState, useCallback } from 'react';
import styles from './Menu.module.css';
import { cn } from '@/lib/utils';
import { MenuContext } from './MenuContext';
import { MenuItem } from './MenuItem';
import type { MenuProps, MenuContextValue } from './types';

export function Menu({
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [],
  onSelect,
  mode = 'vertical',
  theme = 'light',
  className,
  children,
  ...props
}: MenuProps) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultSelectedKeys);

  const isControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = isControlled ? controlledSelectedKeys : internalSelectedKeys;

  const handleSelect = useCallback(
    (key: string) => {
      if (!isControlled) {
        setInternalSelectedKeys([key]);
      }
      onSelect?.(key);
    },
    [isControlled, onSelect]
  );

  const contextValue: MenuContextValue = {
    selectedKeys,
    onSelect: handleSelect,
    mode,
    theme,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <ul
        className={cn(styles.menu, styles[mode], styles[theme], className)}
        role="menu"
        {...props}
      >
        {children}
      </ul>
    </MenuContext.Provider>
  );
}

// Attach Item to Menu for compound component pattern
(Menu as any).Item = MenuItem;

import React, { createContext, useContext } from 'react';
import styles from './Menu.module.css';
import { cn } from '@/lib/utils';

export type MenuMode = 'vertical' | 'horizontal' | 'inline';
export type MenuTheme = 'light' | 'dark';

export interface MenuContextValue {
  selectedKeys?: string[];
  onSelect?: (key: string) => void;
  mode?: MenuMode;
  theme?: MenuTheme;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** Selected keys */
  selectedKeys?: string[];
  /** Default selected keys */
  defaultSelectedKeys?: string[];
  /** Callback when item is selected */
  onSelect?: (key: string) => void;
  /** Menu mode */
  mode?: MenuMode;
  /** Menu theme */
  theme?: MenuTheme;
  /** Custom class name */
  className?: string;
  /** Children (Menu.Item components) */
  children?: React.ReactNode;
}

/**
 * Menu Component
 * 
 * Menu component for use with Dropdown. 
 * 
 * @example
 * ```tsx
 * <Menu onSelect={(key) => console.log(key)}>
 *   <Menu.Item key="1">Option 1</Menu.Item>
 *   <Menu.Item key="2">Option 2</Menu.Item>
 * </Menu>
 * ```
 */
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
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<string[]>(defaultSelectedKeys);

  const isControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = isControlled ? controlledSelectedKeys : internalSelectedKeys;

  const handleSelect = React.useCallback(
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
        className={cn(
          styles.menu,
          styles[mode],
          styles[theme],
          className
        )}
        role="menu"
        {...props}
      >
        {children}
      </ul>
    </MenuContext.Provider>
  );
}

export interface MenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Unique key */
  key?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Danger state */
  danger?: boolean;
  /** Icon */
  icon?: React.ReactNode;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Menu.Item Component
 * 
 * Menu item component.
 */
export function MenuItem({
  key: itemKey,
  disabled = false,
  danger = false,
  icon,
  children,
  className,
  onClick,
  ...props
}: MenuItemProps) {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu.Item must be used within Menu');
  }

  const { selectedKeys = [], onSelect, mode, theme } = context;
  const isSelected = itemKey ? selectedKeys.includes(itemKey) : false;

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;
    if (itemKey && onSelect) {
      onSelect(itemKey);
    }
    onClick?.(e);
  };

  return (
    <li
      className={cn(
        styles.item,
        isSelected && styles.selected,
        disabled && styles.disabled,
        danger && styles.danger,
        className
      )}
      role="menuitem"
      aria-disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
    </li>
  );
}

// Attach Item to Menu
(Menu as any).Item = MenuItem;

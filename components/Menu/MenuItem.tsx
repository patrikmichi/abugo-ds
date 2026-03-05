import { useContext } from 'react';
import styles from './Menu.module.css';
import { cn } from '@/lib/utils';
import { MenuContext } from './MenuContext';
import type { MenuItemProps } from './types';

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

  const { selectedKeys = [], onSelect } = context;
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

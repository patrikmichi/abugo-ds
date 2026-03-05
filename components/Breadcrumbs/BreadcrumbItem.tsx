import { cn } from '@/lib/utils';
import { Link } from '@/components/Link';
import { ActionMenu } from '@/components/ActionMenu';
import styles from './Breadcrumbs.module.css';
import type { BreadcrumbItemProps } from './types';

const BreadcrumbItem = ({
  href,
  onClick,
  menuItems,
  onMenuItemClick,
  className,
  children,
  ...props
}: BreadcrumbItemProps) => {
  const content = href ? (
    <Link href={href} variant="secondary" onClick={onClick}>
      {children}
    </Link>
  ) : (
    <span className={styles.item} onClick={onClick}>
      {children}
    </span>
  );

  if (menuItems && menuItems.length > 0) {
    return (
      <li className={cn(styles.breadcrumbItem, className)} {...props}>
        <ActionMenu items={menuItems} placement="bottomLeft" onItemClick={onMenuItemClick}>
          <span className={styles.itemWithDropdown}>
            {content}
            <span className={cn('material-symbols-outlined', styles.dropdownIcon)}>
              expand_more
            </span>
          </span>
        </ActionMenu>
      </li>
    );
  }

  return (
    <li className={cn(styles.breadcrumbItem, className)} {...props}>
      {content}
    </li>
  );
};

export default BreadcrumbItem;

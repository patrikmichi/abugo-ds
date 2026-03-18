import { cn } from '@/lib/utils';

import styles from './Card.module.css';
import type { CardMetaProps } from './types';

const CardMeta = ({
  avatar,
  title,
  description,
  className,
  children,
  style,
  ...props
}: CardMetaProps) => {
  return (
    <div className={cn(styles.meta, className)} style={style} {...props}>
      {avatar && <div className={styles.metaAvatar}>{avatar}</div>}
      <div className={styles.metaContent}>
        {title && <div className={styles.metaTitle}>{title}</div>}
        {description && <div className={styles.metaDescription}>{description}</div>}
        {children}
      </div>
    </div>
  );
};

export default CardMeta;

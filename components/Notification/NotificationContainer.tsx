import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Notification.module.css';
import { cn } from '@/lib/utils';
import { Notification } from './Notification';
import type { NotificationInstance, NotificationPlacement } from './types';

interface NotificationContainerProps {
  notifications: NotificationInstance[];
  placement: NotificationPlacement;
  top?: number;
  bottom?: number;
  onRemove: (key: string) => void;
}

export function NotificationContainer({
  notifications,
  placement,
  top,
  bottom,
  onRemove,
}: NotificationContainerProps) {
  const filteredNotifications = notifications.filter(
    (n) => (n.placement || 'topRight') === placement
  );

  if (filteredNotifications.length === 0) return null;

  const isTop = placement.startsWith('top');
  const isRight = placement.endsWith('Right');

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1010,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '384px',
    ...(isTop ? { top: `${top ?? 24}px` } : { bottom: `${bottom ?? 24}px` }),
    ...(isRight ? { right: '24px' } : { left: '24px' }),
  };

  return createPortal(
    <div className={cn(styles.container, styles[placement])} style={containerStyle}>
      {filteredNotifications.map((notification) => (
        <Notification
          key={notification.key}
          type={notification.type}
          message={notification.message}
          description={notification.description}
          duration={notification.duration}
          icon={notification.icon}
          closeIcon={notification.closeIcon}
          actions={notification.actions}
          btn={notification.btn}
          placement={notification.placement}
          className={notification.className}
          style={notification.style}
          onClick={notification.onClick}
          onClose={() => {
            onRemove(notification.key);
            notification.onClose?.();
          }}
        />
      ))}
    </div>,
    document.body
  );
}

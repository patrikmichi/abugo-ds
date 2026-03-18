import React, { useEffect, useState } from 'react';
import { NotificationContainer } from './NotificationContainer';
import { notificationManager, NotificationStatic } from './NotificationManager';
import { Notification as NotificationBase } from './Notification';
import type { NotificationInstance, NotificationConfig, NotificationPlacement, NotificationComponent } from './types';

const PLACEMENTS: NotificationPlacement[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationInstance[]>([]);
  const [config, setConfig] = useState<NotificationConfig>(notificationManager.getConfig());

  useEffect(() => {
    const update = () => {
      setNotifications([...notificationManager.getNotifications()]);
      setConfig(notificationManager.getConfig());
    };

    notificationManager.setUpdateCallback(update);
    update();

    return () => {
      notificationManager.setUpdateCallback(() => {});
    };
  }, []);

  return (
    <>
      {children}
      {PLACEMENTS.map((placement) => (
        <NotificationContainer
          key={placement}
          notifications={notifications}
          placement={placement}
          top={config.top}
          bottom={config.bottom}
          onRemove={(key) => notificationManager.close(key)}
        />
      ))}
    </>
  );
}

// Create typed Notification component with static methods
export const Notification: NotificationComponent = Object.assign(NotificationBase, {
  open: NotificationStatic.open,
  success: NotificationStatic.success,
  error: NotificationStatic.error,
  info: NotificationStatic.info,
  warning: NotificationStatic.warning,
  close: NotificationStatic.close,
  destroy: NotificationStatic.destroy,
  config: NotificationStatic.config,
});

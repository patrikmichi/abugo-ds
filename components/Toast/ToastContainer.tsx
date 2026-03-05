import React from 'react';
import { createPortal } from 'react-dom';

import Toast from './Toast';
import styles from './Toast.module.css';
import type { ToastContainerProps } from './types';

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.key}
          type={toast.type}
          size={toast.size}
          content={toast.content}
          message={toast.message}
          description={toast.description}
          duration={toast.duration}
          icon={toast.icon}
          showIcon={toast.showIcon}
          action={toast.action}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          actionButtonVariant={toast.actionButtonVariant}
          actionButtonAppearance={toast.actionButtonAppearance}
          closeButtonVariant={toast.closeButtonVariant}
          closeButtonAppearance={toast.closeButtonAppearance}
          onClose={() => {
            onRemove(toast.key);
            toast.onClose?.();
          }}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;

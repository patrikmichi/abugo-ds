import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/Button';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';
export type ToastVariant = 'filled' | 'outlined';
export type ToastSize = 'small' | 'large';

export interface ToastProps {
  /** Type of toast */
  type?: ToastType;
  /** Visual variant */
  variant?: ToastVariant;
  /** Size of toast */
  size?: ToastSize;
  /** Toast content */
  content: React.ReactNode;
  /** Duration in seconds (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is closed */
  onClose?: () => void;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Button variant for close button */
  closeButtonVariant?: ButtonProps['variant'];
  /** Button appearance for close button */
  closeButtonAppearance?: ButtonProps['appearance'];
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Toast component - Individual toast notification
 * 
 * Toast component with support for:
 * - Multiple types (success, info, warning, error, loading)
 * - Two sizes (small: 48px, large: 64px min-height)
 * - Auto-dismiss with configurable duration
 * - Close button using Button component
 * - Material Symbols icons
 * 
 * Used internally by ToastManager. Typically accessed via static methods:
 * - Toast.success(content, duration?, onClose?, size?)
 * - Toast.error(content, duration?, onClose?, size?)
 * - Toast.info(content, duration?, onClose?, size?)
 * - Toast.warning(content, duration?, onClose?, size?)
 * - Toast.loading(content, duration?, onClose?, size?)
 */
export function Toast({
  type = 'info',
  size = 'small',
  content,
  duration = 3,
  onClose,
  icon,
  closeButtonVariant = 'tertiary',
  closeButtonAppearance = 'plain',
  className,
  style,
}: ToastProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation
  }, [onClose]);

  // Get default icon based on type
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    const iconName = 
      type === 'success' ? 'check_circle' :
      type === 'error' ? 'error' :
      type === 'warning' ? 'warning' :
      type === 'loading' ? 'progress_activity' :
      'info';
    
    const iconSize = size === 'large' 
      ? 'var(--token-primitive-icon-size-icon-size-3)' 
      : 'var(--token-primitive-icon-size-icon-size-2)';
    
    return (
      <span className="material-symbols-outlined" style={{ fontSize: iconSize }}>
        {iconName}
      </span>
    );
  };

  return (
    <div
      className={cn(
        styles.toast,
        styles[type],
        styles.filled,
        styles[size],
        closing && styles.closing,
        className
      )}
      style={style}
      role="alert"
    >
      <span className={styles.icon}>
        {getDefaultIcon()}
      </span>
      <div className={styles.content}>{content}</div>
      <button
        type="button"
        className={styles.close}
        onClick={handleClose}
        aria-label="Close"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
          close
        </span>
      </button>
    </div>
  );
}

// Toast Manager for global notifications
interface ToastInstance {
  key: string;
  type: ToastType;
  size?: ToastSize;
  content: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  icon?: React.ReactNode;
  closeButtonVariant?: ButtonProps['variant'];
  closeButtonAppearance?: ButtonProps['appearance'];
}

// Toast Container Component
const ToastContainer: React.FC<{ toasts: ToastInstance[]; onRemove: (key: string) => void }> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1060,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.key}
          type={toast.type}
          content={toast.content}
          duration={toast.duration}
          icon={toast.icon}
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

class ToastManager {
  private toasts: ToastInstance[] = [];
  private updateCallback: (() => void) | null = null;

  setUpdateCallback(callback: () => void) {
    this.updateCallback = callback;
  }

  private notify() {
    if (this.updateCallback) {
      this.updateCallback();
    }
  }

  private add(
    type: ToastType, 
    content: React.ReactNode, 
    duration?: number, 
    onClose?: () => void, 
    icon?: React.ReactNode,
    size?: ToastSize,
    closeButtonVariant?: ButtonProps['variant'],
    closeButtonAppearance?: ButtonProps['appearance']
  ): string {
    const key = `toast-${Date.now()}-${Math.random()}`;
    const toast: ToastInstance = {
      key,
      type,
      size,
      content,
      duration: duration ?? 3,
      onClose,
      icon,
      closeButtonVariant,
      closeButtonAppearance,
    };

    this.toasts.push(toast);
    this.notify();
    return key;
  }

  private remove(key: string) {
    this.toasts = this.toasts.filter((t) => t.key !== key);
    this.notify();
  }

  getToasts(): ToastInstance[] {
    return this.toasts;
  }

  success(content: React.ReactNode, duration?: number, onClose?: () => void): string {
    return this.add('success', content, duration, onClose);
  }

  error(content: React.ReactNode, duration?: number, onClose?: () => void): string {
    return this.add('error', content, duration, onClose);
  }

  info(content: React.ReactNode, duration?: number, onClose?: () => void): string {
    return this.add('info', content, duration, onClose);
  }

  warning(content: React.ReactNode, duration?: number, onClose?: () => void): string {
    return this.add('warning', content, duration, onClose);
  }

  loading(content: React.ReactNode, duration?: number, onClose?: () => void): string {
    return this.add('loading', content, duration, onClose);
  }

  destroy(key?: string) {
    if (key) {
      this.remove(key);
    } else {
      this.toasts = [];
      this.notify();
    }
  }
}

// Create singleton instance
const toastManager = new ToastManager();

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  useEffect(() => {
    const update = () => {
      setToasts([...toastManager.getToasts()]);
    };
    
    toastManager.setUpdateCallback(update);
    
    // Initial render
    update();
    
    return () => {
      toastManager.setUpdateCallback(() => {});
    };
  }, []);

  return (
    <>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={(key) => toastManager.destroy(key)}
      />
    </>
  );
};

// Export Toast component and static methods
export const ToastStatic = {
  success: (
    content: React.ReactNode, 
    duration?: number, 
    onClose?: () => void,
    size?: ToastSize
  ) => toastManager.success(content, duration, onClose, size),
  error: (
    content: React.ReactNode, 
    duration?: number, 
    onClose?: () => void,
    size?: ToastSize
  ) => toastManager.error(content, duration, onClose, size),
  info: (
    content: React.ReactNode, 
    duration?: number, 
    onClose?: () => void,
    size?: ToastSize
  ) => toastManager.info(content, duration, onClose, size),
  warning: (
    content: React.ReactNode, 
    duration?: number, 
    onClose?: () => void,
    size?: ToastSize
  ) => toastManager.warning(content, duration, onClose, size),
  loading: (
    content: React.ReactNode, 
    duration?: number, 
    onClose?: () => void,
    size?: ToastSize
  ) => toastManager.loading(content, duration, onClose, size),
  destroy: (key?: string) => toastManager.destroy(key),
};

// Attach static methods to Toast component
(Toast as any).success = ToastStatic.success;
(Toast as any).error = ToastStatic.error;
(Toast as any).info = ToastStatic.info;
(Toast as any).warning = ToastStatic.warning;
(Toast as any).loading = ToastStatic.loading;
(Toast as any).destroy = ToastStatic.destroy;

import type React from 'react';
import type { ToastInstance, ToastType, ToastSize } from './types';
import type { ButtonProps } from '@/components/Button';

type UpdateCallback = () => void;

class ToastManager {
  private toasts: ToastInstance[] = [];
  private updateCallback: UpdateCallback | null = null;

  setUpdateCallback(callback: UpdateCallback) {
    this.updateCallback = callback;
  }

  private notify() {
    this.updateCallback?.();
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

export const toastManager = new ToastManager();

import React from 'react';
import { Modal } from './Modal';
import type { ModalConfig, ConfirmOptions } from './types';

class ModalManager {
  private modals: Map<number, { destroy: () => void }> = new Map();
  private modalConfig: ModalConfig = {};

  config(options: ModalConfig) {
    this.modalConfig = { ...this.modalConfig, ...options };
  }

  private createModal(options: ConfirmOptions, type?: 'info' | 'success' | 'error' | 'warning'): number {
    const id = Date.now();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const destroy = () => {
      const modal = this.modals.get(id);
      if (modal) {
        modal.destroy();
        this.modals.delete(id);
      }
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    const handleOk = async () => {
      if (options.onOk) {
        try {
          await options.onOk();
          destroy();
        } catch (e) {
          // Error handling - don't close on error
        }
      } else {
        destroy();
      }
    };

    const handleCancel = () => {
      if (options.onCancel) {
        options.onCancel();
      }
      destroy();
    };

    // Render modal using React
    const React = require('react');
    const { createRoot } = require('react-dom/client');
    const root = createRoot(container);

    const iconMap = {
      info: 'info',
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
    };

    const icon = options.icon || (type ? (
      <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-3)', color: type === 'info' ? 'var(--token-primitive-brand-500)' : type === 'success' ? 'var(--token-primitive-success-500)' : type === 'error' ? 'var(--token-primitive-negative-500)' : 'var(--token-primitive-warning-500)' }}>
        {iconMap[type]}
      </span>
    ) : null);

    root.render(
      React.createElement(Modal, {
        open: true,
        onCancel: handleCancel,
        onOk: handleOk,
        title: options.title,
        width: options.width || 416,
        zIndex: options.zIndex || 1000,
        centered: options.centered,
        maskClosable: options.maskClosable !== false,
        closable: options.closable !== false,
        keyboard: options.keyboard !== false,
        okText: options.okText || 'OK',
        cancelText: options.cancelText || 'Cancel',
        okType: options.okType || 'primary',
        okButtonProps: options.okButtonProps,
        cancelButtonProps: options.cancelButtonProps,
        getContainer: this.modalConfig.getContainer,
        children: React.createElement('div', { style: { display: 'flex', gap: '16px' } },
          icon && React.createElement('div', { style: { flexShrink: 0 } }, icon),
          React.createElement('div', { style: { flex: 1 } }, options.content)
        ),
      })
    );

    this.modals.set(id, { destroy });
    return id;
  }

  info(options: ConfirmOptions): number {
    return this.createModal(options, 'info');
  }

  success(options: ConfirmOptions): number {
    return this.createModal(options, 'success');
  }

  error(options: ConfirmOptions): number {
    return this.createModal(options, 'error');
  }

  warning(options: ConfirmOptions): number {
    return this.createModal(options, 'warning');
  }

  confirm(options: ConfirmOptions): number {
    return this.createModal(options);
  }

  destroyAll() {
    this.modals.forEach((modal) => modal.destroy());
    this.modals.clear();
  }
}

const modalManager = new ModalManager();

export const ModalStatic = {
  info: (options: ConfirmOptions) => modalManager.info(options),
  success: (options: ConfirmOptions) => modalManager.success(options),
  error: (options: ConfirmOptions) => modalManager.error(options),
  warning: (options: ConfirmOptions) => modalManager.warning(options),
  confirm: (options: ConfirmOptions) => modalManager.confirm(options),
  destroyAll: () => modalManager.destroyAll(),
  config: (options: ModalConfig) => modalManager.config(options),
};

import React, { useEffect, useState } from 'react';

import ToastContainer from './ToastContainer';
import { toastManager } from './ToastManager';
import type { ToastInstance, ToastProviderProps } from './types';

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  useEffect(() => {
    const update = () => {
      setToasts([...toastManager.getToasts()]);
    };

    toastManager.setUpdateCallback(update);
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

export default ToastProvider;

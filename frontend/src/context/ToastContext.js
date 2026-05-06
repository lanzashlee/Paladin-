import React, { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const {
      type = 'info', // 'success', 'error', 'warning', 'info'
      duration = 4000, // milliseconds
      id = Date.now() + Math.random(),
    } = options;

    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);

      return () => clearTimeout(timer);
    }

    return () => removeToast(id);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    addToast,
    removeToast,
    toasts,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

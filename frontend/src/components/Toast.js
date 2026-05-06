import React, { useEffect, useState } from 'react';
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function Toast() {
  const { toasts, removeToast } = useToast();

  const getIconAndColor = (type) => {
    switch (type) {
      case 'success':
        return { icon: Check, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconBg: 'bg-green-100' };
      case 'error':
        return { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconBg: 'bg-red-100' };
      case 'warning':
        return { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100' };
      default:
        return { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100' };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-3 pointer-events-none max-w-md">
      {toasts.map((toast) => {
        const { icon: Icon, bg, border, text, iconBg } = getIconAndColor(toast.type);
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-in slide-in-from-top fade-in duration-300 rounded-lg border ${border} ${bg} px-4 py-3.5 shadow-lg shadow-[rgba(0,0,0,0.1)] flex items-start gap-3`}
          >
            <div className={`shrink-0 rounded-full ${iconBg} p-2 mt-0.5`}>
              <Icon className={`h-5 w-5 ${text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-constantia text-sm font-semibold ${text}`}>{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className={`shrink-0 rounded-md p-1 transition-colors hover:bg-white/50 ${text}`}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;

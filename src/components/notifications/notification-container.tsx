'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { NotificationContent } from '@/hooks/useSignalR';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
    case 'stock_reserved':
      return <CheckCircle className="size-4" />;
    case 'warning':
    case 'stock_reservation_failed':
      return <AlertTriangle className="size-4" />;
    case 'error':
      return <XCircle className="size-4" />;
    case 'cart_update':
    case 'system_test':
      return <Info className="size-4" />;
    default:
      return <Info className="size-4" />;
  }
};

export const NotificationContainer = () => {
  const addNotification = useCallback((notification: NotificationContent) => {
    const icon = getNotificationIcon(notification.type);
    
    const toastContent = (
      <div className="flex flex-col gap-1">
        <div className="font-medium">{notification.title}</div>
        <div className="text-sm text-muted-foreground">{notification.message}</div>
        {notification.data && Object.keys(notification.data).length > 0 && (
          <details className="text-xs text-muted-foreground mt-1">
            <summary className="cursor-pointer">Data</summary>
            <pre className="mt-1 text-xs whitespace-pre-wrap">
              {JSON.stringify(notification.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );

    switch (notification.type) {
      case 'success':
      case 'stock_reserved':
        toast.success(toastContent, { icon });
        break;
      case 'warning':
      case 'stock_reservation_failed':
        toast.warning(toastContent, { icon });
        break;
      case 'error':
        toast.error(toastContent, { icon });
        break;
      default:
        toast.info(toastContent, { icon });
        break;
    }
  }, []);

  // Global method to add notifications
  if (typeof window !== 'undefined') {
    window.addNotification = addNotification;
  }

  return null;
};

// Export the addNotification function type for global usage
declare global {
  interface Window {
    addNotification: (notification: NotificationContent) => void;
  }
}
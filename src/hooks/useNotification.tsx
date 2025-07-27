import { useState } from 'react';

interface NotificationState {
  open: boolean;
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    type: 'error'
  });

  const showNotification = (
    message: string, 
    type: 'error' | 'warning' | 'success' | 'info' = 'error'
  ) => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showError = (message: string) => showNotification(message, 'error');
  const showWarning = (message: string) => showNotification(message, 'warning');
  const showSuccess = (message: string) => showNotification(message, 'success');
  const showInfo = (message: string) => showNotification(message, 'info');

  return {
    notification,
    showNotification,
    closeNotification,
    showError,
    showWarning,
    showSuccess,
    showInfo
  };
};
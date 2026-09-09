import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface UIContextType {
  alertState: AlertState;
  confirmState: ConfirmState;
  showAlert: (title: string, message: string, type?: AlertType) => void;
  showConfirm: (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }) => void;
  closeAlert: () => void;
  closeConfirm: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showAlert = useCallback((title: string, message: string, type: AlertType = 'info') => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showConfirm = useCallback((options: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmState({
      ...options,
      isOpen: true,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <UIContext.Provider
      value={{
        alertState,
        confirmState,
        showAlert,
        showConfirm,
        closeAlert,
        closeConfirm,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

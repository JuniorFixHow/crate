'use client';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface NotificationContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true); // Default to true initially

  useEffect(() => {
    // Access localStorage only on the client
    const storedPreference = localStorage?.getItem('notificationSound');
    setIsSoundEnabled(storedPreference === 'true' || storedPreference === null);
  }, []);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage?.setItem('notificationSound', String(newValue));
      return newValue;
    });
  };

  return (
    <NotificationContext.Provider value={{ isSoundEnabled, toggleSound }}>
      {children}
    </NotificationContext.Provider>
  );
};

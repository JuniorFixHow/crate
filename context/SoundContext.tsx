// NotificationContext.tsx
'use client'
import React, { createContext, useState, ReactNode } from 'react';

export interface NotificationContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
      const storedPreference = localStorage.getItem('notificationSound');
      return storedPreference === 'true' || storedPreference === null;
    });
  
    const toggleSound = () => {
      setIsSoundEnabled((prev) => {
        const newValue = !prev;
        localStorage.setItem('notificationSound', String(newValue));
        return newValue;
      });
    };
  
    return (
      <NotificationContext.Provider value={{ isSoundEnabled, toggleSound }}>
        {children}
      </NotificationContext.Provider>
    );
  };


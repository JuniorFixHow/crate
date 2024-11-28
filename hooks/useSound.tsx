'use client'
import { NotificationContext, NotificationContextType } from "@/context/SoundContext";
import { useContext } from "react";

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
  };
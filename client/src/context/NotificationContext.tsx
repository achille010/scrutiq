"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  time: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  notify: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
  ) => void;
  removeNotification: (id: string) => void;
  snoozeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newNotif = {
      id: newId,
      title: message,
      time: "Just now",
      timestamp: Date.now(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const notify = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info",
    ) => {
      toast[type](message);
      addNotification(message);
    },
    [addNotification],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const snoozeNotification = useCallback(
    (id: string) => {
      const notif = notifications.find((n) => n.id === id);
      if (notif) {
        removeNotification(id);
        toast.warning("Notification snoozed for 5 minutes.");

        // Resend after 5 minutes
        setTimeout(
          () => {
            addNotification(notif.title);
            toast.info(`Back from snooze: ${notif.title}`);
          },
          5 * 60 * 1000,
        );
      }
    },
    [notifications, addNotification, removeNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        notify,
        removeNotification,
        snoozeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  return context;
};

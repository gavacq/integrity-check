'use client'
import { useEffect } from 'react';

const NotificationSender = () => {
  useEffect(() => {
    if (Notification.permission === 'granted') {
      const intervalId = setInterval(() => {
        new Notification('Hello!', {
          body: 'This is a notification from your PWA.',
          // include any other notification options you want
        });
      }, 60000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, []);

  return null;
};

export default NotificationSender;
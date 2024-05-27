'use client'



const NotificationPermission = () => {
  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO: Subscribe user to push notifications here
    } else {
      console.log('Unable to get permission to notify.');
    }
  };

  return (
    <button onClick={requestNotificationPermission}>Enable Notifications</button>
  );
};

export default NotificationPermission;
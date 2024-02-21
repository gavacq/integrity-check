'use client'

//TODO: init firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1t8HY1NFMlAIvgfztUYl6zZljxua_NdA",
  authDomain: "integrity-check-23bae.firebaseapp.com",
  projectId: "integrity-check-23bae",
  storageBucket: "integrity-check-23bae.appspot.com",
  messagingSenderId: "602712914688",
  appId: "1:602712914688:web:6801ca0c5cc4f50e5591e5",
  measurementId: "G-23XKXSLG59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// NotificationPermission component

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
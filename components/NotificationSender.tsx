'use client'
import { use, useEffect, useState } from 'react';


//TODO: init firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { on } from 'events';
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
// const analytics = getAnalytics(app);
const vapidKey = "BN-psw5wAdIvqiL42o1H7u1EquxKElIImEjbUVEstE2E-KczINmSdmPqplsPEh1QSzObFEgj2exK0oTVcXhVikk"

const NotificationSender = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator) {


    const messaging = getMessaging();
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // setMessage(payload.notification?.body || '')
})
      navigator.serviceWorker.ready.then((registration) => {
        // You now have access to the ServiceWorkerRegistration object
        console.log('Service Worker Registered with:', registration);

        // You can use registration for push notifications, background sync, etc.
        // For example, setting up push notifications:


        getToken(messaging, { vapidKey: vapidKey, serviceWorkerRegistration: registration }).then((currentToken) => {
          if (currentToken) {
            console.log('Token: ', currentToken);
            // sendTokenToServer(currentToken);
            // updateUIForPushEnabled(currentToken);
          }
        }
        ).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // showToken('Error retrieving registration token. ', err);
          // setTokenSentToServer(false);
        });
        // registration.pushManager.subscribe({
        //   userVisibleOnly: true,
        //   // Your application server key here
        //   applicationServerKey: '<VAPID Public Key>'
        // }).then((subscription) => {
        //   // Handle subscription object
        //   console.log('Push Subscription:', subscription);
        // }).catch((error) => {
        //   // Handle errors
        //   console.error('Push Subscription error:', error);
        // });
      });

    } else {
      console.log('Service Workers not supported in this browser.');
    }

  }, []);

  // useEffect(() => {
  //   if (Notification.permission === 'granted') {
  //     const intervalId = setInterval(() => {
  //       new Notification('Hello!', {
  //         body: 'This is a notification from your PWA.',
  //         // include any other notification options you want
  //       });
  //     }, 60000);

  //     // Clear interval on component unmount
  //     return () => clearInterval(intervalId);
  //   }
  // }, []);

  return null;
};

export default NotificationSender;
'use client'
import { use, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';



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
  const [token, setToken] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator) {


    const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
      })

      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker Registered with:', registration);

        getToken(messaging, { vapidKey: vapidKey, serviceWorkerRegistration: registration }).then((currentToken) => {
          if (currentToken) {
            console.log('Token: ', currentToken);
          }
          setToken(currentToken)
        }
        ).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });

      });

    } else {
      console.log('Service Workers not supported in this browser.');
    }

  }, []);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      window.alert('Token copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

return (
    <div className='flex m-2'>
      <p className='break-all text-xs'>{token}</p>
      <div>
        <FontAwesomeIcon icon={faCopy} onClick={copyToClipboard} className='cursor-pointer ml-2' />
      </div>
    </div>
  );
};

export default NotificationSender;
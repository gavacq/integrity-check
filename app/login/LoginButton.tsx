'use client'
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { firebaseApp } from "utils/firebase";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from "react";

const LoginButton = () => {
  const auth = getAuth(firebaseApp);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (!result) {
          console.warn('No redirect result');
          return
        }

        // This gives you a Google Access Token. You can use it to access Google APIs.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log('User:', user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('getRedirectResult error:', errorCode, errorMessage, email, credential);
        // ...
      });
    }, [auth]);

  
  return (
    <button onClick={() => handleLogin()} className="bg-gradient-to-r from-revolver-800 to-ebony-800 text-white font-bold py-2 px-4 rounded h-10 w-75 flex items-center justify-center">
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      Sign-in with Google
    </button>
  )
}

export default LoginButton;
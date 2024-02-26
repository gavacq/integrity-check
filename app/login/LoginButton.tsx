'use client'
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "utils/firebase";

const LoginButton = () => {

  const handleLogin = () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }
  
  return (
    <button onClick={() => handleLogin()} className="bg-gradient-to-r from-revolver-800 to-ebony-800 text-white font-bold py-2 px-4 rounded h-10 w-40 flex items-center justify-center">
      Login
    </button>
  )
}

export default LoginButton;
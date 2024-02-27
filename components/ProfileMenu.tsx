'use client'

import { useAuth } from "providers/AuthContext";
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const ProfileMenu = () => {

  const { currentUser, auth } = useAuth();
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter();

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      console.log('signed in with google', result)
      setShowMenu(false)
      router.push('/') 
    }).catch((error) => {
      console.error('error signing in with google', error)
    })
  }
  const handleSignOut = () => {
    signOut(auth)
    setShowMenu(false)
    window.location.reload()
  }

  return (
    <>
      <FontAwesomeIcon icon={faCircleUser} size="2xl" className="text-lunar-green-300" onClick={() => setShowMenu(true)}/>
      {showMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="bg-ebony-950 w-fit h-48 rounded-lg absolute top-4 right-4 flex flex-col justify-center items-center px-6 space-y-2" onClick={e => e.stopPropagation()}>

            {currentUser && (
              <h3 className="text-lunar-green-400">Hello, {currentUser.displayName}</h3>
            )}
            {/* <Link href="/profile" className="text-white w-full text-center my-2 py-1 px-2
            bg-revolver-900 rounded-md" onClick={() => setShowMenu(false)}>
              Profile
            </Link> */}
            {currentUser ? (
              <button className="text-white w-full my-2 py-1 px-2 bg-revolver-900 rounded-md" onClick={() => { handleSignOut()}}>Sign Out</button>) : (
              <button onClick={() => handleLogin()} className="bg-gradient-to-r from-revolver-800 to-ebony-800 text-white font-bold py-2 px-4 rounded h-10 w-75 flex items-center justify-center">
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                Sign-in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileMenu;
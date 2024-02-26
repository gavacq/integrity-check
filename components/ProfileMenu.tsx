'use client'

import { useAuth } from "providers/AuthContext";
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useState } from "react";
import { signOut } from "firebase/auth";

const ProfileMenu = () => {

  const { currentUser, auth } = useAuth();
  const [showMenu, setShowMenu] = useState(false)

  const handleSignOut = () => {
    signOut(auth)
    closeMenu()
    window.location.reload()
  }

  const closeMenu = () => {
    setShowMenu(false);
  }

  return (
    <>
      <FontAwesomeIcon icon={faCircleUser} size="2xl" className="text-lunar-green-300" onClick={() => setShowMenu(true)}/>
      {showMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" onClick={closeMenu}>
          <div className="bg-ebony-950 w-48 h-48 rounded-lg absolute top-4 right-4 flex flex-col justify-center items-center" onClick={e => e.stopPropagation()}>

            <Link href="/profile" className="block text-lunar-green-300 py-2 px-4" onClick={closeMenu}>
              Profile
            </Link>
            {currentUser ? (
              <button className="text-lunar-green-300 my-2 py-1 px-2 bg-revolver-900 rounded-lg" onClick={() => { handleSignOut()}}>Sign Out</button>) : (
              <Link href="/login" className="text-lunar-green-300 my-2 py-1 px-2 bg-revolver-900 rounded-lg" onClick={closeMenu}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileMenu;
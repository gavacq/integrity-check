'use client'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faContactCard, faEnvelope  } from '@fortawesome/free-regular-svg-icons';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { firebaseApp } from 'utils/firebase';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from 'providers/AuthContext';
import ProfileMenu from './ProfileMenu';
import { faMailBulk, faMailForward, faMailReply } from '@fortawesome/free-solid-svg-icons';
import { faMailchimp } from '@fortawesome/free-brands-svg-icons';

const NavBar = () => {
  return (
  <div className="grid grid-cols-9 items-center w-full px-2 sticky top-0 bg-ebony-950 h-16 z-40">
    <Link href="/" className="text-md sm:text-2xl font-bold text-lunar-green-300 col-start-3 col-end-8 justify-self-center">
      Integrity Check
    </Link>
    <Link href="/feedback" className="text-md sm:text-2xl font-bold text-lunar-green-300 col-start-8 justify-self-left">
      <FontAwesomeIcon icon={faEnvelope} size='lg' />
    </Link>
    <div className="col-start-9 justify-self-end pr-4 z-20">
      <ProfileMenu />
    </div>
  </div>
  );
}

export default NavBar;



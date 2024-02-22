'use client'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser  } from '@fortawesome/free-regular-svg-icons';

const NavBar = () => {
return (
<div className="grid grid-cols-6 items-center w-full px-2 sticky top-0 bg-ebony-950 h-16 z-40">

  <h1 className="text-md sm:text-2xl font-bold text-lunar-green-300 col-start-2 col-end-6 justify-self-center">Integrity Check</h1>

  <div className="col-start-6 justify-self-end pr-4 z-20">
    <Link href="/profile">
      <FontAwesomeIcon icon={faCircleUser} size="lg" className="text-lunar-green-300"/>
    </Link>
  </div>
    </div>
  );
}

export default NavBar;



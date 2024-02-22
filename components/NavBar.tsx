'use client'
import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

return (
<div className="grid grid-cols-6 items-center w-full px-6 mt-6">

  {/* Invisible Spacer */}
  <h1 className="text-2xl font-bold text-lunar-green-300 col-start-3 col-end-5 justify-self-center">Integrity Check</h1>

      
      {/* Navigation Links and Menu Icon */}
  <div className="relative col-start-6 justify-self-end pr-4">


      <div className="relative">  {/* Positioning context for the menu */}
        {/* Menu Icon */}
        <div onClick={toggleMenu} className="cursor-pointer text-lunar-green-300 text-3xl">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </div>

        {/* Links - Shown when menu is open */}
        <div className={`${isMenuOpen ? 'flex flex-col items-end bg-black-pearl-950 rounded-lg absolute -top-2 -right-4 py-2 pr-4 pl-4' : 'hidden'}`}>

        <div onClick={toggleMenu} className="cursor-pointer text-lunar-green-300 text-4xl">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </div>
        <div className='flex flex-col items-end space-y-2 py-2'>

          <Link href="/" className='text-shuttle-gray-200 bg-black-pearl-900 hover:bg-black-pearl-800 w-full rounded-md text-center px-5'>Home</Link>
          <Link href="/analytics" className='text-shuttle-gray-200 bg-black-pearl-900  hover:bg-black-pearl-800  w-full rounded-md text-center'>Analytics</Link>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;



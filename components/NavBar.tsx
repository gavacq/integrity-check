'use client'
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

return (
<div className="grid grid-cols-6 items-center w-full px-2 mt-6">

  {/* Invisible Spacer */}
  <h1 className="text-md sm:text-2xl font-bold text-lunar-green-300 col-start-2 col-end-6 justify-self-center">Integrity Check</h1>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}

      
      {/* Navigation Links and Menu Icon */}
  <div ref={menuRef} className="relative col-start-6 justify-self-end pr-4 z-20">


      <div className="relative">  {/* Positioning context for the menu */}
        {/* Menu Icon */}
        <div onClick={toggleMenu} className="cursor-pointer text-lunar-green-300 text-3xl">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </div>

        {/* Links - Shown when menu is open */}
        <div className={`${isMenuOpen ? 'flex flex-col items-end bg-black-pearl-950 rounded-lg absolute -top-2 -right-2 py-2 pr-2 pl-4' : 'hidden'}`}>

        <div onClick={toggleMenu} className="cursor-pointer text-lunar-green-300 text-4xl">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </div>
        <div className='flex flex-col items-end space-y-2 py-2'>


          <Link href="/" className='text-shuttle-gray-200 bg-black-pearl-900 hover:bg-black-pearl-800 w-full rounded-md text-center px-5' onClick={toggleMenu}>Home</Link>
          <Link href="/analytics" className='text-shuttle-gray-200 bg-black-pearl-900  hover:bg-black-pearl-800  w-full rounded-md text-center' onClick={toggleMenu}>Analytics</Link>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;



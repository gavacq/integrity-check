'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faHouse, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'


const Footer = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.replace('/', '') || 'home');

  return (
  <div className="grid grid-cols-3 items-center text-shuttle-gray-200 sticky bottom-0 w-full bg-ebony-950 h-24 z-0">
    <Link href="/analytics" onClick={() => setActiveTab('analytics')} className='text-center'>
      <FontAwesomeIcon icon={faChartSimple} size="xl" className={`${activeTab === 'analytics' ? 'text-revolver-400': 'text-shuttle-gray-200'}`}/>
    </Link>
    <Link href="/" onClick={() => setActiveTab('home')} className='text-center'>
      <FontAwesomeIcon icon={faHouse} size="xl" className={`${activeTab === 'home' ? 'text-revolver-400': 'text-shuttle-gray-200'}`}/>
    </Link>
    <Link href="/categories" onClick={() => setActiveTab('categories')} className='text-center'>
      <FontAwesomeIcon icon={faLayerGroup} size="xl" className={`${activeTab === 'categories' ? 'text-revolver-400': 'text-shuttle-gray-200'}`}/>
    </Link>
  </div>
  );
}

export default Footer;
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faHouse, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'


const Footer = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.replace('/', ''));
  console.log(pathname)

  return (
<div className="flex justify-around items-center text-shuttle-gray-200 py-3 sticky bottom-0 w-full bg-ebony-950 h-24">
  <Link href="/analytics" onClick={() => setActiveTab('analytics')}>
    <FontAwesomeIcon icon={faChartSimple} size="2xl" className={`${activeTab === 'analytics' ? 'text-blue-charcoal-500': 'text-shuttle-gray-200'}`}/>
  </Link>
  <Link href="/" onClick={() => setActiveTab('home')}>
    <FontAwesomeIcon icon={faHouse} size="2xl" className={`${activeTab === 'home' ? 'text-blue-charcoal-500': 'text-shuttle-gray-200'}`}/>
  </Link>
  <Link href="/categories" onClick={() => setActiveTab('categories')}>
    <FontAwesomeIcon icon={faLayerGroup} size="2xl" className={`${activeTab === 'categories' ? 'text-blue-charcoal-500': 'text-shuttle-gray-200'}`}/>
  </Link>
</div>
  );
}

export default Footer;
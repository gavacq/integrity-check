import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faHouse, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Footer = () => {
  return (
<div className="flex justify-around items-center text-shuttle-gray-200 py-3 fixed bottom-0 w-full bg-ebony-950 h-24">
  <Link href="/analytics">
    <FontAwesomeIcon icon={faChartSimple} size="lg" />
  </Link>
  <Link href="/">
      <FontAwesomeIcon icon={faHouse} size="lg" />
  </Link>
  <Link href="/categories">
      <FontAwesomeIcon icon={faLayerGroup} size="lg" />
  </Link>
</div>
  );
}

export default Footer;
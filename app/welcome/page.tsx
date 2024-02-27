import Link from 'next/link';
import LoginButton from './LoginButton';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center grow">
      <h1 className="text-lunar-green-300 mb-4 text-2xl">Welcome to Integrity Check</h1>
      <LoginButton />
    </div>
  );
}
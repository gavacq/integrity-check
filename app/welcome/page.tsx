import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center grow">
      <h1 className="text-lunar-green-300 mb-4 text-2xl">Welcome to Integrity Check</h1>
      <Link href="/login">
        <span className="bg-gradient-to-r from-revolver-800 to-ebony-800 text-white font-bold py-2 px-4 rounded h-10 w-40 flex items-center justify-center">
          Get Started
        </span>
      </Link>
    </div>
  );
}
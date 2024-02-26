import Link from 'next/link';

export default function Page() {
  return (
    <div className="grow flex flex-col items-center justify-center">
      <h1 className="text-lunar-green-300 mb-4 text-2xl">Welcome to Integrity Check</h1>
      <span>Self alignment quantified</span>
      <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
      </Link>
    </div>
  )
}
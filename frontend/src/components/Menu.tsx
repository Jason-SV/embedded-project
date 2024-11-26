'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Menu() {
  const pathname = usePathname();

  const routes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Control', path: '/control' },
    { name: 'History', path: '/history' }
  ];

  return (
    <div className="mt-1">
        <h1 className="text-2xl font-bold mx-2">Menu</h1>
        <div className="flex flex-wrap w-full">
            {routes.map((route) => (
            <Link key={route.path} href={route.path} className='flex-1'>
                <div
                className={`text-bold text-center rounded-2xl shadow-[0_20px_80px_0_rgba(0,0,0,0.3)] px-4 py-0.5 m-2 transition duration-200 transform ${
                    pathname === route.path
                    ? 'text-white bg-blue-500'
                    : 'text-black hover:text-blue-500 bg-white'
                }`}
                >
                {route.name}
                </div>
            </Link>
            ))}
        </div>
    </div>
  );
}
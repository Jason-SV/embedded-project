'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Menu: React.FC = () => {
  const pathname = usePathname();

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Log', path: '/log' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 rounded-t-3xl shadow-xl">
      <div className="flex justify-around items-center">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <a
              className={`text-4xl pb-9 mt-4 mb-4 transition duration-200 transform ${
                pathname === route.path
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {route.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;


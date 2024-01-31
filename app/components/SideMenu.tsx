import { Link } from '@remix-run/react';
import { useState } from 'react';

export default function SideMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* mobile nav */}
      <div className="bg-gray-800 text-gray-100 flex justify-between sticky top-0 md:hidden">
        {/* <!-- logo --> */}
        <div className="block p-4 text-white font-bold">Cube Trainer</div>

        {/* <!-- mobile menu button --> */}
        <button
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* side menu */}
      <div
        className={`sidebar bg-slate-700 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isMenuOpen ? '' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}
      >
        {/* <!-- logo --> */}
        <div className="text-white flex items-center space-x-2 px-4">
          <span className="text-2xl font-extrabold">Cube Trainer</span>
        </div>

        {/* <!-- nav --> */}
        <nav>
          <Link
            to="/timer"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white"
          >
            Timer
          </Link>
          <Link
            to="/oll-list"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white"
          >
            OLL List
          </Link>
        </nav>
      </div>
    </>
  );
}

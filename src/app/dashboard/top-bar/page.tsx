"use client";  // Mark this component as a client-side component

import React from 'react';
import { useRouter } from 'next/navigation'; // Navigation hook from next/navigation

const Header: React.FC = () => {
  const router = useRouter(); // Navigation hook from next/navigation

  return (
    <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Search Bar */}
      <div className="w-full max-w-xs relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search blogs, posts..."
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.742a6 6 0 1 0-1.414 1.414l4.95 4.95a1 1 0 1 0 1.414-1.414l-4.95-4.95zM12 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
        </svg>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">WMH India</span>
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-800 hover:text-blue-500"
            onClick={() => router.push('/profile')} // Update navigation logic here
          >
            <span className="text-sm">Super Admin</span>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
              <span className="text-xl font-semibold">WM</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

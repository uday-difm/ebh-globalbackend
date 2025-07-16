"use client";  // Mark this component as a client-side component

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // Navigation hook from next/navigation
import Image from 'next/image'; // Import Next.js Image component
// import path from 'path/win32'; // Remove this line, not needed for navigation

const TopBar: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown visibility
  const router = useRouter(); // Navigation hook from next/navigation
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleProfileClick = () => {
    setDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
  };




  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleNavigate(path: string): void {
    setDropdownOpen(false);
    router.push(path);
  }

  return (
    <header className="w-full bg-white shadow-lg py-4 px-8 flex justify-between items-center">

      {/* Search Bar */}
      <div className="w-full max-w-xs relative text-black">
        {/* <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 ease-in-out hover:shadow-md"
          placeholder="Search blogs, posts..."
        /> */}
        {/* <image
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
         src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        > */}
        <Image
          src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
          alt="Earth by humans logo gif"
          width={180} height={100} priority
        />
        <path d="M11.742 10.742a6 6 0 1 0-1.414 1.414l4.95 4.95a1 1 0 1 0 1.414-1.414l-4.95-4.95zM12 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
        {/* </svg> */}
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-2">
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-800" style={{fontFamily:"poppins"}}>Earth BY Human</span>
          <span className="text-md font-medium text-gray-900 font-bold">Super Admin</span>
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            onClick={handleProfileClick} // Toggle dropdown visibility on click
          >
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              {/* Using the uploaded image inside the circle */}
              <Image
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif" // Path to your uploaded image
                alt="Profile Image"
                width={48}  // Set size of the image to fit inside the circle
                height={48} // Keep the image square
                className="object-cover" // Ensure image fits the circle
              />
            </div>
            {/* Add the Down Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>


          <div ref={dropdownRef} className="relative">



            {/* Conditionally render the dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50 ring-1 ring-black ring-opacity-5">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleNavigate('/dashboard/profile')}
                >
                  My Profile
                </button>

                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleNavigate('/dashboard/admin-create')}
                >
                  Create Admin
                </button>

                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleNavigate('/dashboard/view-admin')}
                >
                  View Admins
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                  onClick={() => handleNavigate('/dashboard/login')}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

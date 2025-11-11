'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../app/redux/actions/action';
import Logo from '../common/Logo';
import globeMark from '../../public/globe.svg';

const TopBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ single state for full user data
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    router.push(path);
  };

  // ✅ Fetch user data via API
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const res = await fetch('/api/dashboard/admin/status-admin', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();
        // console.log('Fetched user:', data);

        // ✅ Your API returns { isAuthenticated, user: { name, role, ... } }
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, []);


  return (
    <header className="w-full bg-white shadow-lg py-4 px-8 flex justify-between items-center">
      {/* Logo */}
      <div className="w-full max-w-xs flex items-center gap-4 text-black">
        <Logo textClassName="text-lg font-semibold" />
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-2">
        <div className="flex flex-col items-end">
          <span
            className="text-lg font-semibold text-gray-800"
            style={{ fontFamily: 'Poppins' }}
          >
            {user?.name || 'Earth BY Human'}
          </span>
          <span className="text-md text-gray-900 font-bold">
            {user?.role || 'User'}
          </span>
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            onClick={handleProfileClick}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shadow-lg bg-gradient-to-br from-green-500 to-blue-500">
              <Image src={globeMark} alt="Profile" width={40} height={40} />
            </div>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </button>

          <div ref={dropdownRef} className="relative">
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
                  onClick={() => handleNavigate('/dashboard/blog-table')}
                >
                  View Blog
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleNavigate('/dashboard/settings')}
                >
                  Account Setting
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/dashboard/admin/logout', {
                        method: 'POST',
                        credentials: 'include',
                      });
                      if (response.ok) {
                        dispatch(logout());
                        router.push('/dashboard/login');
                      } else {
                        alert('Logout failed');
                      }
                    } catch (error) {
                      alert('Logout error');
                    }
                  }}
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

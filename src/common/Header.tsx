'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiMenuLine } from 'react-icons/ri';
import { IoMdClose, IoMdArrowDropdown } from 'react-icons/io';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mocked auth
  const [user, setUser] = useState({
    name: 'John Doe',
    profile: 'https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png',
  });

  useEffect(() => {
    setShowMenu(false);
    setShowDropdown(false);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    // Replace with API call if needed
    setIsAuthenticated(false);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/blog', label: 'Blogs' },
    { href: '/magazine', label: 'Magazines' },
    { href: '/quizzes', label: 'Fun-Zone', badge: 'Most Popular' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  return (
    <header className="w-full fixed top-0 z-50 border-y border-gray-200 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center py-4 px-4 sm:px-6 relative">
          {/* Logo */}
          <Link href="/" onClick={scrollToTop}>
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
              alt="Logo"
              width={180}
              height={70}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex gap-8 items-center">
            {navLinks.map(({ href, label, badge }) => (
              <Link key={href} href={href}>
                <span
                  className={`relative font-medium hover:text-green transition-all duration-300 ${
                    pathname === href ? 'text-[#3853a4]' : 'text-black'
                  }`}
                >
                  {label}
                  {badge && (
                    <span className="absolute -top-3 -right-4 text-[10px] border italic bg-white animate-pulse text-green-600 font-bold py-1 px-2 rounded-2xl">
                      {badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden xl:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Image
                    src={user.profile}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                  <IoMdArrowDropdown size={24} />
                </div>

                {showDropdown && (
                  <div className="absolute top-12 right-0 bg-white border shadow-md rounded-md w-40 flex flex-col text-sm z-50">
                    <Link href="/profile" className="hover:bg-gray-100 px-4 py-2">
                      Profile
                    </Link>
                    <Link href="/edit-profile" className="hover:bg-gray-100 px-4 py-2">
                      Edit Profile
                    </Link>
                    <button
                      className="text-left w-full px-4 py-2 border-t hover:bg-blue-50 text-blue-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div onClick={() => setShowMenu(!showMenu)} className="xl:hidden cursor-pointer">
            {showMenu ? <IoMdClose size={30} /> : <RiMenuLine size={30} />}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            showMenu ? 'max-h-screen px-4 py-4' : 'max-h-0 py-0 px-4'
          }`}
        >
          <nav className="flex flex-col gap-4 text-center">
            {navLinks.map(({ href, label, badge }) => (
              <Link key={href} href={href}>
                <span
                  className={`relative font-medium hover:text-green transition-all duration-300 ${
                    pathname === href ? 'text-[#3853a4]' : 'text-black'
                  }`}
                >
                  {label}
                  {badge && (
                    <span className="ml-1 py-1 px-2 rounded-2xl text-[10px] border italic bg-white animate-pulse text-green font-bold">
                      {badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex flex-col items-center mt-4 gap-2">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Image
                    src={user.profile}
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                  <IoMdArrowDropdown size={24} />
                </div>

                {showDropdown && (
                  <div className="w-full mt-2 border rounded-md bg-white shadow-md text-sm font-bold flex flex-col text-center">
                    <Link href="/profile" className="py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/edit-profile" className="py-2 hover:bg-gray-100">
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="py-2 text-blue-600 border-t hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="mt-6">
                <button className="w-full py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                  Login
                </button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

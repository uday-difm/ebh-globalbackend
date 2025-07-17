'use client';

import Link from "next/link";
import Image from "next/image";
import { RiMenuLine } from "react-icons/ri";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const auth = useSelector((state) => state.auth);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setShowUserMenu(false);
    router.push('/login');
    router.refresh();
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
    <header className="w-full border-b border-gray-200 fixed top-0 bg-white text-gray-900 font-bold z-50">
      <div className="max-w-[1440px] mx-auto">
        <div className="py-4 px-4 sm:px-6 flex items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
              alt="Earth by humans logo gif"
              width={180}
              height={100}
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex gap-8 items-center">
            {navLinks.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                className={`transition duration-300 ${pathname === href ? "text-[#3853a4]" : "text-black"} hover:text-green-600 font-bold relative`}
              >
                {label}
                {badge && (
                  <span className="absolute -top-3 -right-4 py-1 px-2 rounded-2xl text-[10px] border italic bg-white animate-pulse text-green-600 font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth/Profile */}
          <div className="hidden xl:flex items-center gap-4">
            {auth.isAuthenticated && auth.userId ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2">
                  <Image
                    src={auth.profile || "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png"}
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold">{auth.name?.split(" ")[0]}</span>
                  <IoMdArrowDropdown size="20px" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 mt-1 w-48 border border-gray-200 bg-white rounded-md shadow-lg text-sm font-semibold z-50">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                      Profile
                    </Link>
                    <Link href="/edit-profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                      Edit Profile
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <div className="group relative w-36 h-12 overflow-hidden rounded-full cursor-pointer flex items-center justify-center">
                  <div className="absolute inset-0 bg-green-600 w-[200] z-0 rounded-full"></div>
                  <div className="absolute w-[90px] h-[200px] bg-blue-600 transform rotate-[35deg] transition-all duration-700 ease-in-out top-[-150%] left-[-80%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-blue-600 transform rotate-[125deg] transition-all duration-700 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                  <span className="relative z-20 text-white text-lg font-bold">Login</span>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button onClick={() => setShowMenu(!showMenu)} className="xl:hidden z-50">
            {showMenu ? <IoMdClose size="30px" /> : <RiMenuLine size="30px" />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <div className={`xl:hidden bg-white transition-all duration-500 ease-in-out overflow-y-auto absolute top-full left-0 w-full shadow-lg ${showMenu ? "max-h-screen py-4 px-6" : "max-h-0"}`}>
          <nav className="flex flex-col gap-4 text-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setShowMenu(false)}
                className={`py-2 ${pathname === href ? "text-[#3853a4]" : "text-black"} hover:text-green-600 font-bold`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4">
              {auth.isAuthenticated && auth.userId ? (
                <div className="flex flex-col items-center gap-4">
                  <Link href="/profile" onClick={() => setShowMenu(false)} className="font-bold">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="font-bold text-red-500">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setShowMenu(false)} className="font-bold text-blue-600">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

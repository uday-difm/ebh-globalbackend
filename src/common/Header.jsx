'use client';


import Image from "next/image";
import { RiMenuLine } from "react-icons/ri";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../app/redux/actions/action";
import Button from "./Button"; // Import the Button component
import ScrollToTopLink from "./ScrollToTopLink"; // Import the ScrollToTopLink component

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const auth = useSelector((state) => state.auth);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setHydrated(true);
    // Add event listener for clicks outside the user menu
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(logout()); // Reset Redux auth state
      setShowUserMenu(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/magazine', label: 'Magazines' },
    { href: '/quizzes', label: 'Fun-Zone', badge: 'Most Popular' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  return (
    <header className="w-full border-b border-gray-200 fixed top-0 bg-white text-gray-900 font-bold z-[999] shadow-md">
      <div className="max-w-[1350px] mx-auto">
        <div className="py-4 flex items-center justify-between relative">
          {/* Logo */}
          <ScrollToTopLink href="/">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
              alt="Earth by humans logo gif"
              width={180}
              height={100}
              unoptimized
            />
          </ScrollToTopLink>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex gap-8 items-center">
            {navLinks.map(({ href, label, badge }) => (
              <ScrollToTopLink
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
              </ScrollToTopLink>
            ))}
          </nav>

          {/* Desktop Auth/Profile */}
          <div className="hidden xl:flex items-center gap-4">
            {hydrated && auth.isAuthenticated && auth.userId ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2">
                  <Image
                    key={auth.profile}
                    src={auth.profile || "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png"}
                    alt="User"
                    width={40}
                    height={40}
                    unoptimized
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold">{auth.name?.split(" ")[0]}</span>
                  <IoMdArrowDropdown size="20px" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 mt-1 w-48 border border-gray-200 bg-white rounded-md shadow-lg text-sm font-semibold z-50">
                    <ScrollToTopLink href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                      Profile
                    </ScrollToTopLink>
                    <ScrollToTopLink href="/edit-profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                      Edit Profile
                    </ScrollToTopLink>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : hydrated && (
              <Button
                href="/login"
                bgColor="bg-green-600"
                animatedColor1="bg-blue-700"
                animatedColor2="bg-blue-700"
                className="w-[125px] h-[47px] item-center justify-center flex text-center"
              >
                Login
              </Button>
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
              <ScrollToTopLink
                key={href}
                href={href}
                onClick={() => setShowMenu(false)}
                className={`py-2 ${pathname === href ? "text-[#3853a4]" : "text-black"} hover:text-green-600 font-bold`}
              >
                {label}
              </ScrollToTopLink>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4">
              {auth.isAuthenticated && auth.userId ? (
                <div className="flex flex-col items-center gap-4">
                  <ScrollToTopLink href="/profile" onClick={() => setShowMenu(false)} className="font-bold">
                    Profile
                  </ScrollToTopLink>
                  <button onClick={handleLogout} className="font-bold text-red-500">
                    Logout
                  </button>
                </div>
              ) : (
                <ScrollToTopLink href="/login" onClick={() => setShowMenu(false)} className="font-bold text-blue-600">
                  Login
                </ScrollToTopLink>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
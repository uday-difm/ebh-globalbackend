'use client';


import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../app/redux/actions/action";
import Button from "./Button"; // Import the Button component
import ScrollToTopLink from "./ScrollToTopLink"; // Import the ScrollToTopLink component
import Link from "next/link";

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
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1350px] mx-auto sm:px-6">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
              alt="Earth by Humans Logo"
              width={40} // optional for layout
              height={40} // optional for layout
              className="h-20 w-40 object-contain"
            />

          </Link>
          {/* Desktop Menu */}
          <nav className="hidden xl:flex gap-6 lg:gap-8 items-center">
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
                    width={40}  // Changed from 10 to 40
                    height={40} // Changed from 10 to 40
                    className="w-10 h-10 rounded-full object-cover"
                    unoptimized // ← ADD THIS
                  />
                  <span className="font-bold">{auth.name?.split(" ")[0]}</span>
                  <ChevronDown size={20} />
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
            {showMenu ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {showMenu && (
          <nav className="xl:hidden absolute top-full left-0 right-0 z-50 bg-white shadow-lg">
            <div className={`bg-white transition-all duration-300 ease-in-out overflow-hidden w-full shadow-lg ${showMenu ? "max-h-screen py-4 px-6" : "max-h-0 py-0 px-0"}`}>
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
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
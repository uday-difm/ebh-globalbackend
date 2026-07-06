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

  const defaultNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/magazine', label: 'Magazines' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  const [dynamicNavLinks, setDynamicNavLinks] = useState(null);
  const [logoSrc, setLogoSrc] = useState("https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif");

  useEffect(() => {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

    async function fetchHeaderData() {
      try {
        // Fetch header configuration (logo)
        const res = await fetch(`/api/header?siteId=${siteId}`);
        if (res.ok) {
          const json = await res.json();
          const headerData = json.data?.header || json.header;
          if (headerData) {
            if (headerData.logo) setLogoSrc(headerData.logo);
          }
        }
      } catch (err) {
        console.error("Failed to fetch header config:", err);
      }

      try {
        // Fetch main menu navigation items from database settings
        const navRes = await fetch(`/api/navigation/main?siteId=${siteId}`);
        if (navRes.ok) {
          const json = await navRes.json();
          const items = json.data?.items || json.items;
          if (Array.isArray(items) && items.length > 0) {
            const mapped = items.map((item) => ({
              label: item.label,
              href: item.url || item.href || "/",
              badge: item.badge,
            }));
            setDynamicNavLinks(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch main navigation links:", err);
      }
    }

    fetchHeaderData();
  }, []);

  const navLinks = dynamicNavLinks || defaultNavLinks;

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1350px] mx-auto sm:px-6">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoSrc}
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
                  <span className="absolute -top-5 -right-6 py-1 px-2 rounded-2xl text-[10px] border italic bg-white animate-pulse text-green-600 font-bold whitespace-nowrap">
                    {badge}
                  </span>
                )}
              </ScrollToTopLink>
            ))}
          </nav>

          {/* Desktop Auth/Profile removed */}

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
                {/* Mobile Auth/Profile removed */}
              </nav>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
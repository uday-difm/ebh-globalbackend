'use client';

import Link from "next/link";
import Image from "next/image";
import { RiMenuLine } from "react-icons/ri";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [list, showList] = useState(false);
  const pathname = usePathname(); // 👈 detect current page

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/blogs", label: "Blogs" },
    { href: "/magazine", label: "Magazines" },
    { href: "/quizzes", label: "Fun-Zone", badge: "Most Popular" },
    { href: "/contact-us", label: "Contact Us" }
  ];

  return (
    <header className="w-full border-t border-b sticky top-0 border-gray-200 bg-white text-gray-900 font-bold z-50 mb-0">

      <div className="max-w-[1440px] mx-auto">
        {/* Top bar */}
        <div className="py-4 px-4 sm:px-6 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              className="h-16 w-auto object-contain"
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
              alt="Earth by humans logo gif"
              width={180}
              height={100}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex gap-8 items-center">
            {navLinks.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                className={`transition duration-300 font-bold relative
                  ${pathname === href ? "text-[#3853a4]" : "text-black"}
                  hover:text-green-600`}
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

          {/* Desktopppp Login */}
          <div className="hidden xl:flex gap-3 items-center">
            <Link href={`/login`}>
              <div className="relative group max-w-[130px] overflow-hidden rounded-full cursor-pointer">
                  {/* Green Base Background */}
                  <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                  {/* Animated Blue Layers on Hover */}
                  <div className="absolute w-[100px] h-[200px] bg-blue-700 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-blue-700 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

                  {/* Button Text */}
                  <button className="relative z-20 w-[130px] text-white py-3 font-bold px-6 text-sm rounded-full transition-colors duration-300">
                        Login   
                  </button>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="xl:hidden cursor-pointer transition-all duration-300"
          >
            {showMenu ? <IoMdClose size="30px" /> : <RiMenuLine size="30px" />}
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {/* Mobile Nav Menu */}
        <div
          className={`xl:hidden bg-white transition-all duration-500 ease-in-out overflow-hidden ${showMenu ? "max-h-screen py-4 px-6 overflow-y-auto" : "max-h-0 py-0 px-6"
            }`}
        >
          <nav className="flex flex-col gap-4 text-center">
            {navLinks.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                className={`transition duration-300 font-bold relative
          ${pathname === href ? "text-[#3853a4]" : "text-black"}
          hover:text-green-600`}
              >
                {label}
                {badge && (
                  <span className="ml-1 py-1 px-2 rounded-2xl text-[10px] border italic bg-white animate-pulse text-green-600 font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Mobile Auth UI */}
            <div className="flex items-center justify-center gap-3 mt-4 relative">
              <Image
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png"
                alt="User"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover object-top"
              />
              <span className="font-bold">User Name</span>
              <IoMdArrowDropdown
                size="24px"
                onClick={() => showList(!list)}
                className="cursor-pointer"
              />
            </div>

            {list && (
              <div className="mt-3 w-full border border-gray-300 rounded-md bg-white flex flex-col text-center text-sm font-bold shadow-md z-50">
                <Link href="/profile" className="py-2 hover:bg-gray-100">Profile</Link>
                <hr className="border-gray-200" />
                <Link href="/edit-profile" className="py-2 hover:bg-gray-100">Edit Profile</Link>
                <button className="py-2 border-t border-gray-200  hover:bg-blue-50">Logout</button>
              </div>
            )}
          </nav>
        </div>

      </div>
    </header>
  );
};

export default Header;

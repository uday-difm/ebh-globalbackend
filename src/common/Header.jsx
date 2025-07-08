'use client';

import Link from "next/link";
import Image from "next/image";
import { RiMenuLine } from "react-icons/ri";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [list, showList] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/blog", label: "Blogs" },
    { href: "/magazine", label: "Magazines" },
    { href: "/quizzes", label: "Fun-Zone", badge: "Most Popular" },
    { href: "/contact-us", label: "Contact Us" }
  ];

  return (
    <div className="w-full border-t fixed z-[20] top-0 bg-white text-gray-900 font-bold shadow-md">
      <div className="max-w-[1440px] mx-auto">
        {/* Top bar */}
        <div className="py-4 px-6 flex items-center justify-between relative z-30">
          {/* Logo */}
          <Link href="/">
            <div className="flex">
              <Image
                className="h-20 object-contain"
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
                alt="Earth by humans logo gif"
                width={180}
                height={100}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="xl:flex gap-8 hidden">
            {navLinks.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                className={`transition duration-300 ${label === "Home" ? "text-[#3853a4]" : "text-black"} hover:text-green-600 font-bold`}
              >
                {label}
                {badge && (
                  <span className="py-1 px-1 rounded-2xl text-[12px] border italic relative left-[-20px] top-[-10px] bg-white animate-pulse text-green-600 font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Login / Profile */}
          <div className="xl:flex hidden gap-2 items-center">
            <button className="w-36 bg-green-500 py-3 text-white rounded-full text-xl font-bold">
              Login
            </button>
          </div>

          {/* Hamburger Icon */}
          <div onClick={() => setShowMenu(!showMenu)} className="xl:hidden cursor-pointer transition-all duration-500">
            {showMenu ? <IoMdClose size="30px" /> : <RiMenuLine size="30px" />}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`xl:hidden flex flex-col gap-4 text-center pb-3 relative z-10 transition-all duration-700 ${showMenu ? "mt-0" : "mt-[-380px]"}`}>
          {navLinks.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              className={`transition duration-300 ${label === "Home" ? "text-[#3853a4]" : "text-black"} hover:text-green-600 font-bold`}
            >
              {label}
              {badge && (
                <span className="py-1 px-1 rounded-2xl text-[12px] border italic bg-white animate-pulse text-green-600 font-bold">
                  {badge}
                </span>
              )}
            </Link>
          ))}

          {/* Mobile Auth UI */}
          <div className="flex items-center gap-2 justify-center">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png"
              alt="User"
              width={50}
              height={50}
              className="w-14 h-14 rounded-full object-cover object-top"
            />
            <span className="font-bold">User Name</span>
            <IoMdArrowDropdown size="30px" onClick={() => showList(!list)} />
            {list && (
              <div className="absolute right-5 top-[97%] shadow-lg border border-gray2 bg-white bg-opacity-70 rounded-md w-[150px] flex flex-col items-center">
                <Link href="/profile" className="p-2 font-bold">Profile</Link>
                <hr className="w-full border-gray2" />
                <Link href="/edit-profile" className="p-2 font-bold">Edit Profile</Link>
                <button className="p-2 w-full bg-light-blue text-dark-sky border border-gray2 font-bold">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

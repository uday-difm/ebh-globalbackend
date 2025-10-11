'use client';

import {
  LayoutDashboard,
  List,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '../common/Logo';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    posts: false,
    subscribers: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside className="w-67 bg-gradient-to-b from-slate-900 to-slate-800 text-black p-6 flex flex-col shadow-2xl backdrop-blur-md h-screen fixed overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">
      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-3 mb-10 scale-100 hover:scale-100 transition-transform duration-300 ease-in-out">
        <Logo className="gap-3" textClassName="text-lg font-semibold text-white" />
        <span className="text-2xl font-extrabold tracking-wider uppercase text-white mt-3">
          Dashboard
        </span>
      </div>

      <span className="text-[11px] uppercase tracking-widest text-gray-400 mb-4">
        Navigation
      </span>

      <nav className="flex flex-col gap-6 text-base text-gray-200 font-medium">
        {/* Dashboard */}
        <div className="rounded-xl bg-slate-800/60 p-4 group">
          <div
            onClick={() => toggleMenu('dashboard')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3 group-hover:text-green-600 text-white">
              <LayoutDashboard className="w-7 h-7" />
              <span className="tracking-wide text-lg font-extrabold">
                Dashboard
              </span>
            </div>
            {openMenus.dashboard ? <ChevronDown /> : <ChevronRight />}
          </div>
          {openMenus.dashboard && (
            <ul className="pl-6 mt-3 space-y-4 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white font-normal p-2">
                  Total Data
                </Link>
              </li>
              <li>
                <Link href="/dashboard/add-blog" className="hover:text-white font-normal p-2">
                  Add Blog
                </Link>
              </li>
              <li>
                <Link href="/dashboard/add-magazine" className="hover:text-white font-normal p-2">
                  Add Magazine
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* View Posts */}
        <div className="rounded-xl bg-slate-800/60 p-4 group">
          <div
            onClick={() => toggleMenu('posts')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3 group-hover:text-green-600 text-white">
              <List className="w-7 h-7" />
              <span className="tracking-wide text-lg font-extrabold">
                View Posts
              </span>
            </div>
            {openMenus.posts ? <ChevronDown /> : <ChevronRight />}
          </div>
          {openMenus.posts && (
            <ul className="pl-6 mt-3 space-y-4 text-sm">
              <li>
                <Link href="/dashboard/blog-table" className="hover:text-white font-normal p-2">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/dashboard/magazine-table" className="hover:text-white font-normal p-2">
                  Magazines
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Profile Link */}
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700/70 hover:text-green-600 transition">
          <User className="w-7 h-7" />
          <Link href="/dashboard/profile" className="cursor-pointer text-sm font-normal">
            Profile
          </Link>
        </div>

        {/* Settings Link */}
        <Link href="/dashboard/settings">
          <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700/70 hover:text-green-600 transition">
            <Settings className="w-7 h-7" />
            <span className="text-sm font-normal">Settings</span>
          </div>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

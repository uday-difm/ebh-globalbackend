'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// The Sidebar now accepts isSidebarOpen and setIsSidebarOpen as props
export default function Sidebar({ categories = [], allBlogs = [], isSidebarOpen, setIsSidebarOpen }) {
  const [search, setSearch] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('popular');
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Logic to calculate category counts
  const categoryCount = allBlogs.reduce((acc, blog) => {
    acc[blog.category_name] = (acc[blog.category_name] || 0) + 1;
    return acc;
  }, {});

  // Logic to filter blogs for the sidebar
  const showRecentBlogs = () => {
    setActiveTab('recent');
    setFilteredBlogs(allBlogs.slice(0, 5));
  };

  const showPopularBlogs = () => {
    setActiveTab('popular');
    const sorted = [...allBlogs].sort((a, b) => (b.views || 0) - (a.views || 0));
    setFilteredBlogs(sorted.slice(0, 5));
  };

  // Set the initial filtered blogs when allBlogs data is available
  useEffect(() => {
    if (allBlogs.length > 0) {
      showPopularBlogs();
    }
  }, [allBlogs]);

  // Close sidebar when navigating to a new page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Handle closing the sidebar when clicking outside of it
  const closeSidebar = (event) => {
    if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);
    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, [isSidebarOpen]);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setIsSidebarOpen(false); // Close sidebar after search
      router.push(`/blogs/search?discover=${search}`);
    }
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-[100] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-[90%] sm:w-[22rem]' : '-translate-x-full w-[90%] sm:w-[22rem]'}`}
      >
        <div className="h-full overflow-y-auto p-4">
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex">
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 text-black outline-none w-full border border-r-0 border-gray-300 rounded-l-md" />
              <button type="submit" className="px-6 py-3 bg-gray-800 text-white font-bold rounded-r-md hover:bg-gray-700 transition-colors">Search</button>
            </div>
          </form>

          <div className="mb-4">
            <div className="flex border-b">
              <button onClick={showPopularBlogs} className={`flex-1 py-2 font-semibold ${activeTab === 'popular' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}>Popular</button>
              <button onClick={showRecentBlogs} className={`flex-1 py-2 font-semibold ${activeTab === 'recent' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}>Recent</button>
            </div>
            <div className="mt-4 space-y-4">
              {filteredBlogs.map(blog => (
                <Link key={blog.blog_id} href={`/blogs/post/${blog.blog_slug}`} className="flex items-center gap-3 group" onClick={() => setIsSidebarOpen(false)}>
                  <Image src={typeof blog.blog_feature_image === "string" && blog.blog_feature_image.trim() ? blog.blog_feature_image : "/no-image.png"} alt={blog.blog_title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" width={64} height={64} priority />
                  <div>
                    <p className="font-bold leading-tight group-hover:text-green-600 transition-colors">{blog.blog_title}</p>
                    <p className="text-sm text-gray-500">{blog.formatted_date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.category_id}>
                  <Link href={`/blogs/category/${cat.category_slug}`} className="flex justify-between items-center hover:text-green-600" onClick={() => setIsSidebarOpen(false)}>
                    <span>{cat.category_name}</span>
                    <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">{categoryCount[cat.category_name] || 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
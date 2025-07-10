"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ categories = [], allBlogs = [] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState('popular');
    const sidebarRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    const categoryCount = allBlogs.reduce((acc, blog) => {
        acc[blog.category_name] = (acc[blog.category_name] || 0) + 1;
        return acc;
    }, {});

    const showRecentBlogs = () => {
        setActiveTab('recent');
        setFilteredBlogs(allBlogs.slice(0, 5));
    };

    const showPopularBlogs = () => {
        setActiveTab('popular');
        const sorted = [...allBlogs].sort((a, b) => (b.views || 0) - (a.views || 0));
        setFilteredBlogs(sorted.slice(0, 5));
    };
    
    useEffect(() => {
        showPopularBlogs();
    }, [allBlogs]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/blogs/search?discover=${search}`);
        }
    };
    
    return (
        <>
            <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-white shadow-lg z-[100] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-[90%] sm:w-[22rem]' : '-translate-x-full w-[90%] sm:w-[22rem]'}`}>
                <div className="h-full overflow-y-auto p-4">
                    <form onSubmit={handleSearchSubmit} className="mb-6">
                        <div className="flex">
                            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 text-black outline-none w-full border border-r-0 border-gray-300 rounded-l-md" />
                            <button type="submit" className="px-6 bg-gray-800 text-white font-bold rounded-r-md hover:bg-gray-700">Search</button>
                        </div>
                    </form>
                    <div className="mb-4">
                        <div className="flex border-b">
                            <button onClick={showPopularBlogs} className={`flex-1 py-2 font-semibold ${activeTab === 'popular' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}>Popular</button>
                            <button onClick={showRecentBlogs} className={`flex-1 py-2 font-semibold ${activeTab === 'recent' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}>Recent</button>
                        </div>
                        <div className="mt-4 space-y-4">
                            {filteredBlogs.map(blog => (
                                <Link key={blog.blog_id} href={`/blogs/post/${blog.blog_slug}`} className="flex items-center gap-3 group">
                                    <img src={blog.blog_feature_image} alt={blog.blog_title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
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
                                     <Link href={`/blogs/category/${cat.category_slug}`} className="flex justify-between items-center hover:text-green-600">
                                         <span>{cat.category_name}</span>
                                         <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">{categoryCount[cat.category_name] || 0}</span>
                                     </Link>
                                 </li>
                             ))}
                         </ul>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-5 left-5 z-[101]">
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none">{isSidebarOpen ? '✕' : '☰'}</button>
            </div>
        </>
    );
}
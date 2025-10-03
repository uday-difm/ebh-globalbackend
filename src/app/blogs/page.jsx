'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../pagination.css';
import { Loader } from '../../common/Loader';


// ----------------- IMPORT THE NEWLY MOVED COMPONENTS -----------------
// import CategorySlider from '../../component/CategorySlider';
import PaginatedBlogList from '../../component/PaginatedBlogList';

// const Sidebar = dynamic(() => import('../../component/Sidebar'), { ssr: false });
const CategorySlider = dynamic(() => import('../../component/CategorySlider'), { ssr: false });

// Fetch first 9 blogs only for initial load
const fetchInitialBlogs = async () => {
  const res = await fetch('/api/blogs?page=1&limit=9', { cache: 'no-store' }); 
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
};

// Fetch categories separately
const fetchCategories = async () => {
  const res = await fetch('/api/categoriesHome', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}


// ---------------- Sidebar ----------------
const Sidebar = ({ categories = [], allBlogs = [] }) => {
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

  useEffect(() => { if (allBlogs.length > 0) showPopularBlogs(); }, [allBlogs]);
  useEffect(() => { setIsSidebarOpen(false); }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/blogs/search?discover=${search}`);
  };

  return (
    <>
      <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-white shadow-lg z-[100] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-[90%] sm:w-[22rem]' : '-translate-x-full w-[90%] sm:w-[22rem]'}`}>
        <div className="h-full overflow-y-auto p-4">
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex">
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 text-black outline-none w-full border border-r-0 border-gray-300 rounded-l-md" />
              <button type="submit" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-700 transition duration-300 shadow-md">Search</button>
            </div>
          </form>

          <div className="mb-4">
            <div className="flex border-b">
              <button onClick={showPopularBlogs} className={`flex-1 py-2 font-semibold ${activeTab === 'popular' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}>Popular</button>
              <button onClick={showRecentBlogs} className={`flex-1 py-2 font-semibold ${activeTab === 'recent' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}>Recent</button>
            </div>
            <div className="mt-4 space-y-4">
              {filteredBlogs.map(blog => (
                <Link key={blog.blog_id} href={`/blogs/${blog.blog_slug}`} className="flex items-center gap-3 group">
                  <img src={blog.blog_feature_image} alt={blog.blog_title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div>
                    <p className="font-bold leading-tight group-hover:text-green-600 transition-colors">{blog.blog_title}</p>
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
    </>
  );
};


// ---------------- BlogHomePage ----------------
export default function BlogHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogData, categoryData] = await Promise.all([
          fetchInitialBlogs(),
          fetchCategories()
        ]);
        setAllBlogs(blogData.blogs || []);
        setCategories(categoryData.categories || []);
      } catch (err) {
        console.error('Data fetching error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <>
      <title>Recent Blogs Latest Insights On Nature | Earth by Humans</title>
      <meta name="description" content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more." />
      <meta name="keywords" content="blogs, nature, environment, sustainability, science, ecology, climate, wildlife, conservation, latest reads" />
      <meta property="og:description" content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more." />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />

      <div className="relative">
        <Sidebar categories={categories} allBlogs={allBlogs} />
        <main className="pt-20 sm:pt-10 text-black">
          <div className="container mx-auto px-4 max-w-[1350px]">
            <div className="my-8">
              <CategorySlider categories={categories} />
            </div>

            <div className="text-center col-span-2 flex flex-col gap-2 mb-6">
              <h1 className="text-4xl font-bold">Most Recent Blogs</h1>
              <p className="text-xl mb-16">Uncover the most popular reads across various life categories</p>
            </div>

            <PaginatedBlogList blogs={allBlogs} isAnimationEnabled={true} />
          </div>
        </main>
      </div>
    </>
  );
}
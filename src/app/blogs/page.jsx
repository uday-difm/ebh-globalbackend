'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import '../pagination.css';
import { Loader } from '../../common/Loader';

// ----------------- IMPORT THE NEWLY MOVED COMPONENTS -----------------
import PaginatedBlogList from '../../component/PaginatedBlogList';
const CategorySlider = dynamic(() => import('../../component/CategorySlider'), { ssr: false });

// Fetch initial blogs with cache that revalidates every 60 seconds
const fetchInitialBlogs = async () => {
  const res = await fetch('/api/blogs?page=1&limit=9', {
    next: { revalidate: 60 }, // ✅ cache and revalidate in the background every 60s
  });
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
};

// Fetch blog categories with longer caching (less frequently updated)
const fetchCategories = async () => {
  const res = await fetch('/api/categoriesHome', {
    next: { revalidate: 300 }, // ✅ cache for 5 minutes before refreshing
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};


// ---------------- BlogHomePage ----------------
export default function BlogHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // allBlogs will only hold published blogs (status === '1')
  const [allBlogs, setAllBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogData, categoryData] = await Promise.all([
          fetchInitialBlogs(),
          fetchCategories()
        ]);

        // Defensive extraction: blogData might be { blogs: [...] } or just an array
        const fetched = blogData?.blogs || blogData || [];
        // Keep only published blogs (status === '1')
        const publishedBlogs = Array.isArray(fetched)
          ? fetched.filter(b => String(b?.status) === '1')
          : [];

        setAllBlogs(publishedBlogs);
        setCategories(categoryData?.categories || []);
      } catch (err) {
        console.error('Data fetching error:', err);
        setError(err?.message || 'Unknown error');
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

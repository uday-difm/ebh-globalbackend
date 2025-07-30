'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../pagination.css';
import { Loader } from '../../common/Loader';

const getAllData = async () => {
  const res = await fetch('/api/blogs');
  if (!res.ok) throw new Error('Failed to fetch blogs and categories');
  return res.json();
};

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
                <Link key={blog.blog_id} href={`/blogs/${blog.blog_slug}`} className="flex items-center gap-3 group">
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
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>
    </>
  );
};

// ---------------- CategorySlider ----------------
export const CategorySlider = ({ categories }) => {
  const pathname = usePathname();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalItems = categories.length + 1;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    variableWidth: true,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
  };

  const isActive = (slug) => pathname?.endsWith(slug);
  const isAllActive = pathname === '/blogs';
  const baseClasses = 'h-10 px-4 flex items-center justify-center font-medium text-sm transition-all duration-300 whitespace-nowrap rounded-full';
  const showPrevArrow = currentSlide > 0;
  const showNextArrow = currentSlide < totalItems - 5;

  const ArrowButton = ({ onClick, children, isDisabled }) => (
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-opacity ${isDisabled
        ? 'opacity-20 cursor-not-allowed'
        : 'cursor-pointer hover:bg-gray-100'
        }`}
    >
      {children}
    </div>
  );

  return (
    <div className="relative flex items-center container group mx-auto mt-30 px-2 max-w-screen-xl">
      <div className={`transition-opacity duration-300 mr-2 ${showPrevArrow ? 'opacity-100' : 'opacity-0'}`}>
        <ArrowButton onClick={() => sliderRef.current?.slickPrev()} isDisabled={!showPrevArrow}>
          <FaArrowLeft size={12} className="text-green-600" />
        </ArrowButton>
      </div>

      <div className="flex-1 min-w-0">
        <Slider ref={sliderRef} {...settings}>
          <div className="px-2">
            <Link href="/blogs" className={`${baseClasses} ${isAllActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All</Link>
          </div>
          {categories.map((cat) => (
            <div key={cat.category_id} className="px-2">
              <Link
                href={`/blogs/${cat.category_slug}`}
                className={`${baseClasses} ${isActive(cat.category_slug)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                  }`}
              >
                {cat.category_name}
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      <div className={`transition-opacity duration-300 ml-2 ${showNextArrow ? 'opacity-100' : 'opacity-0'}`}>
        <ArrowButton onClick={() => sliderRef.current?.slickNext()} isDisabled={!showNextArrow}>
          <FaArrowRight size={12} className="text-green-600" />
        </ArrowButton>
      </div>
    </div>
  );
};

// ---------------- PaginatedBlogList ----------------
export const PaginatedBlogList = ({ blogs, isAnimationEnabled }) => {
  const [visibleCount, setVisibleCount] = useState(9);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const currentBlogs = blogs.slice(0, visibleCount);

  const BlogCard = ({ blog, index }) => {
    const isHovered = hoveredIndex === index;
    const getShortenedText = (text, length) => text?.length > length ? text.substring(0, length) + "..." : text;

    if (isAnimationEnabled) {
      return (
        <Link href={`/blogs/${blog.blog_slug}`} className="block group">
          <div
            className={`relative h-[28rem] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-transform duration-300 group-hover:scale-[1.03] ${isHovered ? "-translate-y-4" : ""}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative h-2/5 w-full overflow-hidden">
              <img
                src={blog.blog_feature_image}
                alt={blog.blog_title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-40000 ease-in-out ${isHovered ? "!-rotate-[6deg] scale-110" : ""}`}
                style={{ transformOrigin: "bottom left" }}
              />
              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
              {/* Category badge */}
              <span className="absolute top-4 left-4 z-20 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {blog.category_name}
              </span>
              {/* Date badge */}
              <span className="absolute top-4 right-4 z-20 bg-white/80 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {blog.formatted_date}
              </span>
            </div>
            <div className={`absolute bottom-0 w-full rounded-b-3xl transition-all bg-white/90 backdrop-blur-md p-6 duration-40000 ease-in-out ${isHovered ? 'bg-white/95' : 'bg-white/90'}`}>
              <h2 className="text-2xl font-extrabold mb-2 leading-tight text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                {getShortenedText(blog.blog_title, 50)}
              </h2>
              <p className="mb-4 text-gray-700 text-base leading-relaxed line-clamp-3">
                {blog.blog_description}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {blog.category_name}
                </span>
                <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {blog.formatted_date}
                </span>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // Non-animated fallback card (if needed)
    return null;
  };

  const AdCard = () => (
    <div className="hover:rotate-[0deg]  text-white transition-transform duration-500 gap-4 mb-5 transition-transform shadow-md transform hover:-translate-y-2 hover:scale-105 duration-500 ease-in-out shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-xl bg-gradient-to-br from-green-800 to-gray-50 p-4" data-aos="zoom-in" data-aos-delay="100">
      <p className="text-xl pt-30 text-center text-gray-800" style={{ fontFamily: 'poppins' }}>
        Showcase your brand to a large audience. Contact us for details
      </p>
      <Link href={'/contact-us'}>
        <button className="px-4 py-1.5  text-sm bg-blue-600 text-white rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-blue-700 transition duration-300">
          Contact us <FaArrowRight className="text-xs" />
        </button>
      </Link>
    </div>
  );

  const handleLoadMore = () => setVisibleCount((prev) => prev + 9);

  return (
    <>
      {currentBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {currentBlogs.map((blog, index) => (
            <React.Fragment key={index}>
              <BlogCard blog={blog} index={index} />
              {(index + 1) % 4 === 0 && <AdCard />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No blogs found</h3>
          <p className="text-gray-500 mb-8">There are currently no blogs available in this category.</p>
          <Link href="/blogs" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            View All Blogs
          </Link>
        </div>
      )}


      {currentBlogs.length > 0 && (
        <>
          {/* Ad Section */}
          <div className="w-full bg-gray-800 mt-5  py-4 rounded">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-gray-100 text-xl font-bold">Advertisement Space</p>
              <p className="text-gray-300 text-base mt-4">
                Your ad could be here! Contact us for details.
              </p>
            </div>
          </div>
          {visibleCount < blogs.length && (
            <div className="flex justify-center my-8">
              <button onClick={handleLoadMore} className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Load More
              </button>
            </div>
          )}
        </>
      )}
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
      setLoading(true);
      setError(null);
      try {
        const { blogs, categories } = await getAllData();
        setAllBlogs(blogs);
        setCategories(categories);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(err.message);
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
      <meta name="description" content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more. Dive into diverse topics and expand your knowledge!" />
      <meta name="keywords" content="blogs, nature, environment, sustainability, science, ecology, climate, wildlife, conservation, latest reads" />
      <meta property="og:description" content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more. Dive into diverse topics and expand your knowledge!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div className="relative">
        <Sidebar categories={categories} allBlogs={allBlogs} />
        <main>
          <div className="pt-20 sm:pt-10 text-black">
            <div className="container mx-auto px-4 max-w-[1350px]">
              <div className="my-8"><CategorySlider categories={categories} /></div>
              <div className="text-center col-span-2 flex flex-col gap-2 mb-6">
                <h1 className="text-4xl font-bold">Most Recent Blogs</h1>
                <p className="text-xl mb-16">Uncover the most popular reads across various life categories</p>
              </div>
              <PaginatedBlogList blogs={allBlogs} isAnimationEnabled={true} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

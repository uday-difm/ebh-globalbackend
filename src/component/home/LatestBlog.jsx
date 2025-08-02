'use client';

import { useEffect, useState } from "react";
import BlogCard from "../../component/home/HomeBlogCard";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const LatestBlog = () => {
  const [blogData, setBlogData] = useState([]);
  const [count, setCount] = useState(4);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch("/api/home-blogs");
        const data = await res.json();
        setBlogData(Array.isArray(data.blogs) ? data.blogs : []);
        setCount(Math.min(4, data.blogs?.length || 0));
      } catch (err) {
        console.error("Blog fetch failed:", err);
      }
    };

    fetchBlog();
  }, []);

  return (
    <div className="relative bg-white text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-10 mt-10">
        <div className="flex flex-col gap-10">
          {/* Heading */}
          <div className="col-span-2 flex flex-col gap-5 text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Latest Blogs</h2>
            <h4 className="text-xl text-gray-700">
              Discover the most recent blog from Earth By Humans.
            </h4>
          </div>

          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-16">
            {blogData.length > 0 ? (
              blogData.slice(0, count).map((blog, i) => (
                <BlogCard key={i} blog={blog} category_name={blog.category_name} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No blogs available.</p>
            )}
          </div>

          {/* View More Button */}
          <div className="mx-auto w-[180px] sm:w-[200px]">
            <Link href="/blogs" scroll={true}>
              <div className="group relative bg-green-600 text-white py-4 px-6 rounded-full flex items-center justify-center overflow-hidden h-[55px] sm:h-[60px] transition-all duration-500 ease-in-out">
                {/* Animated Overlay Layers */}
                <div className="absolute w-[140px] h-[250px] bg-blue-700 rotate-[45deg] transition-all duration-700 ease-in-out top-[-250%] left-[-135%] group-hover:left-0 z-10 opacity-80"></div>
                <div className="absolute w-[250px] h-[100px] bg-blue-700 rotate-[135deg] transition-all duration-700 ease-in-out top-0 left-[130%] group-hover:left-[20%] z-10 opacity-80"></div>

                {/* Text */}
                <span className="relative z-20 text-[1rem] font-semibold flex gap-2 items-center transition-colors duration-300 ease-in-out group-hover:text-white">
                  View More <FaArrowRight />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBlog;

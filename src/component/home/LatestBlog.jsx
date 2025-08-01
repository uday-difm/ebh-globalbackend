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
    <div className="relative">
      <div className="container mx-auto px-4  2xl:px-16 py-10 mt-10 bg-white text-black">
        <div className="flex flex-col gap-10">
          {/* Heading */}
          <div className="col-span-2 flex flex-col gap-5">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Latest Blogs</h2>
            <h4 className="text-xl text-gray-700">
              Discover the most recent blog from Earth By Humans.
            </h4>
          </div>

          {/* Blog Cards */}
          <div className="grid md:grid-cols-2 gap-6 xl:gap-16 ">
            {blogData.length > 0 ? (
              blogData.slice(0, count).map((blog, i) => (
                <BlogCard key={i} blog={blog} category_name={blog.category_name} />
              ))
            ) : (
              <p className="text-gray-500">No blogs available.</p>
            )}
          </div>
        </div>
      </div>

      {/* View More Button */}
      <div className="mx-auto w-40 ">
        <Link href="/blogs" scroll={true}>
          <div className="group relative bg-green-600 text-white py-3 rounded-full flex items-center justify-center overflow-hidden">
            <div className="absolute w-[100px] h-[200px] bg-blue-700 rotate-[35deg] transition-all duration-500 top-[-135%] left-[-80%] group-hover:left-0"></div>
            <div className="absolute w-[200px] h-[90px] bg-blue-700 rotate-[125deg] transition-all duration-500 top-[15%] left-[90%] group-hover:left-[20%]"></div>
            <span className="transition-colors rounded-full duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
              View More <FaArrowRight />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LatestBlog;
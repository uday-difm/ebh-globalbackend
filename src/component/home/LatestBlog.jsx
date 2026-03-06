'use client';

import { useEffect, useState } from "react";
import BlogCard from "../../component/home/HomeBlogCard";
import { ArrowRight } from "lucide-react";
import Button from "../../common/Button";

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
    <section className="relative bg-white text-black max-w-[1350px] mx-auto px-4 sm:px-6">
      <div className="container mx-auto pt-12">
        <div className="flex flex-col gap-10">
          {/* Heading */}
          <div className="col-span-2 flex flex-col gap-5 text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Latest Blogs</h2>
            <h3 className="text-xl text-gray-700">
              Discover the most recent blog from Earth By Humans.
            </h3>
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

          {/* View More Button (Replaced with Button component) */}
          <div className="mx-auto">
            <Button
              href="/blogs"
              bgColor="bg-green-600"
              animatedColor1="bg-blue-700"
              animatedColor2="bg-blue-700"
            >
              <div className="flex gap-1 items-center">
                View More <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
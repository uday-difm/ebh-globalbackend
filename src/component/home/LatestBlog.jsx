"use client";

import { useState, useEffect } from "react";
import CategorySlider from "../blog/CategorySlider";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import HomeBlogCard from "../../component/home/HomeBlogCard"; // MODIFIED: Import the new card

export default function LatestBlog({ initialBlogs, categories }) {
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setFilteredBlogs(initialBlogs);
    setActiveCategory("All");
  }, [initialBlogs]);

  const handleFilterClick = (categoryName) => {
    setActiveCategory(categoryName);
    if (categoryName === "All") {
      setFilteredBlogs(initialBlogs);
    } else {
      const filtered = initialBlogs.filter(blog => blog.category_name === categoryName);
      setFilteredBlogs(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1350]">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">Latest Blogs</h2>
        <p className="text-xl text-gray-600 mt-2">
          Discover the most recent blogs from Earth By Humans.
        </p>
      </div>

      <div className="mb-12">
        <CategorySlider categories={categories} />
      </div>

      {/* Grid of Blog Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBlogs.slice(0, 4).map(blog => (
            <HomeBlogCard blog={blog} key={blog.blog_id} />
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center flex justify-center mt-12">
        <Link href="/blogs">
          <div className="relative group max-w-[150px] overflow-hidden rounded-full cursor-pointer">
            {/* Green Base Background */}
            <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

            {/* Animated Blue Layers on Hover */}
            <div className="absolute w-[130px] h-[200px] bg-blue-800 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
            <div className="absolute w-[200px] h-[90px] bg-blue-800 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

            {/* Button Text */}
            <button className="relative z-20 w-[250px] text-white py-3 border border-gray-300 flex items-center mx-auto gap-2 font-bold px-8 text-sm rounded-full transition-colors duration-300">
              View More <FaArrowRight />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};
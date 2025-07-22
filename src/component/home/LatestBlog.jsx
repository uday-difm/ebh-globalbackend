"use client";

import { useState, useEffect } from "react";
import CategorySlider from "../blog/CategorySlider";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import HomeBlogCard from "../../component/home/HomeBlogCard";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LatestBlog({ initialBlogs, categories }) {
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-24 px-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="mb-12 text-center" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Blogs</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
            Discover the most recent blogs from Earth By Humans and explore the wonders of our planet and beyond.
          </p>
        </div>

        <div className="mb-12" data-aos="fade-up" data-aos-delay="100">
          <CategorySlider 
            categories={categories} 
            onClick={handleFilterClick} 
            active={activeCategory}
            className="flex flex-wrap justify-center gap-3"
          />
        </div>

        {/* Grid of Blog Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-1000">
          {filteredBlogs.slice(0, 4).map((blog, index) => (
            <div
              key={blog.blog_id}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="relative bg-white rounded-2xl shadow-xl border border-gray-200/50 
                transform transition-all duration-500 hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-3 
                hover:shadow-2xl overflow-hidden"
            >
              <HomeBlogCard blog={blog} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-16 flex justify-center" data-aos="zoom-in" data-aos-delay="300">
          <Link href="/blogs">
            <div className="group relative inline-block perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 
                rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <button className="relative z-10 px-8 py-3.5 text-white font-semibold 
                bg-gradient-to-r from-green-600 to-teal-600 rounded-full text-sm md:Text-base 
                shadow-lg transform transition-all duration-300 hover:-translate-y-1 
                hover:shadow-xl flex items-center gap-2 hover:scale-105">
                View More <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
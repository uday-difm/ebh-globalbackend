// --- MODIFIED Code for: src/component/home/LatestBlog.jsx ---

"use client";

import { useState, useEffect } from "react";
import { CategorySlider } from "../blog/CategorySlider";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import HomeBlogCard from "../../component/home/HomeBlogCard";

// LatestBlog now receives activeCategorySlug and onCategoryClick from HomePageClient
export default function LatestBlog({ categories, activeCategorySlug, onCategoryClick }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch blogs from the backend API
  const fetchBlogs = async (category) => {
    setLoading(true);
    setError(null);
    try {
      // Construct the API URL using a relative path directly
      let apiUrl = '/api/home-blogs?limit=4'; // Start with base path and limit

      if (category && category !== "All") {
        apiUrl += `&category=${category}`; // Append category if not "All"
      }

      console.log("Fetching blogs for LatestBlog:", apiUrl);
      // Use the relative URL directly in the fetch call
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to fetch blogs: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();
      setBlogs(data.blogs || []); // Expecting { blogs: [...] } from the API
    } catch (err) {
      console.error("Error fetching blogs in LatestBlog:", err);
      setError("Failed to load blogs. Please try again.");
      setBlogs([]); // Clear blogs on error
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch blogs whenever activeCategorySlug changes
  useEffect(() => {
    fetchBlogs(activeCategorySlug);
  }, [activeCategorySlug]); // Dependency array: re-run effect when activeCategorySlug changes

  // Determine the display title and the "View All" link based on the active category
  const activeCategoryName = categories.find(cat => cat.category_slug === activeCategorySlug)?.category_name || "All";
  const displayTitle = activeCategorySlug === "All" ? "Latest Blogs" : `Latest ${activeCategoryName} Blogs`;
  const viewAllLink = activeCategorySlug === "All" ? "/blogs" : `/blogs/category/${activeCategorySlug}`;


  return (
    <div className="container mx-auto px-4 py-16 max-w-[1350]">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">{displayTitle}</h2> {/* Dynamic title */}
        <p className="text-xl text-gray-600 mt-2">
          Discover the most recent blogs from Earth By Humans.
        </p>
      </div>

      <div className="mb-12">
        {/* Pass categories, activeCategorySlug, and onCategoryClick to CategorySlider */}
        <CategorySlider
          categories={categories}
          activeCategorySlug={activeCategorySlug}
          onCategoryClick={onCategoryClick} // Pass the handler from HomePageClient
          isHomePage={true} // Add this prop if CategorySlider needs to behave differently on home
        />
      </div>

      {loading && <p className="text-center text-gray-600">Loading blogs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="text-center text-gray-600">No blogs found for this category yet.</p>
      )}

      {/* Grid of Blog Cards */}
      {!loading && !error && blogs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.map(blog => (
            <HomeBlogCard blog={blog} key={blog.blog_id} />
          ))}
        </div>
      )}

      {/* View More Button */}
      {/* Conditionally render "View More" if there are blogs */}
      {!loading && !error && blogs.length > 0 && (
        <div className="text-center flex justify-center mt-12">
          <Link href={viewAllLink}> {/* Dynamic Link */}
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
      )}
    </div>
  );
}
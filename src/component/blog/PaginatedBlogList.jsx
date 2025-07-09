"use client";

import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import Image from 'next/image';

// MODIFIED: The BlogCard now renders two completely different styles.
function BlogCard({ blog, index, hoveredIndex, setHoveredIndex, isAnimationEnabled }) {
    if (!blog) return null;

    const getShortenedText = (text, length) => {
        if (!text || text.length <= length) return text;
        return text.substring(0, length) + "...";
    };

    const isHovered = hoveredIndex === index;

    // --- RENDER THE ANIMATED VERSION on the main /blogs page ---
    if (isAnimationEnabled) {
        return (
            <Link href={`/blogs/post/${blog.blog_slug}`} className="block max-w-[1350] group">
                <div
                    className={`relative h-[24rem] transform transition-transform duration-500 ${isHovered ? "-translate-y-4" : ""}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <img
                        src={blog.blog_feature_image}
                        alt={blog.blog_title}
                        className={`absolute inset-0 w-full h-full rounded-2xl object-cover shadow-lg transition-all duration-1000 ${isHovered ? "!-rotate-[9deg] -translate-y-18" : ""}`}
                        style={{ transformOrigin: "bottom left" }}
                    />
                    <div
                        className={`absolute bottom-0 w-full rounded-2xl transition-all bg-blue-200 opacity-60 hover:bg-white transform duration-700 ${isHovered ? 'bg-[rgba(255,255,255,0.9)] opacity-75 backdrop-blur-sm rotate-6' : 'bg-[rgba(0,0,0,0.4)]' ? 'h-full' : 'h-min'}`}
                        style={{
                            transformOrigin: "center center bg-white",
                            transform: isHovered ? 'rotate(6deg)' : 'rotate(0deg)',
                        }}
                    >
                        <div className={`h-full p-4 flex flex-col justify-between rounded-2xl transition-colors duration-500 ${isHovered ? 'bg-white' : 'bg-blue-200'} opacity-100`}>
                            <div className="overflow-y-auto space-y-2">
                                <h2 className="text-2xl font-bold mb-2 leading-tight text-black ${isHovered ? 'h-full' : 'h-min'}`">{getShortenedText(blog.blog_title, 40)}</h2>
                                <p className={`mb-4 transition-opacity duration-500 text-black ${isHovered ? 'h-full' : 'h-min'}`}>{blog.blog_description}</p>
                            </div>
                            <div className="flex flex-col items-start gap-2 flex-wrap">
                                <button className={`flex flex-wrap items-center px-2 border-2 transition-colors duration-500 ${isHovered ? 'border-black' : 'border-white'}`}>
                                    <span>{blog.formatted_date}</span>
                                </button>
                                <button className={`flex items-center px-2 text-xs border-2 transition-colors duration-500 ${isHovered ? 'border-black' : 'border-white'}`}>
                                    <span>{blog.category_name}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
    
    // --- RENDER THE SIMPLE VERSION on category pages ---
    return (
        <Link href={`/blogs/post/${blog.blog_slug}`} className="block group">
            <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative w-full h-48">
                    <Image
                        src={blog.blog_feature_image}
                        alt={blog.blog_title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-green-800 bg-green-100 px-3 py-1 rounded-full self-start">
                        {blog.category_name}
                    </p>
                    <h3 className="text-lg font-bold mt-3 mb-2 flex-grow group-hover:text-green-600 transition-colors">
                        {blog.blog_title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                        <Image src={'https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png'} alt="author" width={24} height={24} className="rounded-full mr-2" />
                        <span>Earth By Humans</span>
                        <span className="mx-2">•</span>
                        <span>{blog.formatted_date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}


// Main PaginatedBlogList component - NO CHANGES HERE
export default function PaginatedBlogList({ blogs, isAnimationEnabled }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const blogsPerPage = 12;

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const offset = currentPage * blogsPerPage;
    const currentBlogs = blogs.slice(offset, offset + blogsPerPage);
    const pageCount = Math.ceil(blogs.length / blogsPerPage);

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {currentBlogs.map((blog, index) => (
                    <BlogCard 
                        key={blog.blog_id} 
                        blog={blog}
                        index={index}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                        isAnimationEnabled={isAnimationEnabled} 
                    />
                ))}
            </div>
            
            {pageCount > 1 && (
                <div id="react-paginate" className="my-16">
                     <ReactPaginate
                        previousLabel={"Prev"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                     />
                </div>
            )}
        </>
    );
}



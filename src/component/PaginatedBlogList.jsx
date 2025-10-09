'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { FcAdvertising } from "react-icons/fc";
import Button from '../common/Button';
import Image from 'next/image';

// 🧠 Strip HTML Tags
const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || '';

// 📖 Calculate Reading Time
const calculateReadingTime = (text) => {
    const plainText = stripHtml(text);
    const words = plainText.trim().split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
};

const PaginatedBlogList = ({ blogs, isAnimationEnabl }) => {
    const [visibleCount, setVisibleCount] = useState(9);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const currentBlogs = blogs.slice(0, visibleCount);

    const BlogCard = ({ blog, index }) => {
        const isHovered = hoveredIndex === index;
        const getShortenedText = (text, length) =>
            text?.length > length ? text.substring(0, length) + "..." : text;

        return (
            <Link href={`/blogs/${blog.blog_slug}`} className="block group">
                <div
                    className={`relative h-[32rem] bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <div className="relative h-3/5 w-full overflow-hidden">
                        <Image
                            src={blog.blog_feature_image}
                            alt={blog.blog_title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                <FaArrowRight size={14} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md p-6 rounded-t-3xl">
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-block text-blacktext-gray-600 bg-gradient-to-r from-green-200 to-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                                {blog.category_name}
                            </span>
                            <div className="flex items-center gap-1 text-gray-400">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span className="text-xs">
                                    {calculateReadingTime(blog.blog_content || blog.blog_description)}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-3 leading-tight text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
                            {getShortenedText(blog.blog_title, 60)}
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                            {blog.blog_description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            {/* Author Section */}
                            <div className="flex items-center gap-3">
                                <Image
                                    src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png"
                                    className="w-10 h-10 rounded-full object-cover "
                                    priority
                                />
                                <span className="text-sm text-gray-600 font-medium">Earth By Humans</span>
                            </div>

                            {/* Date Section */}
                            <p className="text-xs text-gray-500">{blog.formatted_date}</p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    const AdCard = () => (
        <div
            className="flex flex-col justify-center items-center text-white gap-4 mb-5 transition-transform duration-500 transform hover:-translate-y-2 hover:scale-105 ease-in-out hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded-xl bg-gradient-to-br from-white via-green-100 to-green-300 p-6 min-h-[220px]"
        >
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className="w-16 h-16 bg-green-50/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 ">
                    <FcAdvertising size={50} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                    Advertise With Us
                </h3>
                <p className="text-green-700 text-lg leading-relaxed mb-8 max-w-sm">
                    Showcase your brand to our engaged audience of nature enthusiasts and environmental advocates
                </p>
                <Button
                    href="/contact-us"
                    className="w-[180px]"
                    bgColor="bg-green-600"
                    animatedColor1="bg-blue-700"
                    animatedColor2="bg-blue-700"
                >
                    Get Started <FaArrowRight />
                </Button>
            </div>
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
                    <div className="w-full bg-gradient-to-br from-green-300 via-green-100 to-green-300 mt-6 py-4 rounded-2xl shadow-lg">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <div className="w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <FcAdvertising size={25} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-black">Advertisement Space</h3>
                            </div>
                            <p className="text-black/90 text-base mb-4 max-w-xl mx-auto">
                                Reach our engaged audience of nature enthusiasts and environmental advocates. Your brand could be featured here!
                            </p>
                            <Button
                                href="/contact-us"
                                className="w-[175px] justify-center flex items-center mx-auto"
                                bgColor="bg-green-600"
                                animatedColor1="bg-blue-700"
                                animatedColor2="bg-blue-700"
                            >
                                Contact Us <FaArrowRight />
                            </Button>
                        </div>
                    </div>

                    {visibleCount < blogs.length && (
                        <div className="flex justify-center my-8">
                            <div className="relative group overflow-hidden rounded-full">
                                <div className="group relative  w-[180px] bg-green-600 text-white py-4 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                                    <div className="absolute w-[120px] h-[220px] bg-blue-700 transform rotate-[35deg] transition-all duration-800 top-[-110%] left-[-100%] group-hover:left-[-20%] z-10">
                                    </div>
                                    <div className="absolute w-[220px] h-[120px] bg-blue-700 transform rotate-[125deg] transition-all duration-800 left-[200%] group-hover:left-[10%] z-10">
                                    </div>
                                    <span onClick={handleLoadMore} className="transition-colors rounded-full text-sm duration-800 z-50 group-hover:text-white flex gap-1 items-center">
                                        Load More
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default PaginatedBlogList;
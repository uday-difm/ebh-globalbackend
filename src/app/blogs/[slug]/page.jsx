'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cta from '../../../common/Cta';

// --- Reusable Components from main blog page ---
import { CategorySlider, PaginatedBlogList } from '../page';

// --- FontAwesome Icon Imports ---
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faLinkedin, faPinterest, faWhatsapp, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

// --- React Share Imports ---
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, WhatsappShareButton } from "react-share";

// ===================================================================
//  Data Fetching (No changes)
// ===================================================================
const getContentBySlug = async (slug) => {
    const res = await fetch(`/api/blogs/${slug}`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch content');
    }
    return res.json();
};

const getAllCategories = async () => {
    const res = await fetch('/api/blogs');
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.categories;
};


// ===================================================================
//  UI Component for Social Sharing
// ===================================================================
const SocialShareButtons = ({ url, title, media }) => {
    // UI Updated: Buttons are now green and circular
    const buttonClass = "w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300";
    
    return (
        <div className="flex items-center gap-3 flex-shrink-0">
            <FacebookShareButton url={url} title={title} className={buttonClass}>
                <FontAwesomeIcon icon={faFacebookF} />
            </FacebookShareButton>
            <PinterestShareButton url={url} media={media} description={title} className={buttonClass}>
                <FontAwesomeIcon icon={faPinterest} />
            </PinterestShareButton>
            <LinkedinShareButton url={url} title={title} className={buttonClass}>
                <FontAwesomeIcon icon={faLinkedin} />
            </LinkedinShareButton>
            <WhatsappShareButton url={url} title={title} className={buttonClass}>
                <FontAwesomeIcon icon={faWhatsapp} />
            </WhatsappShareButton>
        </div>
    );
};


// ===================================================================
//  UI Component for the Post Footer (Tags & Author Box)
// ===================================================================
const PostFooter = ({ blog }) => {
    return (
        <footer className="mt-16 pt-10 border-t border-gray-200">
            {/* --- Tags and Sharing Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-100 p-6 rounded-xl shadow-sm">
                {/* Tags */}
                <div className="flex-1 w-full md:w-auto">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                        {blog.blog_tag
                            ? blog.blog_tag.split(',').map(tag => `#${tag.trim()}`).join(' ')
                            : 'No tags'}
                    </p>
                </div>

                {/* Social Share Buttons */}
                <SocialShareButtons
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={blog.blog_title}
                    media={blog.blog_feature_image}
                />
            </div>

            {/* --- Author Info Section --- */}
            <div className="mt-14 p-6 sm:p-8 bg-white shadow-md rounded-3xl flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 border border-gray-100">
                <Image
                    src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png"
                    alt="Author"
                    width={90}
                    height={90}
                    className="rounded-full border-2 border-green-500"
                />
                <div className="w-full">
                    <h4 className="text-2xl font-semibold text-gray-900">Earth By Humans</h4>
                    <p className="text-gray-600 mt-2 mb-4 leading-relaxed text-sm md:text-base">
                        Earth by Humans, your online sanctuary for exploring the wonders of our planet and beyond.
                        Immerse yourself in captivating nature posts, inspiring stories, and thought-provoking content
                        that celebrates the beauty of Earth along with fun Quizzes.
                    </p>

                    {/* Social Icons */}
                    <div className="flex justify-center sm:justify-start gap-4">
                        <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-green-600 transition">
                            <FontAwesomeIcon icon={faFacebookF} size="lg" />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-500 transition">
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </a>
                        <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-blue-400 transition">
                            <FontAwesomeIcon icon={faTwitter} size="lg" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-600 transition">
                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};



// ===================================================================
//  UI Component for an Individual Blog Post
// ===================================================================
const IndividualPostView = ({ blog }) => {
    const wordsPerMinute = 200;
    const textContent = (blog.blog_content || '').replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    // Sanitize content by removing inline font-family styles
    const cleanContent = (blog.blog_content || '').replace(/font-family:[^;]*;?/g, '');

    return (
        <article className="max-w-4xl mx-auto px-4 py-2 mt-30 sm:py-3">
            <header className="mb-8">
                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                    <Image src={blog.blog_feature_image} alt={blog.blog_title} fill className="object-cover" priority />
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                    <Link href={`/blogs/category/${blog.category_slug}`} className="flex items-center gap-2 hover:text-green-600">
                        <FontAwesomeIcon icon={faFile} className="text-green-600" /> {blog.category_name}
                    </Link>
                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-green-600" /> {blog.formatted_date}
                    </span>
                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-green-600" /> {readingTime} min read
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{blog.blog_title}</h1>
            </header>
            
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: cleanContent }} />
            
            <PostFooter blog={blog} />
        </article>
    );
}


// ===================================================================
//  UI Component for a Category Page (No changes)
// ===================================================================
const CategoryPageView = ({ category, blogs, allCategories }) => {
    return (
        <div className="pt-20 sm:pt-24">
            <div className="container mx-auto px-4 max-w-[1350]">
                <div className="my-8">
                    <CategorySlider categories={allCategories} />
                </div>
                <div className="text-center my-12 md:my-16">
                    <h1 className="text-4xl md:text-5xl font-bold">{category.category_name}</h1>
                    <p className="text-lg text-gray-600 mt-2">Discover articles in one of our most popular categories.</p>
                </div>
                <PaginatedBlogList blogs={blogs} isAnimationEnabled={false} />
            </div>
            <Cta />
        </div>
    );
}


// ===================================================================
//  Main Page Component (No changes)
// ===================================================================
export default function CombinedSlugPage() {
    const { slug } = useParams();
    const [content, setContent] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [contentData, categoriesData] = await Promise.all([
                    getContentBySlug(slug),
                    getAllCategories()
                ]);
                setContent(contentData);
                setAllCategories(categoriesData);
            } catch (err) {
                console.error("Error fetching page data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    if (!content) return <div className="flex justify-center items-center h-screen">Content not found.</div>;

    if (content.type === 'post') {
        return <IndividualPostView blog={content.data} />;
    }

    if (content.type === 'category') {
        return <CategoryPageView category={content.data.category} blogs={content.data.blogs} allCategories={allCategories} />;
    }

    return <div className="text-center py-40">Invalid content type.</div>;
}
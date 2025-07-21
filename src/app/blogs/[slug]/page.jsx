// Corrected code for: blogs/[slug]/page.jsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cta from '../../../common/Cta';

// --- IMPORT THE REUSABLE COMPONENTS ---
import { CategorySlider, PaginatedBlogList } from '../page'; // <-- Key change #1

// Icon imports (your existing code is fine)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faLinkedin, faPinterest, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, WhatsappShareButton } from "react-share";

// Data fetching functions (your existing code is fine)
const getContentBySlug = async (slug) => {
    const res = await fetch(`/api/blogs/${slug}`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch content');
    }
    return res.json();
};

const getAllCategories = async () => {
    const res = await fetch('/api/blogs'); // Assuming this returns { categories: [] }
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.categories; // We only need the categories array
};

// ===================================================================
//  INTERNAL COMPONENT: Individual Post View
// ===================================================================
const IndividualPostView = ({ blog }) => {
    // This entire component is fine, no changes needed here.
    // ... (your existing IndividualPostView code) ...
    const SocialShareButtons = ({ title }) => {
        const [url, setUrl] = useState('');
        useEffect(() => { setUrl(window.location.href); }, []);
        if (!url) return null;
        const buttonClass = "w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-300";
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold mr-2">Share:</span>
                <FacebookShareButton url={url} title={title} className={buttonClass}><FontAwesomeIcon icon={faFacebookF} /></FacebookShareButton>
                <PinterestShareButton url={url} media={blog.blog_feature_image} description={title} className={buttonClass}><FontAwesomeIcon icon={faPinterest} /></PinterestShareButton>
                <LinkedinShareButton url={url} title={title} className={buttonClass}><FontAwesomeIcon icon={faLinkedin} /></LinkedinShareButton>
                <WhatsappShareButton url={url} title={title} className={buttonClass}><FontAwesomeIcon icon={faWhatsapp} /></WhatsappShareButton>
            </div>
        );
    }

    const wordsPerMinute = 200;
    const textContent = (blog.blog_content || '').replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    const cleanContent = (blog.blog_content || '').replace(/font-family:[^;]*;?/g, '');

    return (
        <article className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
            <header className="mb-8">
                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                    <Image src={blog.blog_feature_image} alt={blog.blog_title} fill className="object-cover" priority />
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                    <Link href={`/blogs/category/${blog.category_slug}`} className="flex items-center gap-2 hover:text-green-600"><FontAwesomeIcon icon={faFile} className="text-green-600" /> {blog.category_name}</Link>
                    <span className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarDays} className="text-green-600" /> {blog.formatted_date}</span>
                    <span className="flex items-center gap-2"><FontAwesomeIcon icon={faClock} className="text-green-600" /> {readingTime} min read</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{blog.blog_title}</h1>
            </header>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: cleanContent }} />
            <footer className="mt-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {blog.blog_tag && blog.blog_tag.split(',').map(tag => (
                            <Link key={tag} href={`/blogs/search?discover=${tag.trim()}`} className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">#{tag.trim()}</Link>
                        ))}
                    </div>
                    <SocialShareButtons title={blog.blog_title} />
                </div>
                <div className="mt-12 p-6 bg-gray-50 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                    <Image src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" alt="Author" width={80} height={80} className="rounded-full flex-shrink-0" />
                    <div>
                        <h4 className="text-xl font-bold">Earth By Humans</h4>
                        <p className="text-gray-600 mt-1">Your online sanctuary for exploring the wonders of our planet and beyond.</p>
                    </div>
                </div>
            </footer>
        </article>
    );
}


// ===================================================================
//  INTERNAL COMPONENT: Category Page View
// ===================================================================
// --- Key change #2: This component is now much cleaner ---
const CategoryPageView = ({ category, blogs, allCategories }) => {
    return (
        <div className="pt-20 sm:pt-24">
            <div className="container mx-auto px-4 max-w-[1350]">
                {/* This now uses the IMPORTED CategorySlider */}
                <div className="my-8">
                    <CategorySlider categories={allCategories} />
                </div>
                <div className="text-center my-12 md:my-16">
                    <h1 className="text-4xl md:text-5xl font-bold">{category.category_name}</h1>
                    <p className="text-lg text-gray-600 mt-2">Discover articles in one of our most popular categories.</p>
                </div>
                {/* This now uses the IMPORTED PaginatedBlogList */}
                <PaginatedBlogList blogs={blogs} isAnimationEnabled={false} />
            </div>
            <Cta />
        </div>
    );
}

// ===================================================================
//  MAIN PAGE COMPONENT
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
                // Fetch both data sets in parallel for speed
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

    if (error) {
        // Redirect to not-found page on error
        if (typeof window !== 'undefined') {
            window.location.href = '/not-found';
        }
        return null;
    }

    if (!content) {
        // Redirect to not-found page if content is null
        if (typeof window !== 'undefined') {
            window.location.href = '/not-found';
        }
        return null;
    }

    // Conditional rendering logic is fine
    if (content.type === 'post') {
        return <IndividualPostView blog={content.data} />;
    }

    if (content.type === 'category') {
        return <CategoryPageView category={content.data.category} blogs={content.data.blogs} allCategories={allCategories} />;
    }

    return <div className="text-center py-40">Invalid content type.</div>;
}



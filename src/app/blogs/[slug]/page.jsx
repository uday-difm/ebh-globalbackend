"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cta from '../../../common/Cta';
import { Loader } from '../../../common/Loader';
import Head from "next/head";
import { CategorySlider, PaginatedBlogList } from '../page';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faLinkedin, faPinterest, faWhatsapp, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  WhatsappShareButton
} from "react-share";

// --- Data fetching helpers ---
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

// --- Social Buttons ---
const SocialShareButtons = ({ url, title, media }) => {
  const buttonClass =
    "w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300";

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <FacebookShareButton url={url} quote={title}>
        <div className={buttonClass}>
          <FontAwesomeIcon icon={faFacebookF} />
        </div>
      </FacebookShareButton>

      <PinterestShareButton url={url} media={media} description={title}>
        <div className={buttonClass}>
          <FontAwesomeIcon icon={faPinterest} />
        </div>
      </PinterestShareButton>

      <LinkedinShareButton url={url} title={title}>
        <div className={buttonClass}>
          <FontAwesomeIcon icon={faLinkedin} />
        </div>
      </LinkedinShareButton>

      <WhatsappShareButton url={url} title={title}>
        <div className={buttonClass}>
          <FontAwesomeIcon icon={faWhatsapp} />
        </div>
      </WhatsappShareButton>
    </div>
  );
};

// --- Post Footer ---
const PostFooter = ({ blog }) => (
  <footer className="pt-3 border-t border-gray-200">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="flex-1 w-full md:w-auto">
        <div className="flex flex-wrap gap-2">
          {blog.blog_tag
            ? blog.blog_tag.split(',').map((tag, index) => (
              <span key={index} className="text-xs font-semibold text-black bg-gray-50 rounded-md py-2 mr-2 mb-2 inline-block">
                <span className="bg-gray-300 p-2 rounded-full">{tag.trim()}</span>
              </span>
            ))
            : <span className="text-sm text-white">No tags</span>}
        </div>
      </div>
      <SocialShareButtons
        url={blog.blog_url || ""}
        title={blog.blog_title}
        media={blog.blog_feature_image}
      />
    </div>

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
        <p className="text-gray-600 mt-2 mb-4 text-sm md:text-base">
          Earth by Humans is your online sanctuary for exploring the wonders of our planet and beyond.
        </p>
        <div className="flex justify-center sm:justify-start gap-4">
          <a
            href="https://www.facebook.com/earthbyhumans"
            className="flex items-center justify-center text-white bg-green-500 hover:bg-pink-500 w-10 h-10 rounded-full transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            href="https://www.instagram.com/earth_by_humans/"
            className="flex items-center justify-center text-white bg-green-500 hover:bg-pink-500 w-10 h-10 rounded-full transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://x.com/earthbyhumans"
            className="flex items-center justify-center text-white bg-green-500 hover:bg-pink-500 w-10 h-10 rounded-full transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href="https://www.linkedin.com/company/earth-by-humans/"
            className="flex items-center justify-center text-white bg-green-500 hover:bg-pink-500 w-10 h-10 rounded-full transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Individual Post View ---
const IndividualPostView = ({ blog }) => {
  const wordsPerMinute = 200;
  const plainText = blog.blog_content?.replace(/<[^>]*>/g, '') || '';
  const wordCount = plainText.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  const cleanContent = blog.blog_content?.replace(/font-family:[^;]*;?/g, '') || '';

  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return (
    <>
      <title>{blog.blog_title}</title>
      <meta name="description" content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more. Dive into diverse topics and expand your knowledge!" />
      <meta name="keywords" content="blogs, nature, environment, sustainability, science, ecology, climate, wildlife, conservation, latest reads" />
      <meta property="og:description" content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more. Dive into diverse topics and expand your knowledge!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
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

        <div
          className="blog-content text-justify text-[16px] font-[Poppins] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
        <PostFooter blog={{ ...blog, blog_url: currentUrl }} />
        <style jsx>{`
          .blog-content a {
            color: #047857;
            text-decoration: none;
          }
        `}</style>
      </article>
    </>
  );
};

// --- Category Page View ---
const CategoryPageView = ({ category, blogs, allCategories }) => (
  <div className="pt-20 sm:pt-24">
    <div className="container mx-auto px-4 max-w-[1350px]">
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

// --- Main Component ---
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
          getAllCategories(),
          new Promise(resolve => setTimeout(resolve, 3000))
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

  if (loading || !slug) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!content) {
    return <div className="flex justify-center items-center h-screen">Content not found.</div>;
  }

  if (content.type === 'post') {
    return <IndividualPostView blog={content.data} />;
  }

  if (content.type === 'category') {
    return <CategoryPageView category={content.data.category} blogs={content.data.blogs} allCategories={allCategories} />;
  }

  return <div className="text-center py-40">Invalid content type.</div>;
}

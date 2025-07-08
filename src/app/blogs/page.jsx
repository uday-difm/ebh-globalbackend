import { getAllBlogs, getAllCategories, createSlug } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import CategorySlider from '@/component/blog/CategorySlider';
import RecentBlogList from '@/component/blog/RecentBlogList';

export const metadata = {
    title: "Latest Environmental and Science Blogs by Earth by Humans",
    description: "Stay updated with the latest research and discussions on environmental science from experts around the globe put together in articles on Earth by Humans.",
};

export default async function BlogHomePage() {
    const allBlogs = await getAllBlogs();
    const categories = await getAllCategories();

    return (
        <div className="pt-24 sm:pt-32">
            <div className="container mx-auto px-4">
                {/* Category Slider */}
                <div className="my-8">
                     <CategorySlider categories={categories} />
                </div>
                
                {/* Heading */}
                <div className="text-center my-16">
                    <h1 className="text-4xl md:text-5xl font-bold">Most Recent Blogs</h1>
                    <p className="text-lg text-gray-600 mt-2">Uncover the most popular reads across various life categories.</p>
                </div>
                
                {/* Blog List with Pagination */}
                <RecentBlogList blogs={allBlogs} />
            </div>
        </div>
    );
}
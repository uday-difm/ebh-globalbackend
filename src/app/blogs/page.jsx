import { getAllBlogs, getAllCategories } from '@/lib/data';
import PaginatedBlogList from '@/component/blog/PaginatedBlogList';
import CategorySlider from '@/component/blog/CategorySlider'; // MODIFIED: Import renamed component

export const metadata = {
    title: "Latest Blogs | Earth by Humans",
    description: "Explore the latest environmental and science blogs.",
};

export default async function BlogHomePage() {
    const allBlogs = await getAllBlogs();
    const categories = await getAllCategories();

    return (
        <div className="pt-20 sm:pt-10">
            <div className="container mx-auto px-4 max-w-[1350] text-black">
                <div className="my-8">
                     {/* MODIFIED: Using the new CategorySlider component */}
                     <CategorySlider categories={categories} />
                </div>
                <div className="text-center col-span-2 flex flex-col gap-2 mb-6">
                    <h1 className="text-4xl font-bold">Most Recent Blogs</h1>
                    <p className="text-xl mb-16">Uncover the most popular reads across various life categories</p>
                </div>
                <PaginatedBlogList blogs={allBlogs} isAnimationEnabled={true} />

            </div>
        </div>
    );
}
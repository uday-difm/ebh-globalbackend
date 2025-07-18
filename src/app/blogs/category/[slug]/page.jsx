import { getBlogsByCategorySlug, getAllCategories } from '@/lib/data';
import PaginatedBlogList from '@/component/blog/PaginatedBlogList';
import CategorySlider from '@/component/blog/CategorySlider';
import { notFound } from 'next/navigation';
import Cta from '@/common/Cta';

export async function generateMetadata({ params }) {
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.category_slug === params.slug);
    const categoryName = category ? category.category_name : 'Blog';
    
    return {
        title: `${categoryName} Blogs | Earth by Humans`,
        description: `Explore all our blogs and articles under the ${categoryName} category.`,
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = params;
    const blogs = await getBlogsByCategorySlug(slug);
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.category_slug === slug);

    if (!category) {
        notFound();
    }

    return (
        <div className="pt-24 sm:pt-32 text-black">
            <div className="container mx-auto px-4 max-w-[1350]">
                <div className="my-8">
                     <CategorySlider categories={categories} />
                </div>
                <div className="text-center my-16">
                    <h1 className="text-4xl md:text-5xl font-bold">{category.category_name}</h1>
                    <p className="text-lg text-gray-600 mt-2">Discover articles in one of our most popular categories.</p>
                </div>
                <PaginatedBlogList blogs={blogs} isAnimationEnabled={false} />
            </div>
            <Cta />
        </div>
    );
}
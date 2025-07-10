import Sidebar from '@/component/blog/Sidebar';
import { getAllCategories, getAllBlogs } from '@/lib/data';

export default async function BlogLayout({ children }) {
    const categories = await getAllCategories();
    const allBlogs = await getAllBlogs();

    return (
        <div className="relative">
            <Sidebar categories={categories} allBlogs={allBlogs} />
            <main>{children}</main>
        </div>
    );
}
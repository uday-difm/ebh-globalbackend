import Sidebar from '@/component/blog/Sidebar';
import { getAllCategories, getAllBlogs } from '@/lib/data';

// This layout wraps all pages inside the /blog directory
export default async function BlogLayout({ children }) {
    // Fetch data once here and pass to the sidebar
    const categories = await getAllCategories();
    const allBlogs = await getAllBlogs();

    return (
        <div className="relative">
            <Sidebar categories={categories} allBlogs={allBlogs} />
            <main>{children}</main>
        </div>
    );
}
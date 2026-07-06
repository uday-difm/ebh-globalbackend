import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ blog }) {
    if (!blog) return null;

    return (
        <Link href={`/blogs/post/${blog.blog_slug}`} className="block group">
            <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative w-full h-48">
                    <Image
                        src={typeof blog.blog_feature_image === "string" && blog.blog_feature_image.trim() ? blog.blog_feature_image : "/no-image.png"}
                        alt={blog.blog_title || "Blog Post"}
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
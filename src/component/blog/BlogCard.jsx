import Link from 'next/link';
import Image from 'next/image';
import { GoDotFill } from "react-icons/go";

export default function BlogCard({ blog }) {
    return (
        <Link href={`/blog/post/${blog.blog_slug}`} className="block group">
            <div className="flex flex-col h-full border border-gray-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative w-full h-56 mb-4">
                    <Image
                        src={blog.blog_feature_image}
                        alt={blog.blog_title}
                        fill
                        className="w-full h-full object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <p className="text-sm font-semibold text-green-600 mb-2">{blog.category_name}</p>
                    <h3 className="text-xl font-bold text-gray-800 flex-grow mb-4 group-hover:text-green-700 transition-colors">
                        {blog.blog_title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                        <Image src={'https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png'} alt="author" width={32} height={32} className="rounded-full" />
                        <span>Earth By Humans</span>
                        <GoDotFill size="8px" />
                        <span>{blog.formatted_date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
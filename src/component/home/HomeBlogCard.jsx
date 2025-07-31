import Link from 'next/link';
import Image from 'next/image';

export default function HomeBlogCard({ blog, category_name }) {
  if (!blog) return null;

  return (
    <Link href={`/blogs/${blog.blog_slug}`} className="block group">
      <div className="grid grid-cols-3 border border-gray-300 gap-4 bg-white p-4 h-full transition-transform duration-300 hover:scale-[1.025] hover:shadow-md rounded-2xl">
        {/* Gradient accent bar */}
       
        <div className="col-span-2 flex flex-col relative">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-400 to-blue-400 rounded-t-2xl" />
          <span className="inline-block text-xs font-semibold text-green-700 bg-gradient-to-r from-green-100 to-blue-100 px-3 py-1 rounded-full self-start mb-2 shadow-sm border border-green-200">
            {category_name}
          </span>
          <h3 className="text-lg font-bold mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
            {blog.blog_title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100 gap-2">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png"
              alt="author"
              width={24}
              height={24}
              className="rounded-full mr-2"
            />
            <span>Earth By Humans</span>
            <span className="mx-2">•</span>
            <span>{blog.formatted_date}</span>
          </div>
        </div>
        <div className="col-span-1 relative overflow-hidden min-h-[120px] flex items-center justify-center rounded-2xl">
          <Image
            src={blog.blog_feature_image}
            alt={blog.blog_title}
            fill
            className="object-cover rounded-2xl"
            sizes="(max-width: 768px) 33vw, 25vw"
          />
        </div>
      </div>
    </Link>
  );
}


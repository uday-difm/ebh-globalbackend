import Link from 'next/link';
import Image from 'next/image';

export default function HomeBlogCard({ blog, category_name }) {
  if (!blog) return null;

  return (
    <Link href={`/blogs/${blog.blog_slug}`} className="block group">
      <div className="grid grid-cols-3 gap-4 border border-gray-200 rounded-xl p-4 h-full transition-shadow hover:shadow-lg bg-white">
        <div className="col-span-2 flex flex-col">
          <p className="text-xs font-semibold text-green-800 bg-green-100 px-3 py-1 rounded-full self-start mb-2">
            {category_name}
          </p>
          <h3 className="text-lg font-bold mb-2 group-hover:text-green-600 transition-colors">
            {blog.blog_title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
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

        <div className="col-span-1 relative rounded-lg overflow-hidden">
          <Image
            src={blog.blog_feature_image}
            alt={blog.blog_title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 33vw, 25vw"
          />
        </div>
      </div>
    </Link>
  );
}


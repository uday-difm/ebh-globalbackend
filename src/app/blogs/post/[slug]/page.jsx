import { getBlogBySlug } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import SocialShareButtons from '@/component/blog/SocialShareButtons';

export async function generateMetadata({ params }) {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) return { title: 'Blog not found' };
    
    return {
        title: blog.blog_title,
        description: blog.blog_description,
        keywords: blog.blog_tag,
        openGraph: {
            title: blog.blog_title,
            description: blog.blog_description,
            images: [blog.blog_feature_image],
        },
    };
}

export default async function IndividualBlogPost({ params }) {
    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
        notFound();
    }

    const wordsPerMinute = 200;
    const textContent = (blog.blog_content || '').replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    const cleanContent = (blog.blog_content || '').replace(/font-family:[^;]*;?/g, '');

    return (
        <article className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
            <header className="mb-8">
                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                     <Image src={blog.blog_feature_image} alt={blog.blog_title} fill className="object-cover" priority />
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                     <Link href={`/blogs/category/${blog.category_slug}`} className="flex items-center gap-2 hover:text-green-600">
                        <FontAwesomeIcon icon={faFile} className="text-green-600"/> {blog.category_name}
                     </Link>
                     <span className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarDays} className="text-green-600"/> {blog.formatted_date}</span>
                     <span className="flex items-center gap-2"><FontAwesomeIcon icon={faClock} className="text-green-600"/> {readingTime} min read</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{blog.blog_title}</h1>
            </header>
            
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: cleanContent }} />
            
            <footer className="mt-12">
                 <div className="flex flex-wrap items-center justify-between gap-4">
                     <div className="flex flex-wrap gap-2">
                         {blog.blog_tag && blog.blog_tag.split(',').map(tag => (
                             <Link key={tag} href={`/blogs/search?discover=${tag.trim()}`} className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">
                                 #{tag.trim()}
                             </Link>
                         ))}
                     </div>
                     <SocialShareButtons title={blog.blog_title} />
                 </div>
                 <div className="mt-12 p-6 bg-gray-50 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                      <Image src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" alt="Author" width={80} height={80} className="rounded-full flex-shrink-0" />
                      <div>
                          <h4 className="text-xl font-bold">Earth By Humans</h4>
                          <p className="text-gray-600 mt-1">Your online sanctuary for exploring the wonders of our planet and beyond.</p>
                      </div>
                 </div>
            </footer>
        </article>
    );
}
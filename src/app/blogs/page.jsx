import { headers } from 'next/headers';
import BlogHomeContent from './BlogHomeContent';

const safeFetchJson = async (endpoint, options, origin) => {
  try {
    const absoluteUrl = endpoint.startsWith('http')
      ? endpoint
      : new URL(endpoint, origin).toString();

    const response = await fetch(absoluteUrl, options);
    if (!response.ok) {
      console.error('Blog page fetch failed', response.status, absoluteUrl);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Blog page fetch threw', endpoint, error);
    return null;
  }
};

export default async function BlogHomePage() {
  const headerList = await headers();

  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  const forwardedHost = headerList.get('x-forwarded-host');
  const host = headerList.get('host');
  const envBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const vercelBase = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

  const origin = (forwardedHost ? `${proto}://${forwardedHost}` : null)
    || (host ? `${proto}://${host}` : null)
    || envBase
    || vercelBase
    || 'http://localhost:3000';

  const [blogsPayload, categoriesPayload] = await Promise.all([
    safeFetchJson('/api/blogs?page=1&limit=50', {
      next: { revalidate: 60 },
    }, origin),
    safeFetchJson('/api/categoriesHome', {
      next: { revalidate: 300 },
    }, origin),
  ]);

  const blogs = Array.isArray(blogsPayload?.blogs) ? blogsPayload.blogs : [];
  const categories = Array.isArray(categoriesPayload?.categories)
    ? categoriesPayload.categories
    : Array.isArray(blogsPayload?.categories)
      ? blogsPayload.categories
      : [];

  return (
    <>
      <title>Recent Blogs Latest Insights On Nature | Earth by Humans</title>
      <meta
        name="description"
        content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more."
      />
      <meta
        name="keywords"
        content="blogs, nature, environment, sustainability, science, ecology, climate, wildlife, conservation, latest reads"
      />
      <meta
        property="og:description"
        content="Explore Earth by Humans' latest blogs on ecology, sustainability, space, and more."
      />
      <link
        rel="icon"
        href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png"
        type="image/png"
      />

      <BlogHomeContent blogs={blogs} categories={categories} />
    </>
  );
}

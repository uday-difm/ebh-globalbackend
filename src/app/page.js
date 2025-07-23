// --- MODIFIED Code for: src/app/page.js ---

import Background from '../component/home/Background';
import HomePageClient from '../component/home/HomePageClient';
// import Image from 'next/image'; // Keep if used elsewhere in this file, otherwise remove

// This is the main Server Component for your home page
export default async function HomePage() {
  let categories = [];
  let latest1Magazine = [];
  let error = null;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  try {
    // Fetch categories from /api/categoriesHome
    const categoriesRes = await fetch(`${baseUrl}/api/categoriesHome`, { //
      cache: 'no-store' // Ensure fresh data
    });

    if (!categoriesRes.ok) {
      const errorData = await categoriesRes.json().catch(() => ({ message: 'Unknown error fetching categories' }));
      throw new Error(`Failed to fetch categories: ${categoriesRes.status} ${errorData.message}`);
    }
    const dataCategories = await categoriesRes.json();
    categories = dataCategories.categories ?? []; // Ensure it's an array and access the 'categories' key

    // Fetch only the latest 1 magazine (this optimization remains)
    const homeMagazineRes = await fetch(`${baseUrl}/api/home-magazine`, {
      cache: 'no-store'
    });

    if (!homeMagazineRes.ok) {
      const errorData = await homeMagazineRes.json().catch(() => ({ message: 'Unknown error fetching home magazine' }));
      throw new Error(`Failed to fetch home magazine: ${homeMagazineRes.status} ${errorData.message}`);
    }
    latest1Magazine = (await homeMagazineRes.json()) ?? []; // Ensure it's an array

  } catch (err) {
    console.error("Error fetching data for HomePage:", err);
    error = err.message;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error loading content: {error}</p>
        <p>Please check your API routes and data sources.</p>
      </div>
    );
  }

  return (

    <>
      <title>  Healing Our Earth Through Exploration | Earth by Humans</title>
      <meta name="description" content=" Explore Earth by Humans for videos, magazines, blogs, and quizzes on nature, conservation, and sustainability. Join our mission!" />
      <meta name="keywords" content=" Nature, conservation, sustainability, environment, ecology, wildlife, climate change, earth, science, quizzes" />
      <meta property="og:description" content="Explore Earth by Humans for videos, magazines, blogs, and quizzes on nature, conservation, and sustainability. Join our mission!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />

      <div>
        <Background />
        <HomePageClient
          magazines={latest1Magazine}
          categories={categories} // Now only passing categories (and magazines)
        />
      </div>

    </>
  );
}
// --- MODIFIED Code for: src/component/home/HomePageClient.jsx ---

"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Added React, useState, useEffect, useCallback
import { useSearchParams, useRouter } from 'next/navigation'; // Added useSearchParams, useRouter
import dynamic from 'next/dynamic';

const HeroWrapper = dynamic(() => import('./HeroWrapper'), {
  // loading: () => <Loader />,
  ssr: false,
});

import Magazines from '../../component/home/Magazines';
import LatestBlog from '../../component/home/LatestBlog';
import AdvertiseWithUs from '../../common/AdvertiseWithUs';
import Quiz from '../../app/quizzes/page';
import Cta from '../../common/Cta';

// HomePageClient now receives only magazines and categories
export default function HomePageClient({ magazines, categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial category slug from URL, default to "All"
  const initialCategorySlugFromUrl = searchParams.get('category') || "All";

  // State to manage the currently active category slug
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCategorySlugFromUrl);

  // Memoized function to update URL based on selected category
  const updateUrlCategory = useCallback((slug) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (slug === "All") {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', slug);
    }
    // Use router.replace to avoid adding to history unnecessarily if just changing params
    router.replace(`/?${newSearchParams.toString()}`, { shallow: true });
  }, [router, searchParams]); // Dependencies for useCallback

  // Effect to synchronize URL with activeCategorySlug state
  // This ensures that if the user navigates directly to a URL with a category param,
  // our internal state is correctly initialized, and vice-versa.
  useEffect(() => {
    const currentUrlCategory = searchParams.get('category') || "All";

    // If the URL param changes (e.g., user navigates back/forward), update state
    if (activeCategorySlug !== currentUrlCategory) {
      setActiveCategorySlug(currentUrlCategory);
    }
    // If the state changes (e.g., user clicks a category), update URL
    else if (activeCategorySlug !== initialCategorySlugFromUrl) {
      updateUrlCategory(activeCategorySlug);
    }
  }, [activeCategorySlug, searchParams, initialCategorySlugFromUrl, updateUrlCategory]);


  // Handler for category clicks from CategorySlider
  const handleCategoryClick = (slug) => {
    setActiveCategorySlug(slug); // This will trigger the useEffect above to update URL and LatestBlog
  };

  return (
    <>
      <title>  Healing Our Earth Through Exploration | Earth by Humans</title>
      <meta name="description" content=" Explore Earth by Humans for videos, magazines, blogs, and quizzes on nature, conservation, and sustainability. Join our mission!" />
      <meta name="keywords" content=" Nature, conservation, sustainability, environment, ecology, wildlife, climate change, earth, science, quizzes" />
      <meta property="og:description" content="Explore Earth by Humans for videos, magazines, blogs, and quizzes on nature, conservation, and sustainability. Join our mission!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />

      <div>
        <HeroWrapper />

        <Magazines magazines={magazines} />
        {/* Pass activeCategorySlug and handleCategoryClick to LatestBlog */}
        <LatestBlog
          categories={categories}
          activeCategorySlug={activeCategorySlug}
          onCategoryClick={handleCategoryClick} // Pass the handler down to LatestBlog
        />
        <Quiz />
        <AdvertiseWithUs />
        <Cta />
      </div>
    </>
  );
}
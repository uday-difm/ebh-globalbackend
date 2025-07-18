"use client";

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

export default function HomePageClient({ magazines, allBlogs, categories }) {
  return (
    <div>
      <HeroWrapper />
     
      <Magazines magazines={magazines} />
      <LatestBlog initialBlogs={allBlogs} categories={categories} />
      <Quiz />
       <AdvertiseWithUs />
      <Cta />
    </div>
  );
}

import { getAllBlogs, getAllCategories, getAllMagazines } from '@/lib/data';
import Hero from '@/component/home/Hero';
import Magazines from '@/component/home/Magazines';
import LatestBlog from '@/component/home/LatestBlog';
import Background from '@/component/home/Background';
import Cta from '@/common/Cta';
import AdvertiseWithUs from '@/common/AdvertiseWithUs';
// import Quiz from '@/component/common/Quiz';
// import YourMove from '@/component/common/YourMove';

// SEO Metadata for the Home Page
export const metadata = {
  title: "Exploring Science and Nature of Earth | Earth by humans",
  description: "Dive into the wonders of Earth with Earth By Humans as we explore its natural beauty and the scientific efforts to preserve the earth",
};

// This is the main Server Component for your home page
export default async function HomePage() {
  // Fetch all necessary data on the server for best performance
  const allBlogs = await getAllBlogs();
  const categories = await getAllCategories();
  const magazines = await getAllMagazines();

  return (
    <div>
      <Background />
      <Hero />
      <Magazines magazines={magazines} />
      <LatestBlog initialBlogs={allBlogs} categories={categories} />
      {/* <Quiz /> */}
      {/* <div className="container mx-auto 2xl:px-16 py-[60px] px-[15px]">
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-blue-800 text-center font-bold">
            Track Your Score
        </h2>
        <YourMove />
      </div> */}
      <AdvertiseWithUs />
      <Cta />
    </div>
  );
}
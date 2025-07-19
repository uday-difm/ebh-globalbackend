import { getAllBlogs, getAllCategories} from '../lib/data';
import Background from '../component/home/Background';
import HomePageClient from '../component/home/HomePageClient';

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


  const res = await fetch('http://localhost:3000/api/magazine/magazineFetch', { cache: 'no-store' });
  const magazines = await res.json();

  return (
    <div>
      <Background />
      <HomePageClient magazines={magazines} allBlogs={allBlogs} categories={categories} />
    </div>
  );
}

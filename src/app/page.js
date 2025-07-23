import Hero from "../component/home/Hero";
import LatestBlog from "../component/home/LatestBlog";
import LatestMagazine from '../component/home/LatestMagazine'
import QuizPage from "./quizzes/QuizPage";
import AdvertiseWithUs from "../common/AdvertiseWithUs";
import Cta from '../common/Cta'

export const metadata = {
  title: "Exploring Science and Nature of Earth | Earth by humans",
  description: "Dive into the wonders of Earth with Earth By Humans as we explore its natural beauty and the scientific efforts to preserve the earth",
};


export default async function HomePage() {


  return (
    <div >
      <Hero />
      <LatestMagazine />
      <LatestBlog />
      <QuizPage />
      <AdvertiseWithUs />
      <Cta />
    </div>
  );
}

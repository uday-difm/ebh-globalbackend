import Hero from "../components/home/Hero";
import LatestBlog from "../components/home/LatestBlog";
import LatestMagazine from '../components/home/LatestMagazine';
import AdvertiseWithUs from "../common/AdvertiseWithUs";
import Cta from '../common/Cta'


export default async function HomePage() {


  return (
    <>
      <title>  Healing Our Earth Through Exploration | Earth by Humans</title>
      <meta name="description" content=" Explore Earth by Humans for videos, magazines, blogs, and quizzes on nature, conservation, and sustainability. Join our mission!" />
      <meta name="keywords" content=" Nature, conservation, sustainability, environment, ecology, wildlife, climate change, earth, science, quizzes" />
      <meta property="og:description" content="Explore Earth by Humans for videos, magazines, blogs, and quizzes on nature, conservation, and sustainability. Join our mission!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <meta property="og:image" content="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" />
      <div className="flex flex-col gap-24">
        <Hero />
        <LatestMagazine />
        <LatestBlog />
        <AdvertiseWithUs />
        <Cta />
      </div>
    </>
  );
}
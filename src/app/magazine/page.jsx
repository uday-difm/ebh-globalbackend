import prisma from "@/lib/prisma";
import MagazineClient from "./MagazineClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Magazine Explore Editions Of Our Content | Earth by Humans",
  description: "Explore all past and current editions of Earth by Humans Magazine. Dive into captivating content on nature, science, and sustainability.",
  keywords: "magazine, editions, nature, science, sustainability, conservation, environment, digital magazine, archives, publications",
  openGraph: {
    description: "Explore all past and current editions of Earth by Humans Magazine. Dive into captivating content on nature, science, and sustainability.",
  },
  icons: {
    icon: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png",
  }
};

export default async function MagazinePage() {
  let formattedMagazines = [];
  try {
    const dbMagazines = await prisma.magazine.findMany({
      where: {
        status: 1
      },
      orderBy: {
        date: "desc"
      }
    });

    formattedMagazines = dbMagazines.map((mag) => ({
      id: mag.id,
      magazine_id: mag.magazineId,
      magazine_title: mag.title,
      magazine_description: mag.description,
      magazine_tags: mag.tags,
      magazine_cover_image: mag.coverImage,
      magazine_link: mag.link,
      magazine_date: mag.date ? mag.date.toISOString() : null,
      magazine_category: mag.category,
      MagCloudLink: mag.magCloudLink,
      magazine_slug: mag.slug,
      status: mag.status
    }));
  } catch (err) {
    console.error("Prisma magazines load error on server:", err);
  }

  return <MagazineClient initialMagazines={formattedMagazines} />;
}
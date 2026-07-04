import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { apiSuccess } from "@/core/errors";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || "ebh";

    let settings = await prisma.globalSettings.findUnique({
      where: { siteId },
      select: { footer: true }
    });

    if (!settings || !settings.footer) {
      const defaultFooter = {
        logo: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif",
        description: "Earth by Humans, your online sanctuary for exploring the wonders of our planet and beyond. Immerse yourself in captivating nature posts, inspiring stories, and thought-provoking content that celebrates the beauty of Earth along with fun Quizzes.",
        issn_image: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-ISSN.jpg",
        issn_link: "https://portal.issn.org/resource/ISSN/3066-5027",
        company_links: [
          { href: "/blogs", label: "Blogs" },
          { href: "/about-us", label: "About Us" },
          { href: "/magazine", label: "Magazines" },
          { href: "/quizzes", label: "Quizzes" },
          { href: "/contact-us", label: "Contact Us" }
        ],
        social_links: {
          linkedin: "https://www.linkedin.com/company/earth-by-humans/",
          instagram: "https://www.instagram.com/earth_by_humans/",
          facebook: "https://www.facebook.com/earthbyhumans",
          youtube: "https://www.youtube.com/@EarthByHumans",
          twitter: "https://twitter.com/earthbyhumans"
        },
        contact_email: "info@earthbyhumans.com",
        copyright: "Earth By Humans (A Brand Concept Within The DO IT FOR ME LLC ECOSYSTEM)",
        legal_links: [
          { href: "/terms-and-conditions", label: "Terms of Conditions" },
          { href: "/information-policy", label: "Information Policy" },
          { href: "/privacy-policy", label: "Privacy Policy" }
        ]
      };

      // Ensure Site exists
      await prisma.site.upsert({
        where: { id: siteId },
        update: {},
        create: {
          id: siteId,
          name: "Earth By Humans",
          domain: "earthbyhumans.com",
          isActive: true
        }
      });

      // Upsert global settings
      const updatedSettings = await prisma.globalSettings.upsert({
        where: { siteId },
        update: { footer: defaultFooter },
        create: {
          siteId,
          footer: defaultFooter
        }
      });

      return NextResponse.json(apiSuccess({ footer: updatedSettings.footer }));
    }

    return NextResponse.json(apiSuccess({ footer: settings.footer }));
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}

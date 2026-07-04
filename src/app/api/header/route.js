import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { apiSuccess } from "@/core/errors";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || "ebh";

    let settings = await prisma.globalSettings.findUnique({
      where: { siteId },
      select: { header: true }
    });

    if (!settings || !settings.header) {
      const defaultHeader = {
        logo: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif",
        links: [
          { href: "/", label: "Home" },
          { href: "/about-us", label: "About Us" },
          { href: "/blogs", label: "Blogs" },
          { href: "/magazine", label: "Magazines" },
          { href: "/quizzes", label: "Fun-Zone", badge: "Most Popular" },
          { href: "/contact-us", label: "Contact Us" }
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
        update: { header: defaultHeader },
        create: {
          siteId,
          header: defaultHeader,
          navigation: { main: defaultHeader.links, footer: [] }
        }
      });

      return NextResponse.json(apiSuccess({ header: updatedSettings.header }));
    }

    return NextResponse.json(apiSuccess({ header: settings.header }));
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}

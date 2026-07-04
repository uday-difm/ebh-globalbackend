import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "4", 10);

    // Build query conditions
    const where = {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    };

    if (categorySlug && categorySlug !== "All") {
      where.categories = {
        some: { slug: categorySlug },
      };
    }

    const dbPosts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        categories: true,
        featuredImage: true,
      },
    });

    // Map Prisma Posts to EBH format
    const blogs = dbPosts.map((post) => {
      const pubDate = post.publishedAt || post.createdAt;
      const formattedDate = new Date(pubDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return {
        blog_id: post.id,
        blog_title: post.title,
        blog_slug: post.slug,
        blog_description: post.excerpt || "",
        blog_feature_image: post.featuredImage?.secureUrl || post.featuredImage?.url || "",
        date: pubDate.toISOString().split("T")[0],
        formatted_date: formattedDate,
        category_name: post.categories?.[0]?.name || "Uncategorized",
        category_slug: post.categories?.[0]?.slug || "uncategorized",
      };
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("API Error (GET /api/home-blogs):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
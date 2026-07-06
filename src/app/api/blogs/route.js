import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInteger(searchParams.get("page"), 1);
    const limitParam = parseInteger(searchParams.get("limit"), 9);
    const limit = Math.min(Math.max(limitParam, 1), 50); // clamp to reasonable size
    const offset = (page - 1) * limit;

    // Count published posts
    const total = await prisma.post.count({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
    });

    // Fetch published posts
    const dbPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        categories: true,
        tags: true,
        featuredImage: true,
        author: { select: { name: true, bio: true, email: true } },
      },
    });

    // Fetch active categories
    const dbCategories = await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });

    // Map Prisma Posts to EBH Frontend Format
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
        blog_content: post.contentJson || "",
        blog_tag: post.tags.map((t) => t.name).join(", "),
        blog_date_time: pubDate.toISOString(),
        formatted_date: formattedDate,
        blog_category_id: post.categories?.[0]?.id || "",
        category_name: post.categories?.[0]?.name || "Uncategorized",
        category_slug: post.categories?.[0]?.slug || "uncategorized",
        status: 1,
        author_name: post.author?.name || "Earth By Humans",
        author_bio: post.author?.bio || "",
        author_image: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png",
      };
    });

    // Map categories to EBH format
    const categories = dbCategories.map((cat) => ({
      category_id: cat.id,
      category_name: cat.name,
      category_slug: cat.slug,
      status: 1,
    }));

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: total > 0 ? Math.ceil(total / limit) : 1,
      },
      categories,
    });
  } catch (error) {
    console.error("API Error (GET /api/blogs):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

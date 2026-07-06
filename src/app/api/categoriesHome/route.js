import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit") ?? url.searchParams.get("blogsLimit") ?? "9";
    const limit = Math.max(1, Math.min(1000, Number(limitParam || 9)));

    const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

    // 1. Get total published count
    const totalPublished = await prisma.post.count({
      where: {
        siteId,
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
    });

    // 2. Get categories with counts
    const dbCategories = await prisma.category.findMany({
      where: { siteId, deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                siteId,
                status: "PUBLISHED",
                deletedAt: null,
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    });

    // 3. Get recent published blogs
    const dbPosts = await prisma.post.findMany({
      where: {
        siteId,
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        categories: true,
        featuredImage: true,
      },
    });

    // Map categories output
    const categories = [
      {
        category_id: "all",
        category_name: "All",
        category_slug: "all",
        blog_count: totalPublished,
      },
      ...dbCategories.map((cat) => ({
        category_id: cat.id,
        category_name: cat.name,
        category_slug: cat.slug,
        blog_count: cat._count.posts,
      })),
    ];

    // Map posts output
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
        blog_feature_image: post.featuredImage?.secureUrl || post.featuredImage?.url || "",
        blog_description: post.excerpt || "",
        formatted_date: formattedDate,
        status: 1,
        blog_category_id: post.categories?.[0]?.id || "",
        category_name: post.categories?.[0]?.name || "Uncategorized",
        category_slug: post.categories?.[0]?.slug || "uncategorized",
      };
    });

    return NextResponse.json({
      categories,
      blogs,
      totalPublished,
    });
  } catch (err) {
    console.error("Error in /api/categoriesHome:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

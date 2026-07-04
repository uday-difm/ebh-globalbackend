import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Map a Prisma post to original EBH frontend format
function mapPostToEbh(post) {
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
    publish_date: pubDate.toISOString(),
    formatted_date: formattedDate,
    updated_at: post.updatedAt.toISOString(),
    blog_category_id: post.categories?.[0]?.id || "",
    category_name: post.categories?.[0]?.name || "Uncategorized",
    category_slug: post.categories?.[0]?.slug || "uncategorized",
    status: 1,
    author_name: post.author?.name || "Earth By Humans",
    author_bio: post.author?.bio || "",
    author_image: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png",
  };
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    let slug = params?.slug;

    if (Array.isArray(slug)) slug = slug[0];

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // 1️⃣ Look up blog post by slug
    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
      include: {
        categories: true,
        tags: true,
        featuredImage: true,
        author: { select: { name: true, bio: true, email: true } },
      },
    });

    if (post) {
      return NextResponse.json({
        type: "post",
        data: mapPostToEbh(post),
      });
    }

    // 2️⃣ Look up category by slug
    const category = await prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });

    if (category) {
      // Fetch blogs in this category
      const categoryPosts = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          publishedAt: { lte: new Date() },
          categories: { some: { slug } },
        },
        orderBy: { publishedAt: "desc" },
        include: {
          categories: true,
          tags: true,
          featuredImage: true,
          author: { select: { name: true, bio: true, email: true } },
        },
      });

      return NextResponse.json({
        type: "category",
        data: {
          category: {
            category_id: category.id,
            category_name: category.name,
            category_slug: category.slug,
            status: 1,
          },
          blogs: categoryPosts.map(mapPostToEbh),
        },
      });
    }

    // 3️⃣ Not found
    return NextResponse.json({ error: "Not Found", slug }, { status: 404 });
  } catch (err) {
    console.error("[slug] API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // adjust if your db path differs

// ---------------- Fetch a Single Blog by Slug (only published) ----------------
async function getBlogBySlugFromDB(slug) {
  try {
    console.log('API: Searching for blog with slug:', slug);
    const sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        b.blog_tag,
        b.blog_date_time AS publish_date,
        b.blog_timestamp AS updated_at,
        DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
        bc.category_name,
        bc.category_slug
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE b.blog_slug = ?
        AND b.status = 1
        AND bc.status = 1
      LIMIT 1;
    `;
    const [rows] = await db.query(sql, [slug]);
    console.log('API: Query result for slug', slug, ':', rows.length > 0 ? 'Found' : 'Not found');
    if (rows.length > 0) {
      console.log('API: Found blog:', rows[0].blog_title, 'with status:', rows[0].status);
    }
    return rows?.[0] ?? null;
  } catch (error) {
    console.error("API: Error fetching single blog:", error);
    throw error;
  }
}

// ---------------- Fetch a Category by Slug (only active categories) ----------------
async function getCategoryBySlugFromDB(slug) {
  try {
    console.log('API: Searching for category with slug:', slug);
    const sql = `
      SELECT category_id, category_name, category_slug
      FROM blog_category
      WHERE category_slug = ?
        AND status = 1
      LIMIT 1;
    `;
    const [rows] = await db.query(sql, [slug]);
    console.log('API: Query result for category slug', slug, ':', rows.length > 0 ? 'Found' : 'Not found');
    if (rows.length > 0) {
      console.log('API: Found category:', rows[0].category_name);
    }
    return rows?.[0] ?? null;
  } catch (error) {
    console.error("API: Error fetching single category:", error);
    throw error;
  }
}

// ---------------- Fetch Blogs in Category (only published blogs) ----------------
async function getBlogsInCategoryFromDB(categorySlug) {
  try {
    const sql = `
      SELECT
        b.blog_id,
        b.blog_title,
        b.blog_slug,
        b.blog_description,
        b.blog_feature_image,
        b.blog_content,
        b.blog_tag,
        b.blog_date_time AS publish_date,
        DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
        b.blog_timestamp AS updated_at,
        bc.category_name,
        bc.category_slug,
        b.blog_category_id
      FROM blogs b
      JOIN blog_category bc ON b.blog_category_id = bc.category_id
      WHERE bc.category_slug = ?
        AND b.status = 1
        AND bc.status = 1
      ORDER BY b.blog_date_time DESC;
    `;
    const [rows] = await db.query(sql, [categorySlug]);
    return rows ?? [];
  } catch (error) {
    console.error("Error fetching blogs in category:", error);
    throw error;
  }
}

// ---------------- API Route Handler ----------------
// export async function GET(request, { params }) {
//   try {
//     // params.slug may be string or array (catch both)
//     let slug = params?.slug;
//     if (Array.isArray(slug)) slug = slug[0];
//     if (!slug || typeof slug !== 'string') {
//       console.log('Invalid slug:', slug);
//       return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
//     }

//     console.log('Fetching content for slug:', slug);

//     // First, check if database connection works
//     try {
//       const [testRows] = await db.query('SELECT 1 as test');
//       console.log('Database connection OK');
//     } catch (dbError) {
//       console.error('Database connection failed:', dbError);
//       return NextResponse.json({ error: 'Database connection failed', details: dbError.message }, { status: 500 });
//     }

//     // 1) Try treat slug as a blog post slug (published only)
//     const matchedBlog = await getBlogBySlugFromDB(slug);
    
//     if (matchedBlog) {
//       console.log(`[API] Slug FOUND as BLOG: ${slug}`);
//       console.log('Found blog:', matchedBlog.blog_title);
//       return NextResponse.json({ type: 'post', data: matchedBlog });
//     }

//     // 2) If not a blog, try treat slug as a category slug (active only)
//     const category = await getCategoryBySlugFromDB(slug);
//     if (category) {
//       console.log('Found category:', category.category_name);
//       const blogsInCategory = await getBlogsInCategoryFromDB(slug);
//       return NextResponse.json({
//         type: 'category',
//         data: {
//           category,
//           blogs: blogsInCategory,
//         },
//       });
//     }

//     // 3) Not found - let's check what blogs exist
//     try {
//       const [allBlogs] = await db.query('SELECT blog_slug, blog_title, status FROM blogs LIMIT 10');
//       console.log('Available blogs:', allBlogs);
//       const [allCategories] = await db.query('SELECT category_slug, category_name, status FROM blog_category LIMIT 10');
//       console.log('Available categories:', allCategories);
//     } catch (queryError) {
//       console.error('Error querying available content:', queryError);
//     }

//     console.log('No content found for slug:', slug);
//     return NextResponse.json({ error: 'Not Found', slug: slug }, { status: 404 });
//   } catch (err) {
//     console.error("[slug] API Error:", err && (err.stack || err));
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

export async function GET(request, context) {
  try {
    const params = await context.params; // ✅ FIX
    let slug = params?.slug;

    if (Array.isArray(slug)) slug = slug[0];

    if (!slug || typeof slug !== 'string') {
      console.log('[API] Invalid slug:', slug);
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    console.log('[API] Fetching content for slug:', slug);

    // 1️⃣ Blog lookup
    const matchedBlog = await getBlogBySlugFromDB(slug);
    if (matchedBlog) {
      console.log(`[API] Slug FOUND as BLOG: ${slug}`);
      return NextResponse.json({ type: 'post', data: matchedBlog });
    }

    // 2️⃣ Category lookup
    const category = await getCategoryBySlugFromDB(slug);
    if (category) {
      console.log(`[API] Slug FOUND as CATEGORY: ${slug}`);
      const blogsInCategory = await getBlogsInCategoryFromDB(slug);
      return NextResponse.json({
        type: 'category',
        data: { category, blogs: blogsInCategory },
      });
    }

    // 3️⃣ Not found
    console.log(`[API] Slug NOT FOUND: ${slug}`);
    return NextResponse.json(
      { error: 'Not Found', slug },
      { status: 404 }
    );
  } catch (err) {
    console.error('[slug] API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

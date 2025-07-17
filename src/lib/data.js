import { cache } from 'react';
import db from './db'; // Import our direct database connection

// --- getAllCategories ---
export const getAllCategories = cache(async () => {
  try {
    const sql = "SELECT * FROM `blog_category`";
    const [data] = await db.query(sql);
    return data;
  } catch (error) {
    console.error("Database Error (getAllCategories):", error);
    return [];
  }
});

// --- getAllBlogs ---
export const getAllBlogs = cache(async () => {
  try {
    const sql = `
            SELECT b.*, DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date, 
                   bc.category_name, bc.category_slug
            FROM blogs b
            INNER JOIN blog_category bc ON b.blog_category_id = bc.category_id
            WHERE b.status = 1 ORDER BY b.blog_date_time DESC`;
    const [data] = await db.query(sql);
    return data;
  } catch (error) {
    console.error("Database Error (getAllBlogs):", error);
    return [];
  }
});

// --- getAllMagazines ---
export const getAllMagazines = cache(async () => {
  try {
    // MODIFIED: This now queries the database directly instead of using fetch
    const sql = `SELECT * FROM magazines ORDER BY magazine_date DESC`;
    const [data] = await db.query(sql);
    return data;
  } catch (error) {
    console.error("Database Error (getAllMagazines):", error);
    return [];
  }
});



// --- getBlogBySlug ---
export const getBlogBySlug = cache(async (slug) => {
  try {
    const sql = `
            SELECT b.*, DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date,
                   c.category_name, c.category_slug
            FROM blogs AS b
            LEFT JOIN blog_category AS c ON b.blog_category_id = c.category_id
            WHERE b.blog_slug = ? AND b.status = 1`;
    const [data] = await db.query(sql, [slug]);
    return data[0] || null;
  } catch (error) {
    console.error("Database Error (getBlogBySlug):", error);
    return null;
  }
});

// --- getBlogsByCategorySlug ---
export const getBlogsByCategorySlug = cache(async (categorySlug) => {
  try {
    const sql = `
            SELECT b.*, DATE_FORMAT(b.blog_date_time, '%e %M %Y') AS formatted_date, 
                   bc.category_name, bc.category_slug
            FROM blogs b
            INNER JOIN blog_category bc ON b.blog_category_id = bc.category_id
            WHERE b.status = 1 AND bc.category_slug = ?
            ORDER BY b.blog_date_time DESC`;
    const [data] = await db.query(sql, [categorySlug]);
    return data;
  } catch (error) {
    console.error("Database Error (getBlogsByCategorySlug):", error);
    return [];
  }
});

// --- updateBlogBySlug ---
export async function updateBlogBySlug(slug, {
  blogTitle,
  blogTag,
  blogCategory,
  blogDescription,
  blogContent,
  blogDate,
  blogTime,
  blogSlug,
  image,
  existingImageUrl,
}) {
  try {
    // Combine date and time for blog_date_time
    const blogDateTime = blogDate && blogTime ? `${blogDate} ${blogTime}` : null;
    let imageUrl = existingImageUrl;
    // If a new image is provided, handle upload and set imageUrl accordingly
    if (image && typeof image === 'object' && image.name) {
      // You need to implement your image upload logic here
      // For now, just set imageUrl to a placeholder or keep existing
      // imageUrl = await uploadImage(image); // Implement this if needed
    }
    const sql = `UPDATE blogs SET 
      blog_title = ?,
      blog_tag = ?,
      blog_category_id = ?,
      blog_description = ?,
      blog_content = ?,
      blog_date_time = ?,
      blog_slug = ?,
      blog_feature_image = ?
      WHERE blog_slug = ?`;
    const [result] = await db.query(sql, [
      blogTitle,
      blogTag,
      blogCategory,
      blogDescription,
      blogContent,
      blogDateTime,
      blogSlug,
      imageUrl,
      slug,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database Error (updateBlogBySlug):', error);
    return false;
  }
}

// --- deleteBlogBySlug ---
export async function deleteBlogBySlug(slug) {
  try {
    const sql = 'DELETE FROM blogs WHERE blog_slug = ?';
    const [result] = await db.query(sql, [slug]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database Error (deleteBlogBySlug):', error);
    return false;
  }
}


//---------deletemagazinebySlug-----------------
export async function deleteMagazineBySlug(slug) {
  try {
    const sql = 'DELETE FROM magazines WHERE magazine_slug = ?';
    const [result] = await db.query(sql, [slug]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database Error (deleteMagazineBySlug):', error);
    return false;
  }
}


// --- updatemagazineBySlug ---
export async function updateMagazineBySlug(slug, {
  magazine_id,
  magazine_title,
  magazine_description,
  magazine_tags,
  magazine_category,
  magazine_cover_image,
  magazine_link,
  magazine_date,
  MagCloudLink,
  magazine_slug,
}) {
  try {
    const sql = `UPDATE magazines SET 
      magazine_id = ?,
      magazine_title = ?,
      magazine_description = ?,
      magazine_tags = ?,
      magazine_category = ?,
      magazine_cover_image = ?,
      magazine_link = ?,
      magazine_date = ?,
      MagCloudLink = ?,
      magazine_slug = ?
      WHERE magazine_slug = ?`;
    const [result] = await db.query(sql, [
      magazine_id,
      magazine_title,
      magazine_description,
      magazine_tags,
      magazine_category,
      magazine_cover_image,
      magazine_link,
      magazine_date,
      MagCloudLink,
      magazine_slug,
      slug,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database Error (updatemagazineBySlug):', error);
    return false;
  }
}



// --- getMagazineBySlug ---
export const getMagazineBySlug = cache(async (slug) => {
  try {
    const sql = `
    SELECT *, DATE_FORMAT(Magazine_date, '%e %M %Y') AS formatted_date
    FROM Magazines
    WHERE Magazine_slug = ?
  `;

    const [data] = await db.query(sql, [slug]);
    return data[0] || null;
  } catch (error) {
    console.error("Database Error (getMagazineBySlug):", error);
    return null;
  }
});
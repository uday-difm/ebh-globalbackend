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

















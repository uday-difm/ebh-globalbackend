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
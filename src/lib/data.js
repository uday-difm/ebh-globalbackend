import { cache } from 'react';
import slugify from 'slugify';

// Replace with your actual server URL
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getAllCategories = cache(async () => {
    try {
        const res = await fetch(`${serverUrl}/blog/fetchcategory`, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
});

export const getAllBlogs = cache(async () => {
    try {
        const res = await fetch(`${serverUrl}/blog/fetchblog`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return [];
    }
});

export const getBlogBySlug = cache(async (slug) => {
    try {
        const res = await fetch(`${serverUrl}/blog/individualBlog/${slug}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data[0]; // The API returns an array
    } catch (error) {
        console.error(`Failed to fetch blog by slug ${slug}:`, error);
        return null;
    }
});

export const getBlogsByCategorySlug = cache(async (categorySlug) => {
    try {
        const res = await fetch(`${serverUrl}/blog/${categorySlug}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch blogs for category ${categorySlug}:`, error);
        return [];
    }
});

// Helper to create a clean slug
export const createSlug = (text) => slugify(text, { lower: true, strict: true });
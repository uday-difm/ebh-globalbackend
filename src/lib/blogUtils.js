// /lib/blogUtils.js
import db from './db';

export const updateBlogStatusBySlug = async (slug, status) => {
  try {
    const [result] = await db.query(
      'UPDATE blogs SET status = ? WHERE blog_slug = ?',
      [status, slug]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating blog status:', error);
    return false;
  }
};

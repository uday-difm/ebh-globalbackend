export default async function sitemap() {
  const baseUrl = "https://www.earthbyhumans.com/";

  // Fetch Blogs
  let blogs = [];
  try {
    const res = await fetch(`${baseUrl}/api/blogs?limit=5000`);
    if (res.ok) {
      const data = await res.json();
      blogs = Array.isArray(data.blogs) ? data.blogs : [];
    } else {
      console.error("Blog API returned status:", res.status);
    }
  } catch (err) {
    console.error("Blog sitemap error:", err);
  }

  // Fetch Categories
  let categories = [];
  try {
    const res = await fetch(`${baseUrl}/api/categoriesHome`);
    if (res.ok) {
      categories = await res.json();
      categories = Array.isArray(categories) ? categories : [];
    } else {
      console.error("Category API returned status:", res.status);
    }
  } catch (err) {
    console.error("Category sitemap error:", err);
  }

  // Fetch Magazines
  let magazines = [];
  try {
    const res = await fetch(`${baseUrl}/api/magazine?limit=5000`);
    if (res.ok) {
      const data = await res.json();
      magazines = Array.isArray(data.magazines) ? data.magazines : [];
    } else {
      console.error("Magazine API returned status:", res.status);
    }
  } catch (err) {
    console.error("Magazine sitemap error:", err);
  }

  // Fetch Quizzes
  let quizzes = [];
  try {
    const res = await fetch(`${baseUrl}/api/quizzes?limit=5000`);
    if (res.ok) {
      const data = await res.json();
      quizzes = Array.isArray(data.quizzes) ? data.quizzes : [];
    } else {
      console.error("Quiz API returned status:", res.status);
    }
  } catch (err) {
    console.error("Quiz sitemap error:", err);
  }

  return [
    // ---- STATIC PAGES ----
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quizzes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },

    // ---- BLOGS ----
    ...blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.blog_slug}`,
      lastModified: b.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // ---- BLOG CATEGORIES ----
    ...categories.map((c) => ({
      url: `${baseUrl}/blogs/category/${c.category_slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    })),

    // ---- MAGAZINES ----
    ...magazines.map((m) => ({
      url: `${baseUrl}/magazine/${m.slug}`,
      lastModified: m.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })),

    // ---- QUIZZES ----
    ...quizzes.map((q) => ({
      url: `${baseUrl}/quizzes/${q.slug}`,
      lastModified: q.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}

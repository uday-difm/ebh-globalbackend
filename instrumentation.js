/**
 * instrumentation.js
 *
 * Next.js runs this file ONCE on server startup (both dev and prod).
 * Dynamically scans src/app for page.js/page.jsx files and auto-syncs
 * all discovered public routes into the global backend database.
 */

const SITE_ID = "ebh";

// Patterns to exclude from route registration (admin, API, auth internals)
const EXCLUDED_PREFIXES = [
  "/admin",
  "/crm",
  "/api",
  "/preview",
  "/maintenance",
  "/all-played-quiz",
  "/yourmove",
  "/login",
  "/forgot-password",
  "/reset-password",
];

/**
 * Derive a human-readable title from a slug.
 * e.g. /about-us => About Us
 *      /blogs/[slug] => Blog Detail
 */
function slugToTitle(slug) {
  if (slug === "/") return "Home";

  const last = slug.split("/").filter(Boolean).pop() || "";

  // Dynamic segments like [slug]
  if (last.startsWith("[") && last.endsWith("]")) {
    const parent = slug.split("/").filter(Boolean).slice(-2, -1)[0] || "";
    const name = parent.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${name} Detail`.trim();
  }

  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  try {
    // Dynamically import node-specific modules to avoid edge runtime errors
    const path = await import("path");
    const fs = await import("fs");

    /**
     * Recursively walk `src/app` and return all directory paths
     * that contain a page.js or page.jsx file.
     */
    function discoverPageDirs(dir, found = []) {
      let entries;
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return found;
      }

      const hasPage = entries.some(
        (e) => e.isFile() && (e.name === "page.js" || e.name === "page.jsx")
      );

      if (hasPage) {
        found.push(dir);
      }

      for (const entry of entries) {
        if (entry.isDirectory()) {
          discoverPageDirs(path.join(dir, entry.name), found);
        }
      }

      return found;
    }

    /**
     * Convert a filesystem path under src/app into a Next.js URL slug.
     */
    function dirToSlug(dir, appDir) {
      const relative = path.relative(appDir, dir).replace(/\\/g, "/");
      return relative === "" ? "/" : `/${relative}`;
    }

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const appDir = path.join(process.cwd(), "src", "app");

    // Discover all directories containing a page file
    const pageDirs = discoverPageDirs(appDir);

    // Convert to slugs and filter out excluded paths
    const routes = pageDirs
      .map((dir) => dirToSlug(dir, appDir))
      .filter(
        (slug) => !EXCLUDED_PREFIXES.some((prefix) => slug.startsWith(prefix))
      )
      .map((slug) => ({
        slug,
        title: slugToTitle(slug),
        isDynamic: slug.includes("["),
      }));

    // Ensure site exists
    await prisma.site.upsert({
      where: { id: SITE_ID },
      update: {},
      create: {
        id: SITE_ID,
        name: "Earth By Humans",
        domain: "earthbyhumans.com",
        isActive: true,
      },
    });

    let synced = 0;
    for (const route of routes) {
      await prisma.page.upsert({
        where: { siteId_slug: { siteId: SITE_ID, slug: route.slug } },
        update: {
          title: route.title,
          isManagedBySync: true,
          isDiscovered: true,
        },
        create: {
          siteId: SITE_ID,
          slug: route.slug,
          title: route.title,
          status: "PUBLISHED",
          isManagedBySync: true,
          isDiscovered: true,
          isHardcoded: !route.isDynamic,
          publishedAt: new Date(),
        },
      });
      synced++;
    }

    // Self-cleaning step: Delete obsolete/excluded pages from database
    const activeSlugs = routes.map((r) => r.slug);
    const deleteResult = await prisma.page.deleteMany({
      where: {
        siteId: SITE_ID,
        isDiscovered: true,
        slug: {
          notIn: activeSlugs,
        },
      },
    });

    await prisma.$disconnect();
    console.log(
      `[EBH Startup] ✅ Auto-discovered and synced ${synced} routes to global backend.`
    );
    if (deleteResult.count > 0) {
      console.log(
        `[EBH Startup] 🗑️ Cleaned up ${deleteResult.count} obsolete pages from database.`
      );
    }
  } catch (err) {
    console.error("[EBH Startup] ⚠️ Route sync failed:", err.message);
  }
}

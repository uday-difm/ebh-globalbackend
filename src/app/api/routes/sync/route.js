import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

const SITE_ID = "ebh";

const EXCLUDED_PREFIXES = [
  "/admin",
  "/crm",
  "/api",
  "/preview",
  "/maintenance",
  "/all-played-quiz",
  "/yourmove",
];

function discoverPageDirs(dir, appDir, found = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }

  const hasPage = entries.some(
    (e) => e.isFile() && (e.name === "page.js" || e.name === "page.jsx")
  );

  if (hasPage) found.push(dir);

  for (const entry of entries) {
    if (entry.isDirectory()) {
      discoverPageDirs(path.join(dir, entry.name), appDir, found);
    }
  }

  return found;
}

function dirToSlug(dir, appDir) {
  const relative = path.relative(appDir, dir).replace(/\\/g, "/");
  return relative === "" ? "/" : `/${relative}`;
}

function slugToTitle(slug) {
  if (slug === "/") return "Home";
  const last = slug.split("/").filter(Boolean).pop() || "";
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

async function syncRoutes() {
  const appDir = path.join(process.cwd(), "src", "app");

  const pageDirs = discoverPageDirs(appDir, appDir);

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
  const errors = [];

  for (const route of routes) {
    try {
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
    } catch (err) {
      errors.push({ slug: route.slug, error: err.message });
    }
  }

  return { synced, failed: errors.length, errors, discovered: routes.map((r) => r.slug) };
}

export async function POST() {
  try {
    const result = await syncRoutes();
    return NextResponse.json({
      success: true,
      message: `Discovered ${result.discovered.length} routes, synced ${result.synced}, failed ${result.failed}.`,
      ...result,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await syncRoutes();
    return NextResponse.json({
      success: true,
      message: `Discovered ${result.discovered.length} routes, synced ${result.synced}, failed ${result.failed}.`,
      ...result,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/requireAuth";
import { getSiteForUser } from "@/lib/getSiteForUser";

import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Layout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const user = await requireAuth();

  if (!user) {
    redirect("/admin/login");
  }

  // Marketing users cannot access admin pages
  if (user.globalRole === "MARKETING" || user.role === "marketing") {
    redirect("/crm");
  }

  // Visitor users cannot access admin pages
  if (user.globalRole === "VISITOR" || user.role === "visitor") {
    redirect("/quizzes");
  }

  const siteId = "ebh";
  const sites = [{ id: "ebh", name: "Earth By Humans" }];

  return (
    <DashboardLayout siteId={siteId} sites={sites}>
      {children}
    </DashboardLayout>
  );
}


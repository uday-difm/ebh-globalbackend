import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/requireAuth";
import { getSiteForUser } from "@/lib/getSiteForUser";

export const dynamic = "force-dynamic";

export default async function Layout({ children }) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  // Visitors cannot access crm pages
  if (user.globalRole === "VISITOR" || user.role === "visitor") {
    redirect("/quizzes");
  }

  const site = await getSiteForUser(user);
  const siteId = site ? site.id : null;

  const connectedSiteId = process.env.NEXT_PUBLIC_SITE_ID || process.env.SITE_ID || "infinium";
  let sites = [];
  const connectedSite = await prisma.site.findUnique({
    where: { id: connectedSiteId, deletedAt: null },
    select: { id: true, name: true }
  });
  if (connectedSite) {
    sites = [connectedSite];
  }

  return (
    <DashboardLayout siteId={siteId} sites={sites}>
      {children}
    </DashboardLayout>
  );
}

import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cookie Policy | Earth by Humans",
  description: "Learn how we use cookies and tracking technologies to improve your experience.",
};

export default async function CookiePolicyPage() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

  const dbPage = await prisma.legalPage.findUnique({
    where: {
      siteId_type: {
        siteId,
        type: "cookies"
      }
    }
  });

  if (dbPage && dbPage.published && !dbPage.deletedAt) {
    return (
      <>
        <title>{dbPage.title} | Earth by Humans</title>
        <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
        <div className="page-shell text-justify py-16 px-4 max-w-[1000px] mx-auto text-black">
          <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
            {dbPage.title}
          </h2>
          <div 
            className="prose max-w-none text-gray-800 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: dbPage.content }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <title>Cookie Policy | Earth by Humans Tracker Disclosures</title>
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div className="page-shell text-justify py-16 px-4 max-w-[1000px] mx-auto text-black">
        <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
          Cookie Policy
        </h2>
        <h3 className="text-2xl font-semibold mb-2">What Are Cookies</h3>
        <p className="mb-4 text-justify">
          Cookies are small text files stored on your device when you visit websites. They help us remember your preferences, keep you logged in, and analyze website performance to deliver a faster, personalized browsing experience.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How We Use Cookies</h3>
        <p className="mb-4 text-justify">
          We use strictly necessary cookies to run core functions of the website, preference cookies to save your settings, and marketing/analytics cookies (such as Google Analytics) to understand visitor traffic trends. You can adjust your consent options through our cookies banner at any time.
        </p>
      </div>
    </>
  );
}

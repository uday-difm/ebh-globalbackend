import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Disclaimer | Earth by Humans",
  description: "Read the disclaimer regarding content accuracy and liability limitations.",
};

export default async function DisclaimerPage() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

  const dbPage = await prisma.legalPage.findUnique({
    where: {
      siteId_type: {
        siteId,
        type: "disclaimer"
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
      <title>Disclaimer | Earth by Humans Liability Limits</title>
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div className="page-shell text-justify py-16 px-4 max-w-[1000px] mx-auto text-black">
        <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
          Disclaimer
        </h2>
        <h3 className="text-2xl font-semibold mb-2">Content Accuracy</h3>
        <p className="mb-4 text-justify">
          The information provided on this platform is for general informational and educational purposes only. While we strive to maintain accurate and up-to-date content, we make no representations or warranties of any kind regarding completeness, reliability, or availability.
        </p>
        <h3 className="text-2xl font-semibold mb-2">No Professional Advice</h3>
        <p className="mb-4 text-justify">
          Any health, environmental, or sustainability practices referenced here should not be taken as professional advice. Any reliance you place on such information is strictly at your own risk.
        </p>
      </div>
    </>
  );
}

import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Refund Policy | Earth by Humans",
  description: "Read our transaction, cancellation, and refund terms.",
};

export default async function RefundPolicyPage() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

  const dbPage = await prisma.legalPage.findUnique({
    where: {
      siteId_type: {
        siteId,
        type: "refund"
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
      <title>Refund Policy | Earth by Humans Transactions</title>
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div className="page-shell text-justify py-16 px-4 max-w-[1000px] mx-auto text-black">
        <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
          Refund Policy
        </h2>
        <h3 className="text-2xl font-semibold mb-2">Digital Subscriptions</h3>
        <p className="mb-4 text-justify">
          Due to the instant accessibility of digital magazine issues and subscription content, all purchases for online digital editions are generally non-refundable. You can cancel your subscription renewal at any time through your dashboard settings.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Printed Editions</h3>
        <p className="mb-4 text-justify">
          If you purchased a physical copy of our magazine through third-party distributors (e.g. MagCloud), please refer directly to the returns and refund policies of that specific merchant.
        </p>
      </div>
    </>
  );
}

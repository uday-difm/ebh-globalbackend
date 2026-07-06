import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Helper to normalize route param to database policy type
function normalizeType(type) {
  const t = type.toLowerCase();
  if (t === "privacy" || t === "privacy-policy") return "privacy";
  if (t === "terms" || t === "terms-of-service" || t === "terms-and-conditions") return "terms";
  if (t === "cookies" || t === "cookie-policy") return "cookies";
  if (t === "disclaimer") return "disclaimer";
  if (t === "refund" || t === "refund-policy") return "refund";
  if (t === "information" || t === "information-policy") return "information-policy";
  return null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const normalized = normalizeType(resolvedParams.type);
  if (!normalized) return { title: "Legal Policy" };

  const labels = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    disclaimer: "Disclaimer",
    refund: "Refund Policy",
    "information-policy": "Information Policy"
  };

  return {
    title: `${labels[normalized]} | Earth by Humans`,
    description: `Read the official ${labels[normalized]} for the Earth by Humans platform.`
  };
}

export default async function LegalPage({ params }) {
  const resolvedParams = await params;
  const normalized = normalizeType(resolvedParams.type);
  
  if (!normalized) {
    notFound();
  }

  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

  const dbPage = await prisma.legalPage.findUnique({
    where: {
      siteId_type: {
        siteId,
        type: normalized
      }
    }
  });

  // Render dynamic content from database if published
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

  // Fallbacks if database content is not yet published
  return (
    <>
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div className="page-shell text-justify py-16 px-4 max-w-[1000px] mx-auto text-black">
        {normalized === "privacy" && (
          <>
            <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
              Privacy Policy
            </h2>
            <h3 className="text-2xl font-semibold mb-2">Introduction</h3>
            <p className="mb-4 text-justify">
              Welcome to "Earth by Humans," owned by DO IT FOR ME LLC. We respect your privacy and protect your personal information. By visiting our website, you accept the practices described in this Policy.
            </p>
            <h3 className="text-2xl font-semibold mb-2">Information Collection</h3>
            <p className="mb-4 text-justify">
              We collect personal information that you voluntarily provide when you register, subscribe, or interact with our site, alongside automatic session cookies.
            </p>
          </>
        )}

        {normalized === "terms" && (
          <>
            <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
              Terms of Service
            </h2>
            <h3 className="text-2xl font-semibold mb-2">Acceptance of Terms</h3>
            <p className="mb-4 text-justify">
              By accessing and using the "Earth by Humans" platform, owned by DO IT FOR ME LLC, you agree to comply with and be bound by these Terms of Use.
            </p>
            <h3 className="text-2xl font-semibold mb-2">Intellectual Property</h3>
            <p className="mb-4 text-justify">
              All content on this platform is protected by copyright and other intellectual property laws. Unauthorized use or reproduction is prohibited.
            </p>
          </>
        )}

        {normalized === "cookies" && (
          <>
            <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
              Cookie Policy
            </h2>
            <h3 className="text-2xl font-semibold mb-2">What Are Cookies</h3>
            <p className="mb-4 text-justify">
              Cookies are small text files stored on your device when you visit websites. They help us remember your preferences, keep you logged in, and analyze website performance.
            </p>
          </>
        )}

        {normalized === "disclaimer" && (
          <>
            <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
              Disclaimer
            </h2>
            <h3 className="text-2xl font-semibold mb-2">Content Accuracy</h3>
            <p className="mb-4 text-justify">
              The information provided on this platform is for general informational and educational purposes only. We make no representations or warranties of any kind regarding completeness or reliability.
            </p>
          </>
        )}

        {normalized === "refund" && (
          <>
            <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
              Refund Policy
            </h2>
            <h3 className="text-2xl font-semibold mb-2">Digital Subscriptions</h3>
            <p className="mb-4 text-justify">
              Due to the instant accessibility of digital magazine issues and subscription content, all purchases for online digital editions are non-refundable.
            </p>
          </>
        )}

        {normalized === "information-policy" && (
          <>
            <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium mt-4 sm:mt-2">
              Information Policy
            </h2>
            <h3 className="text-2xl font-semibold mb-2">
              Introduction and Commitment to Authenticity
            </h3>
            <p className="mb-4 text-justify">
              At "Earth by Humans," a proprietary digital information platform (D.I.P.) owned by DO IT FOR ME LLC, we are dedicated to providing our readers with accurate, timely, and relevant information. We understand the importance of factual accuracy in the digital age and are committed to upholding the highest standards of journalistic integrity. This Information Policy outlines our commitment to delivering content while ensuring the integrity and credibility of the information.
            </p>
            <h3 className="text-2xl font-semibold mb-2">
              Source of Information and Verification
            </h3>
            <div className="p-4">
              <ul className="list-decimal space-y-2 pl-5">
                <li>
                  <span className="text-md font-semibold">Expert Contributions:</span>{" "}
                  Our articles and content are often contributed by experts in various fields, ensuring that the information is both accurate and current.
                </li>
                <li>
                  <span className="text-md font-semibold">Research and Studies:</span>{" "}
                  We frequently reference scientific studies, research papers, and other credible sources to back our claims and provide a comprehensive view of the topic at hand.
                </li>
                <li>
                  <span className="text-md font-semibold">Fact-Checking:</span> Every piece of information on our platform undergoes rigorous fact-checking. We have a dedicated team that ensures the authenticity and accuracy of the data we present.
                </li>
              </ul>
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              Transparency in Reporting and Continuous Review
            </h3>
            <p className="mb-4 text-justify">
              We believe in transparent reporting. Any updates, corrections, or retractions to our content will be clearly indicated, ensuring our readers are always accessing the most current and accurate version of the story. The world of science and nature is ever-evolving. As such, our team regularly reviews our content to ensure it remains up-to-date with the latest research and developments.
            </p>
            <h3 className="text-2xl font-semibold mb-2">
              User Contributions and Feedback
            </h3>
            <div className="p-4">
              <ul className="list-decimal space-y-2 pl-5">
                <li>
                  <span className="text-md font-semibold">Moderation:</span> Comments, reviews, and other user-generated content are moderated to maintain the quality and credibility of discussions on our platform.
                </li>
                <li>
                  <span className="text-md font-semibold">Source Requirement:</span>{" "}
                  Users are encouraged to provide sources when sharing new information or disputing a fact. This ensures the conversation remains evidence-based and constructive.
                </li>
                <li>
                  <span className="text-md font-semibold">Corrections:</span> While we strive for perfection, errors can occur. We are open to suggestions and feedback regarding any facts or information that may need correction. If inaccuracies are identified in any of our content, or if you believe certain information needs updating, we commit to making corrections in a timely manner. When providing feedback, please also share the source of the correct information for our reference.
                </li>
              </ul>
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              Data Use, Sharing, and Personal Information
            </h3>
            <p className="mb-4 text-justify">
              While we gather data to enhance user experience, as outlined in our Privacy Policy, we are committed to ensuring this data is used responsibly. We do not manipulate data to mislead or misinform. Furthermore, while we may share insights or trends based on user data, individual user data is always kept confidential and will not be used without explicit consent, except for the purposes mentioned in the Privacy Policy.
            </p>
            <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
            <p className="text-justify">
              For any queries, suggestions, or feedback regarding our information policy or any content on our platform, please get in touch through our "Contact Us" page.
            </p>
          </>
        )}
      </div>
    </>
  );
}

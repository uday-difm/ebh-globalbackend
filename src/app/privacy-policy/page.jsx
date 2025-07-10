import React from "react";

export const metadata = {
  title: "Privacy Policy | Earth by Humans",
  description: "Our Privacy Policy outlines how we collect, use, and safeguard your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-2 text-justify">
      <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium">
        Privacy Policy
      </h2>
      <h3 className="text-2xl font-semibold mb-2">Introduction</h3>
      <p className="mb-4 text-p text-justify">
        Welcome to "Earth by Humans," a proprietary digital information platform
        (D.I.P.) owned by DO IT FOR ME LLC. We respect your privacy and want to
        protect your personal information. This Privacy Policy outlines how we
        collect, use, and safeguard your personal information. By visiting our
        website, you accept the practices described in this Policy.
      </p>
      <h3 className="text-2xl font-semibold mb-2">Information Collection</h3>
      <div className="p-4">
        <ul className="list-decimal space-y-2 pl-5">
          <li>
            <span className="text-md font-semibold">
              Voluntary Information:
            </span>{" "}
            We collect personal information that you provide when you register,
            subscribe to our magazine, or participate in any interactive
            features on our site.
          </li>
          <li>
            <span className="text-md font-semibold">
              Automatic Information:
            </span>{" "}
            We receive and store certain types of information whenever you
            interact with our website or services. Like many websites, we use
            "cookies" to enhance your experience and gather information about
            visitors.
          </li>
        </ul>
      </div>
      <h3 className="text-2xl font-semibold mb-2">Use of Information</h3>
      <div className="p-4">
        <ul className="list-decimal space-y-2 pl-5">
          <li>
            <span className="text-md font-semibold">
              To Personalize Your Experience:
            </span>{" "}
            Your information helps us better respond to your individual needs.
          </li>
          <li>
            <span className="text-md font-semibold">
              To Improve Our Website:
            </span>{" "}
            We continually strive to improve our website based on the
            information and feedback we receive from you.
          </li>
          <li>
            <span className="text-md font-semibold">
              To Process Transactions:
            </span>{" "}
            Your information, whether public or private, will not be sold,
            exchanged, transferred, or given to any other company for any reason
            whatsoever, without your consent, other than for the express purpose
            of delivering the purchased product or service requested or to share
            information about other services or information provided by third
            parties.
          </li>
        </ul>
      </div>
      <h3 className="text-2xl font-semibold mb-2">Protection of Information</h3>
      <p className="mb-4">
        We implement a variety of security measures to maintain the safety of
        your personal information when you access your personal information.
      </p>
      <h3 className="text-2xl font-semibold mb-2">Cookies</h3>
      <p className="mb-4">
        Cookies are small files that a site transfers to your computer’s hard
        drive through your web browser (if you allow) that enables the site to
        recognize your browser and capture certain information. We use cookies
        to understand and save your preferences for future visits.
      </p>
      <h3 className="text-2xl font-semibold mb-2">
        Disclosure to Third Parties
      </h3>
      <p className="mb-4">
        We do not sell, trade, or transfer your personally identifiable
        information to external third parties. However, we may share your
        information with trusted third parties who assist us in operating our
        website, conducting our business, or servicing you, so long as those

        parties agree to keep this information confidential. This includes
        sharing information about other services or information provided by
        third parties.
      </p>
      <h3 className="text-2xl font-semibold mb-2">Opting Out</h3>
      <p className="mb-4">
        If at any time you would like to
        unsubscribe from receiving future emails, detailed unsubscribe
        instructions are included at the bottom of each email.
      </p>
      <h3 className="text-2xl font-semibold mb-2">
        Changes to Our Privacy Policy
      </h3>
      <p className="mb-4">
        If we decide to change our privacy policy, we will post those changes on
        this page, and update the Privacy Policy modification date.
      </p>
      <h3 className="text-2xl font-semibold mb-2">Contacting Us</h3>
      <p>
        If you have any questions regarding this privacy policy, you can contact
        us using the information provided on our “Contact Us” page.
      </p>
    </div>
  );
}
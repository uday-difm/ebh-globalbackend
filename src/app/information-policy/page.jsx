import React from "react";

export const metadata = {
  title: "Information Policy | Earth by Humans",
  description: "Our commitment to providing accurate, timely, and relevant information.",
};

export default function InformationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-2 text-justify">
      <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium">
        Information Policy
      </h2>
      <h3 className="text-2xl font-semibold mb-2">
        Introduction and Commitment to Authenticity
      </h3>
      <p className="mb-4 text-p text-justify">
        At "Earth by Humans," a proprietary digital information platform
        (D.I.P.) owned by DO IT FOR ME LLC, we are dedicated to providing our
        readers with accurate, timely, and relevant information. We understand
        the importance of factual accuracy in the digital age and are committed
        to upholding the highest standards of journalistic integrity. This
        Information Policy outlines our commitment to delivering content while
        ensuring the integrity and credibility of the information.
      </p>
      <h3 className="text-2xl font-semibold mb-2">
        Source of Information and Verification
      </h3>
      <div className="p-4">
        <ul className="list-decimal space-y-2 pl-5">
          <li>
            <span className="text-md font-semibold">Expert Contributions:</span>{" "}
            Our articles and content are often contributed by experts in various
            fields, ensuring that the information is both accurate and current.
          </li>
          <li>
            <span className="text-md font-semibold">Research and Studies:</span>{" "}
            We frequently reference scientific studies, research papers, and
            other credible sources to back our claims and provide a
            comprehensive view of the topic at hand.
          </li>
          <li>
            <span className="text-md font-semibold">Fact-Checking:</span> Every
            piece of information on our platform undergoes rigorous
            fact-checking. We have a dedicated team that ensures the
            authenticity and accuracy of the data we present.
          </li>
        </ul>
      </div>
      <h3 className="text-2xl font-semibold mb-2">
        Transparency in Reporting and Continuous Review
      </h3>
      <p className="mb-4">
        We believe in transparent reporting. Any updates, corrections, or
        retractions to our content will be clearly indicated, ensuring our
        readers are always accessing the most current and accurate version of
        the story. The world of science and nature is ever-evolving. As such,
        our team regularly reviews our content to ensure it remains up-to-date
        with the latest research and developments.
      </p>
      <h3 className="text-2xl font-semibold mb-2">
        User Contributions and Feedback
      </h3>
      <div className="p-4">
        <ul className="list-decimal space-y-2 pl-5">
          <li>
            <span className="text-md font-semibold">Moderation:</span> Comments,
            reviews, and other user-generated content are moderated to maintain
            the quality and credibility of discussions on our platform.
          </li>
          <li>
            <span className="text-md font-semibold">Source Requirement:</span>{" "}
            Users are encouraged to provide sources when sharing new information
            or disputing a fact. This ensures the conversation remains
            evidence-based and constructive.
          </li>
          <li>
            <span className="text-md font-semibold">Corrections:</span> While we
            strive for perfection, errors can occur. We are open to suggestions
            and feedback regarding any facts or information that may need
            correction. If inaccuracies are identified in any of our content, or
            if you believe certain information needs updating, we commit to
            making corrections in a timely manner. When providing feedback,
            please also share the source of the correct information for our
            reference.
          </li>
        </ul>
      </div>
      <h3 className="text-2xl font-semibold mb-2">
        Data Use, Sharing, and Personal Information
      </h3>
      <p className="mb-4">
        While we gather data to enhance user experience, as outlined in our
        Privacy Policy, we are committed to ensuring this data is used
        responsibly. We do not manipulate data to mislead or misinform.
        Furthermore, while we may share insights or trends based on user data,
        individual user data is always kept confidential and will not be used

        without explicit consent, except for the purposes mentioned in the
        Privacy Policy.
      </p>
      <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
      <p>
        For any queries, suggestions, or feedback regarding our information
        policy or any content on our platform, please get in touch through our
        "Contact Us"page.
      </p>
    </div>
  );
}
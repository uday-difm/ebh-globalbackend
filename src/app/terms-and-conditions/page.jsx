import React from 'react';

// Next.js metadata for SEO
export const metadata = {
  title: "Terms of Use | Earth by Humans",
  description: "Read the terms of use for the Earth by Humans platform.",
};

export default function TermsOfUsePage() {
    return (
        <div className="max-w-4xl mx-auto px-5 py-2 text-justify">
          <h2 className="text-[30px] lg:text-[55px] py-6 text-green-600 text-center font-medium">
            Terms of Use
          </h2>
          <h3 className="text-2xl font-semibold mb-2">Acceptance of Terms</h3>
          <p className="mb-4 text-p text-justify">
            By accessing and using the "Earth by Humans" proprietary digital information platform (D.I.P.), owned by DO IT FOR ME LLC, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.
          </p>
          <h3 className="text-2xl font-semibold mb-2">Intellectual Property</h3>
          <p className='mb-4'>All content, including but not limited to articles, images, videos, and graphics, on this platform is protected by copyright and other intellectual property laws. Unauthorized use or reproduction of the content is strictly prohibited without prior written consent from DO IT FOR ME LLC.</p>
    
          <h3 className="text-2xl font-semibold mb-2">User Conduct</h3>
          <p className="mb-4">
            Users are expected to engage with our platform in a respectful and constructive manner. Any form of harassment, spamming, or dissemination of false information will result in immediate suspension or banning from our platform.
          </p>
          <h3 className="text-2xl font-semibold mb-2">Limitation of Liability</h3>
          <p className="mb-4">
            While we strive to provide accurate and up-to-date information, "Earth by Humans" and DO IT FOR ME LLC shall not be held liable for any inaccuracies, errors, or omissions in the content, or any actions taken based on the content provided.
          </p>
          <h3 className="text-2xl font-semibold mb-2">
            External Links
          </h3>
          <p className="mb-4">
            Our platform may contain links to external websites. These links are provided for convenience and reference only. "Earth by Humans" does not endorse, and is not responsible for, the content or practices of these external websites.
          </p>
    
          <h3 className="text-2xl font-semibold mb-2">Changes to Terms of Use</h3>
          <p className="mb-4">
            We reserve the right to modify or update these Terms of Use at any time without prior notice. It is the user's responsibility to review these terms periodically to stay informed.
          </p>
    
          <h3 className="text-2xl font-semibold mb-2">
            Governing Law
          </h3>
          <p className="mb-4">
            These Terms of Use shall be governed by and construed in accordance with the laws of "the United States".
          </p>
    
          <h3 className="text-2xl font-semibold mb-2">Contact</h3>
          <p>
            For any questions or concerns regarding these Terms of Use, please contact us through our "Contact Us" page.
          </p>
        </div>
    );
}
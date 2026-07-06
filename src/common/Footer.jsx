'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Mail } from 'lucide-react';
import Button from './Button';
import ScrollToTopLink from './ScrollToTopLink';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [footerConfig, setFooterConfig] = useState(null);
  const [dynamicCompanyLinks, setDynamicCompanyLinks] = useState(null);

  React.useEffect(() => {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";

    async function fetchFooterData() {
      try {
        const res = await fetch(`/api/footer?siteId=${siteId}`);
        if (res.ok) {
          const json = await res.json();
          const footerData = json.data?.footer || json.footer;
          if (footerData) {
            setFooterConfig(footerData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch footer config:", err);
      }

      try {
        const navRes = await fetch(`/api/navigation/footer?siteId=${siteId}`);
        if (navRes.ok) {
          const json = await navRes.json();
          const items = json.data?.items || json.items;
          if (Array.isArray(items) && items.length > 0) {
            const mapped = items.map((item) => ({
              label: item.label,
              href: item.url || item.href || "/",
            }));
            setDynamicCompanyLinks(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch footer navigation links:", err);
      }
    }

    fetchFooterData();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('Subscribing...');

    if (!email) {
      setMessage('Email is required.');
      return;
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      setMessage(result.message || 'Subscribed successfully');

      if (res.ok) {
        setEmail('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const defaultCompanyLinks = [
    { href: "/blogs", label: "Blogs" },
    { href: "/about-us", label: "About Us" },
    { href: "/magazine", label: "Magazines" },
    { href: "/quizzes", label: "Quizzes" },
    { href: "/contact-us", label: "Contact Us" }
  ];

  const defaultLegalLinks = [
    { href: "/terms-and-conditions", label: "Terms of Conditions" },
    { href: "/information-policy", label: "Information Policy" },
    { href: "/privacy-policy", label: "Privacy Policy" }
  ];

  const logoSrc = footerConfig?.logo || "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif";
  const description = footerConfig?.description || "Earth by Humans, your online sanctuary for exploring the wonders of our planet and beyond. Immerse yourself in captivating nature posts, inspiring stories, and thought-provoking content that celebrates the beauty of Earth along with fun Quizzes.";
  const issnLink = footerConfig?.issn_link || "https://portal.issn.org/resource/ISSN/3066-5027";
  const issnImage = footerConfig?.issn_image || "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-ISSN.jpg";
  
  const companyLinks = dynamicCompanyLinks || footerConfig?.company_links || defaultCompanyLinks;
  const legalLinks = footerConfig?.legal_links || defaultLegalLinks;
  const contactEmail = footerConfig?.contact_email || "info@earthbyhumans.com";
  
  const socialLinks = {
    linkedin: footerConfig?.social_links?.linkedin || "https://www.linkedin.com/company/earth-by-humans/",
    instagram: footerConfig?.social_links?.instagram || "https://www.instagram.com/earth_by_humans/",
    facebook: footerConfig?.social_links?.facebook || "https://www.facebook.com/earthbyhumans",
    youtube: footerConfig?.social_links?.youtube || "https://www.youtube.com/@EarthByHumans",
    twitter: footerConfig?.social_links?.twitter || "https://twitter.com/earthbyhumans"
  };

  const copyrightText = footerConfig?.copyright 
    ? `© ${new Date().getFullYear()} ${footerConfig.copyright}. All Rights Reserved.`
    : `© ${new Date().getFullYear()} Earth By Humans (A Brand Concept Within The DO IT FOR ME LLC ECOSYSTEM). All Rights Reserved.`;

  return (
    <footer
      className="w-full bg-white min-h-[550px] text-black pt-16 border-t border-gray-300"
      style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}
    >
      <div className="max-w-[1350px] mx-auto ">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 pb-8">
          {/* Logo & Description */}
          <div>
            <Link href="/">
              <Image
                src={logoSrc}
                alt="Earth by Humans Logo"
                width={172}     
                height={74}
                className="w-[172px] h-[74px] object-contain"
                loading='lazy'
              />
            </Link>

            <p className="text-sm text-gray-700 mb-4 text-justify hyphens-auto">
              {description}
            </p>
          </div>

          {/* ISSN */}
          <div>
            <Link href={issnLink} target="_blank">
              <Image
                src={issnImage}
                alt="ISSN Barcode"
                width={500}
                height={600}
                className="w-[80%] object-contain"
                loading="lazy"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                {companyLinks.map((link, idx) => (
                  <li key={idx}>
                    <ScrollToTopLink href={link.href} className="hover:text-green-600">
                      {link.label}
                    </ScrollToTopLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <Link href={socialLinks.linkedin} target="_blank" aria-label="LinkedIn">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition-all duration-300 hover:bg-green-700">
                    <Linkedin className="h-4 w-4" />
                  </span>
                </Link>
                <Link href={socialLinks.instagram} target="_blank" aria-label="Instagram">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-300 hover:bg-sky-600">
                    <Instagram className="h-4 w-4" />
                  </span>
                </Link>
                <Link href={socialLinks.facebook} target="_blank" aria-label="Facebook">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700">
                    <Facebook className="h-4 w-4" />
                  </span>
                </Link>
                <Link href={socialLinks.youtube} target="_blank" aria-label="YouTube">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white transition-all duration-300 hover:bg-gray-600">
                    <Youtube className="h-4 w-4" />
                  </span>
                </Link>
                <Link href={socialLinks.twitter} target="_blank" aria-label="Twitter">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-300 hover:bg-sky-600">
                    <Twitter className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-semibold mb-2"> Connect</h4>
            <p className="font-semibold mb-2">Send us an email at</p>
            <p className="text-sm flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-green-600" /> {contactEmail}
            </p>

            <form onSubmit={handleSubscribe} className="mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 mb-2 text-sm bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                type="submit"
                className="w-[145px] h-[45px] text-center item-center justify-center flex"
                bgColor="bg-green-600"
                animatedColor1="bg-blue-700"
                animatedColor2="bg-blue-700"
              >
                Subscribe
              </Button>
              {message && <p className="text-green-600 mt-2 text-sm">{message}</p>}
            </form>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600 px-4">
          <p className="text-center md:text-left mb-4 md:mb-0">
            {copyrightText}
          </p>
          <div className="flex justify-center md:justify-end gap-4">
            {legalLinks.map((link, idx) => (
              <ScrollToTopLink key={idx} href={link.href} className="hover:text-green-600">
                {link.label}
              </ScrollToTopLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

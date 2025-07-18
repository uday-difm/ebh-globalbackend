'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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

  return (
    <footer className="w-full bg-white pb-[2%] pt-[2%] text-black">
      <div className="max-w-[1350px] mx-auto px-4">
        <div className="pt-[60px] px-[50px] pb-[40px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 justify-between">
            {/* Logo & Description */}
            <div className="max-w-[400px]">
              <Link href="/">
                <img
                  src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
                  alt="Earth by Humans Logo"
                  className="h-20 object-contain cursor-pointer"
                />
              </Link>
              <p className="mt-6 text-justify text-sm">
                Earth by Humans, your online sanctuary for exploring the wonders of our planet and beyond...
              </p>
            </div>

            {/* ISSN Barcode */}
            <div>
              <Link href="https://portal.issn.org/resource/ISSN/3066-5027" target="_blank">
                <img
                  src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-ISSN.jpg"
                  alt="ISSN Barcode"
                  className="w-[80%] object-contain"
                />
              </Link>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-10 justify-between">
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="text-sm space-y-1">
                  <li><Link href="/blogs" className="hover:text-green-600">Blogs</Link></li>
                  <li><Link href="/about-us" className="hover:text-green-600">About Us</Link></li>
                  <li><Link href="/magazine" className="hover:text-green-600">Magazines</Link></li>
                  <li><Link href="/quizzes" className="hover:text-green-600">Quizzes</Link></li>
                  <li><Link href="/contact-us" className="hover:text-green-600">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Social Media</h4>
                <ul className="text-sm space-y-1">
                  <li><Link href="https://www.linkedin.com/company/earth-by-humans/" target="_blank" className="hover:text-green-600">LinkedIn</Link></li>
                  <li><Link href="https://www.instagram.com/earth_by_humans/" target="_blank" className="hover:text-green-600">Instagram</Link></li>
                  <li><Link href="https://www.facebook.com/earthbyhumans" target="_blank" className="hover:text-green-600">Facebook</Link></li>
                  <li><Link href="https://www.youtube.com/@EarthByHumans" target="_blank" className="hover:text-green-600">YouTube</Link></li>
                  <li><Link href="https://twitter.com/earthbyhumans" target="_blank" className="hover:text-green-600">Twitter</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact & Subscription */}
            <div>
              <h4 className="font-medium mb-2">Contact</h4>
              <p className="text-sm">Send us an email at</p>
              <Link href="mailto:info@earthbyhumans.com" className="text-green-600 hover:underline text-sm">
                info@earthbyhumans.com
              </Link>

              <div className="mt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 mb-4 text-sm bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />

                <div
                  className="relative group max-w-[130px] overflow-hidden rounded-full cursor-pointer"
                  onClick={handleSubscribe}
                >
                  {/* Base */}
                  <div className="absolute inset-0 bg-green-500 rounded-full transition-opacity duration-500 group-hover:opacity-80 z-0"></div>

                  {/* Blue animation */}
                  <div className="absolute w-[100px] h-[200px] bg-blue-700 rotate-[35deg] top-[-245%] left-[-90%] group-hover:left-0 z-10 transition-all duration-600 ease-in-out"></div>
                  <div className="absolute w-[200px] h-[90px] bg-blue-700 rotate-[125deg] top-[-15%] left-[100%] group-hover:left-[20%] z-10 transition-all duration-600 ease-in-out"></div>

                  {/* Button Text */}
                  <button className="relative z-20 w-[130px] text-white py-2 px-6 text-sm rounded-full transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {message && <p className="text-green-600 mt-2 text-sm">{message}</p>}
            </div>
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600">
          <p className="text-center md:text-left">
            © 2025 Created by <Link href="https://difm.llc" target="_blank" className="hover:text-green-600">Do It For Me LLC</Link> All Rights Reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <Link href="/terms-and-conditions" className="hover:text-green-600">Terms of Use</Link>
            <Link href="/information-policy" className="hover:text-green-600">Information Policy</Link>
            <Link href="/privacy-policy" className="hover:text-green-600">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

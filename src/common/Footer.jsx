'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { HiArrowRight } from 'react-icons/hi';
import Button from './Button'; // ✅ Import the reusable Button component
import ScrollToTopLink from './ScrollToTopLink'; // ✅ Import the ScrollToTopLink component

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
    <footer
      className="w-full bg-white min-h-[550px] text-black pt-16"
      style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}
    >
      <div className="max-w-[1350px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 pb-8">
          {/* Logo & Description */}
          <div>
            <ScrollToTopLink href="/">
              <img
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
                alt="Earth by Humans Logo"
                className="h-20 object-contain cursor-pointer"
              />
            </ScrollToTopLink>
            <p className="mt-6 text-sm text-gray-700 text-justify">
              Earth by Humans, your online sanctuary for exploring the wonders of our planet and beyond. Immerse yourself in captivating nature posts, inspiring stories,
              and thought-provoking content that celebrates the beauty of Earth along with fun Quizzes.
            </p>
          </div>

          {/* ISSN */}
          <div>
            <Link href="https://portal.issn.org/resource/ISSN/3066-5027" target="_blank">
              <img
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-ISSN.jpg"
                alt="ISSN Barcode"
                className="w-[80%] object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li><ScrollToTopLink href="/blogs" className="hover:text-green-600">Blogs</ScrollToTopLink></li>
                <li><ScrollToTopLink href="/about-us" className="hover:text-green-600">About Us</ScrollToTopLink></li>
                <li><ScrollToTopLink href="/magazine" className="hover:text-green-600">Magazines</ScrollToTopLink></li>
                <li><ScrollToTopLink href="/quizzes" className="hover:text-green-600">Quizzes</ScrollToTopLink></li>
                <li><ScrollToTopLink href="/contact-us" className="hover:text-green-600">Contact Us</ScrollToTopLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <Link href="https://www.linkedin.com/company/earth-by-humans/" target="_blank" aria-label="LinkedIn">
                  <FaLinkedinIn className="text-white bg-green-600 p-3 rounded-full w-10 h-10 hover:bg-green-700 transition-all duration-300" />
                </Link>
                <Link href="https://www.instagram.com/earth_by_humans/" target="_blank" aria-label="Instagram">
                  <FaInstagram className="text-white bg-sky-500 p-3 rounded-full w-10 h-10 hover:bg-sky-600 transition-all duration-300" />
                </Link>
                <Link href="https://www.facebook.com/earthbyhumans" target="_blank" aria-label="Facebook">
                  <FaFacebookF className="text-white bg-blue-600 p-3 rounded-full w-10 h-10 hover:bg-blue-700 transition-all duration-300" />
                </Link>
                <Link href="https://www.youtube.com/@EarthByHumans" target="_blank" aria-label="YouTube">
                  <FaYoutube className="text-white bg-gray-500 p-3 rounded-full w-10 h-10 hover:bg-gray-600 transition-all duration-300" />
                </Link>
                <Link href="https://twitter.com/earthbyhumans" target="_blank" aria-label="Twitter">
                  <FaTwitter className="text-white bg-sky-500 p-3 rounded-full w-10 h-10 hover:bg-sky-600 transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-semibold mb-2"> Connect</h4>
            <p className="font-semibold mb-2">Send us an email at</p>
            <p className="text-sm flex items-center gap-2 text-gray-700">
              <MdEmail className="text-green-600" /> info@earthbyhumans.com
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
            © 2025 Earth By Humans <Link href="https://difm.llc" target="_blank" className="hover:text-green-600">(A Brand Concept Within The DO IT FOR ME LLC ECOSYSTEM)</Link>. All Rights Reserved.
          </p>
          <div className="flex justify-center md:justify-end gap-4">
            <ScrollToTopLink href="/terms-and-conditions" className="hover:text-green-600">Terms of Use</ScrollToTopLink>
            <ScrollToTopLink href="/information-policy" className="hover:text-green-600">Information Policy</ScrollToTopLink>
            <ScrollToTopLink href="/privacy-policy" className="hover:text-green-600">Privacy Policy</ScrollToTopLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
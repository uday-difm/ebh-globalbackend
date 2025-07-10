"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

// Define your server URL here
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://your-default-server-url.com";


const Footer = () => {
  const [email, setEmail] = useState("");
  const [thankyou, setThankyou] = useState<string | undefined>(undefined);

  const handleSubscribe = async () => {
    if (email) {
      try {
        const res = await axios.post(`${serverUrl}/contact/subscribe`, { email });
        if (res.status === 200) {
          setThankyou((res.data as { message?: string })?.message);
          setEmail("");
        }
      } catch (err) {
        setThankyou(err?.response?.data?.message || "Subscription failed.");
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Email is required.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white pb-[2%] pt-[2%] text-black">
      <div className="max-w-[1350px] mx-auto px-4">
        <div className="pt-[60px] px-[50px] pb-[40px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 justify-between ">
            {/* Logo & Description */}
            <div className="max-w-[400px]">
              <Link href="/">
                <img
                  src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
                  alt="Earth by Humans Logo"
                  className="h-20 object-contain"
                />
              </Link>
              <p className="mt-6 text-justify text-sm">
                Earth by Humans, your online sanctuary for exploring the wonders of our planet and beyond. Immerse
                yourself in captivating nature posts, inspiring stories, and thought-provoking content that celebrates
                the beauty of Earth along with fun Quizzes.
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

            {/* Company & Social Links */}
            <div className="flex flex-wrap gap-10 justify-between">
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="text-sm space-y-1">
                  <li><Link href="/blogs" className="hover:text-green-600 transition">Blogs</Link></li>
                  <li><Link href="/about-us" className="hover:text-green-600 transition">About Us</Link></li>
                  <li><Link href="/magazine" className="hover:text-green-600 transition">Magazines</Link></li>
                  <li><Link href="/quizzes" className="hover:text-green-600 transition">Quizzes</Link></li>
                  <li><Link href="/contact-us" className="hover:text-green-600 transition">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Social Media</h4>
                <ul className="text-sm space-y-1">
                  <li><Link href="https://www.linkedin.com/company/earth-by-humans/" target="_blank" className="hover:text-green-600 transition">LinkedIn</Link></li>
                  <li><Link href="https://www.instagram.com/earth_by_humans/" target="_blank" className="hover:text-green-600 transition">Instagram</Link></li>
                  <li><Link href="https://www.facebook.com/earthbyhumans" target="_blank" className="hover:text-green-600 transition">Facebook</Link></li>
                  <li><Link href="https://www.youtube.com/@EarthByHumans" target="_blank" className="hover:text-green-600 transition">Youtube</Link></li>
                  <li><Link href="https://twitter.com/earthbyhumans" target="_blank" className="hover:text-green-600 transition">Twitter</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact & Subscribe */}
            <div>
              <h4 className="font-medium mb-2">Contact</h4>
              <p className="text-sm">Send us an email at</p>
              <Link href="mailto:info@earthbyhumans.com" className="text-sm text-green-600 hover:underline block mb-2">
                info@earthbyhumans.com
              </Link>
              <div className="flecx flex-col items-center mt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3 py-2 mb-8 text-sm bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div
                  className="relative group max-w-[130px] overflow-hidden rounded-full cursor-pointer"
                  onClick={handleSubscribe}
                >
                  {/* Green Base Background */}
                  <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                  {/* Animated Blue Layers on Hover */}
                  <div className="absolute w-[100px] h-[200px] bg-blue-700 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-blue-700 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

                  {/* Button Text */}
                  <button className="relative z-20 w-[130px] text-white py-2 px-6 text-sm rounded-full transition-colors duration-300">
                    Subscribe
                  </button>
                </div>

              </div>
              {thankyou && <p className="text-green-600 mt-2 text-sm">{thankyou}</p>}
            </div>
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600">
          <p className="text-center md:text-left">
            Copyright © 2025 Created by <Link href="https://difm.llc" target="_blank" className="hover:text-green-600">Do It For Me LLC</Link> All Rights Reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <Link href="/terms-and-conditions" className="hover:text-green-600">Terms of Use</Link>
            <Link href="/information-policy" className="hover:text-green-600">Information Policy</Link>
            <Link href="/privacy-policy" className="hover:text-green-600">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

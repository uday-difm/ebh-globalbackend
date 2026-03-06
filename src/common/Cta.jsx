'use client';

import Image from 'next/image';
import { ArrowRight, Star } from "lucide-react";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Button from '../common/Button'; // ✅ Import the reusable Button component
import ScrollToTopLink from '../common/ScrollToTopLink'; // ✅ Import the ScrollToTopLink component

export default function Cta() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="relative z-10 px-2 sm:px-6 mt-10 lg:px-12 2xl:px-24 overflow-hidden bg-purple-50 py-12 lg:py-20">
      <div className="container mx-auto px-6 w-full p-10 relative z-10">
        <div className="bg-purple-50 backdrop-blur-md p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center transition-all">

          {/* Text Section */}
          <div className="text-center lg:text-left text-black" data-aos="fade-up">
            <div className="inline-flex items-center rounded-full gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 mb-6">
              <Star className="h-5 w-5 text-yellow-400" />
              Hop on the Fun Wagon!
            </div>

            <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
              <div className="w-10 h-1"></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Join Our Portal Today!
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Unlock exclusive benefits and stay updated with the latest in nature, science, and insights. Join us and embark on a journey of learning and exploration.
            </p>

            {/* ✅ Button Component Used Here */}
            <Button
              href="/contact-us"
              className="w-[196px] mx-auto lg:mx-0" // Centered on mobile, left-aligned on desktop
              bgColor="bg-green-600"
              animatedColor1="bg-blue-700"
              animatedColor2="bg-blue-700"
            >
              <div className="flex text-center ms-2 mx-auto justify-center gap-1 items-center ">
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Button>
          </div>

          {/* Image Section */}
          <div className="flex justify-center" data-aos="zoom-in">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/CTA.png"
                alt="CTA - Penguin underwater"
                width={400}
                height={300}
                className="object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client"
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Cta() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="relative z-10  px-2 sm:px-6 lg:px-12 2xl:px-24 overflow-hidden">
      {/* Decorative blurred circles */}

      <div className="container mx-auto px-6 w-full p-10 relative z-10">
        <div className="bg-white/80 backdrop-blur-md p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center transition-all ">

          {/* Text Section */}
          <div className="text-center lg:text-left" data-aos="fade-up text-black">
            <div className="inline-flex items-center rounded-full gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2  mb-6 ">
              <FaStar className="text-yellow-400 animate-bounce" />
              Hop on the Fun Wagon!
            </div>
            <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
              <div className="w-10 h-1 "></div>

            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Join Our Portal Today!
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Unlock exclusive benefits and stay updated with the latest in nature, science, and insights. Join us and embark on a journey of learning and exploration.
            </p>
            <Link href="/contact-us" scroll={true} passHref>
              <div className="group relative w-[180px] bg-green-600 text-white py-3 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                <div className="absolute w-[120px] h-[250px] bg-blue-700 transform rotate-[35deg] transition-all duration-500 top-[-200%] left-[-100%] group-hover:left-[-20%] z-10">
                </div>
                <div className="absolute w-[270px] h-[120px] bg-blue-700 transform rotate-[125deg] transition-all duration-500 left-[100%] group-hover:left-[10%] z-10">
                </div>
                <span className="transition-colors rounded-full duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
                  Contact Us
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex justify-center" data-aos="zoom-in">
            <div className="overflow-hidden rounded-2xl shadow-2xl ">
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

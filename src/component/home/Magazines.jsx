"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Magazines({ magazines }) {
  const latestMagazine = magazines[0] || {};

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className='container mx-auto max-w-[1400px] px-4 py-24'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-1000'>

        {/* Left Card */}
        <div 
          className='relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-8 
            transform transition-all duration-500 hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-3
            border border-gray-200/50'
          data-aos="fade-up"
        >
          <div className='flex flex-col items-start gap-6'>
            <h2 className='text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight'>
              Latest Magazine
            </h2>
            <Link href='/magazine'>
              <div className="relative group w-[220px] overflow-hidden rounded-full perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 
                  opacity-0 group-hover:opacity-90 transition-opacity duration-500 rounded-full" />
                <div className="absolute w-[160px] h-[220px] bg-blue-500/30 
                  transform rotate-45 translate-x-[-50%] translate-y-[-50%] 
                  group-hover:translate-x-[-10%] transition-all duration-700 ease-out" />
                <button className="relative z-10 w-full py-3.5 px-6 text-white font-semibold 
                  text-sm rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 
                  shadow-lg transform transition-all duration-300 
                  group-hover:-translate-y-1 group-hover:shadow-xl flex items-center 
                  justify-center gap-2 hover:scale-105">
                  View All Magazines <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          </div>
          <div className='mt-12 flex justify-center perspective-1000'>
            <div className="transform transition-all duration-500 hover:scale-105 hover:rotate-x-5 hover:rotate-y-5">
              <Image
                src='https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-2.png'
                alt='magazines'
                width={500}
                height={250}
                className='w-3/4 h-auto rounded-lg shadow-xl'
              />
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div 
          className='relative bg-white rounded-2xl shadow-2xl p-8 
            transform transition-all duration-500 hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-3
            border border-gray-200/50'
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className='flex flex-col items-start gap-6'>
            <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight'>
              {latestMagazine.magazine_title}
            </h2>
            <div
              className='text-gray-600 line-clamp-4 text-base leading-relaxed'
              dangerouslySetInnerHTML={{ __html: latestMagazine.magazine_description || '' }}
            />
            <Link href={`/magazine/slug/${latestMagazine.magazine_slug}`}>
              <div className="relative group w-[220px] overflow-hidden rounded-full perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 
                  opacity-0 group-hover:opacity-90 transition-opacity duration-500 rounded-full" />
                <div className="absolute w-[160px] h-[220px] bg-green-500/30 
                  transform rotate-45 translate-x-[-50%] translate-y-[-50%] 
                  group-hover:translate-x-[-10%] transition-all duration-700 ease-out" />
                <button className="relative z-10 w-full py-3.5 px-6 text-white font-semibold 
                  text-sm rounded-full bg-gradient-to-r from-green-600 to-teal-600 
                  shadow-lg transform transition-all duration-300 
                  group-hover:-translate-y-1 group-hover:shadow-xl flex items-center 
                  justify-center gap-2 hover:scale-105">
                  View Latest <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          </div>
          <div className='mt-12 flex justify-center items-end perspective-1000'>
            <div className="transform transition-all duration-500 hover:scale-105 hover:rotate-x-5 hover:rotate-y-5">
              <Image
                src='https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-1.png'
                alt='magazine cover'
                width={1000}
                height={600}
                className='w-full h-auto rounded-lg shadow-xl'
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
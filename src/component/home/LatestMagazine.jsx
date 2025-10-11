'use client';

import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const LatestMagazine = () => {
  const [magazines, setMagazines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await fetch('/api/magazine');
        const data = await response.json();
        if (response.ok) {
          setMagazines(data);
        } else {
          throw new Error(data.message || 'Failed to fetch magazines');
        }
      } catch (err) {
        setError(err.message);
      }
    }
    fetchAllData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <section className="container mx-auto relative  px-4 sm:px-6 text-black">
      <div className="grid grid-cols-1 md:grid-cols-12 py-10 gap-10 max-w-[1350px]">
        {/* Left Column */}
        <div className="col-span-1 md:col-span-5 flex flex-col items-center gap-10 md:gap-12 pt-6 md:pt-8">
          <div className="w-full flex flex-col items-start gap-8">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">Latest Magazine</p>

            <Link href="/magazine" scroll>
              <div className="group relative px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-3xl hover:border-blue-700 transition-all duration-500 bg-transparent flex items-center justify-center overflow-hidden">
                <div className="absolute w-[140px] h-[200px] bg-blue-700 rotate-[35deg] transition-all duration-500 ease-in-out top-[-135%] left-[-80%] group-hover:left-0"></div>
                <div className="absolute w-[200px] h-[90px] bg-blue-700 rotate-[125deg] transition-all duration-500 ease-in-out top-[15%] left-[90%] group-hover:left-[35%]"></div>
                <span className="transition-colors duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
                  View All Magazines <FaArrowRight />
                </span>
              </div>
            </Link>
          </div>

          <div className="w-full flex justify-center">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-2.png"
              alt="earthbyhumans magazines"
              width={500}
              height={600}
              className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[460px] h-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 md:col-span-7 bg-white rounded-xl flex flex-col gap-10 pt-10 pb-6 px-6 md:px-10 shadow-md">
          <div className="w-full flex flex-col items-start gap-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug">
              {magazines[0]?.magazine_title || 'Discover Our Latest Edition'}
            </h2>

            <div
              className="text-gray-500 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  magazines[0]?.magazine_description
                    ? magazines[0].magazine_description.slice(0, 220)
                    : 'Stay informed with in-depth features, stunning visuals, and expert insights curated for curious minds.',
              }}
            />

            <Link href={magazines[0]?.magazine_slug ? `/magazine/${magazines[0].magazine_slug}` : '/magazine'} scroll>
              <div className="group relative px-6 py-3 border border-gray-300  rounded-3xl hover:border-green-600 bg-transparent flex items-center justify-center overflow-hidden">
                <div className="absolute w-[100px] h-[200px] bg-green-600 rotate-[35deg] transition-all duration-500 ease-in-out top-[-135%] left-[-80%] group-hover:left-0"></div>
                <div className="absolute w-[200px] h-[90px] bg-green-600 rotate-[125deg] transition-all duration-500 ease-in-out top-[15%] left-[90%] group-hover:left-[20%]"></div>
                <span className="transition-colors duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
                  View Latest <FaArrowRight />
                </span>
              </div>
            </Link>
          </div>

          <div className="w-full flex justify-center">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-1.png"
              alt="earth by humans magazine"
              width={500}
              height={600}
              className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestMagazine;

'use client';

import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

const LatestMagazine = () => {
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto relative">
      <div className="grid grid-cols-12 py-5 gap-5 text-black">
        {/* Left Column */}
        <div className="col-span-12 md:col-span-5 rounded-xl flex flex-col items-center gap-10 pt-10 pb-5">
          <div className="w-full flex flex-col items-start pl-[13%] gap-10">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">Latest Magazine</p>

            <Link href="/magazine" scroll={true}>
              <div className="group relative px-6 py-3 border border-gray-300 rounded-3xl hover:border-blue transition-all duration-500 bg-transparent flex items-center justify-center overflow-hidden">
                <div className="absolute w-[140px] h-[200px] bg-blue rotate-[35deg] transition-all duration-500 ease-in-out top-[-135%] left-[-80%] group-hover:left-0"></div>
                <div className="absolute w-[200px] h-[90px] bg-blue rotate-[125deg] transition-all duration-500 ease-in-out top-[15%] left-[90%] group-hover:left-[35%]"></div>
                <span className="transition-colors duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
                  View All Magazines <FaArrowRight />
                </span>
              </div>
            </Link>
          </div>

          <div className="w-[80%] flex justify-center items-end">
            <img
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-2.png"
              alt="earthbyhumans magazines"
              className="w-full h-[25vh]"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 md:col-span-7 bg-white rounded-xl flex flex-col items-center gap-10 pt-10 pb-5">
          <div className="w-full flex flex-col items-start pl-[7%] gap-10">
            <h2 className="text-xl md:text-3xl">{magazines[0]?.magazine_title}</h2>

            <div
              className="text-gray-500"
              dangerouslySetInnerHTML={{
                __html: magazines[0]?.magazine_description.slice(0, 200),
              }}
            />

            <Link href={`/magazine/${magazines[0]?.magazine_slug}`} scroll={true}>
              <div className="group relative px-6 py-3 border border-gray-300 rounded-3xl hover:border-green bg-transparent flex items-center justify-center overflow-hidden">
                <div className="absolute w-[100px] h-[200px] bg-green rotate-[35deg] transition-all duration-500 ease-in-out top-[-135%] left-[-80%] group-hover:left-0"></div>
                <div className="absolute w-[200px] h-[90px] bg-green rotate-[125deg] transition-all duration-500 ease-in-out top-[15%] left-[90%] group-hover:left-[20%]"></div>
                <span className="transition-colors duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
                  View Latest <FaArrowRight />
                </span>
              </div>
            </Link>
          </div>

          <div className="w-[90%] flex justify-center items-end">
            <img
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-1.png"
              alt="earth by humans magazine"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestMagazine;

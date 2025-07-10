import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";
import Image from 'next/image';

export default function Magazines({ magazines }) {
  // Get the latest magazine, with a fallback for safety
  const latestMagazine = magazines[0] || {};

  return (
    <div className='container mx-auto relative  max-w-[1350]'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

        {/* Left Box */}
        <div className='rounded-xl flex flex-col items-center justify-between gap-10 p-8'>
          <div className='w-full flex flex-col items-start gap-8'>
            <p className='text-3xl md:text-5xl font-bold ml-5'>Latest Magazine</p>
            <Link href='/magazine' className='ml-10'>
              <div className="relative group max-w-[200px] overflow-hidden rounded-full cursor-pointer">
                {/* Green Base Background */}
                <div className="absolute inset-0 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                {/* Animated Blue Layers on Hover */}
                <div className="absolute w-[150px] h-[200px] bg-blue-600 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                <div className="absolute w-[250px] h-[90px] bg-blue-600 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

                {/* Button Text */}
                <button className="relative z-20 w-[200px] text-black py-3 border border-gray-300 font-bold px-6 text-sm rounded-full transition-colors duration-300 flex items-center gap-2">
                  View All Magazines <FaArrowRight />
                </button>
              </div>
            </Link>
          </div>
          <div className='w-full flex justify-center'>
            <Image
              src='https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-2.png'
              alt='magazines'
              width={500}
              height={250}
              className='w-4/5 h-auto mb-24 mr-20'
            />
          </div>
        </div>

        {/* Right Box */}
        <div className='bg-white rounded-xl flex flex-col items-start justify-between gap-10 p-8'>
          <div className='w-full flex flex-col items-start gap-4'>
            <h2 className='text-xl md:text-3xl'>{latestMagazine.magazine_title}</h2>
            {/* The line-clamp class will show up to 3 lines of text */}
            <div
              className='text-gray-500 line-clamp-4'
              dangerouslySetInnerHTML={{ __html: latestMagazine.magazine_description || '' }}
            />
            <Link href={`/magazine-details/${latestMagazine.magazine_slug}`}>
              <div className="relative group max-w-[200px] overflow-hidden rounded-full cursor-pointer">
                {/* Green Base Background */}
                <div className="absolute inset-0 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                {/* Animated Blue Layers on Hover */}
                <div className="absolute w-[150px] h-[200px] bg-green-600 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                <div className="absolute w-[250px] h-[90px] bg-green-600 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

                {/* Button Text */}
                <button className="relative z-20 w-[180px] text-black py-3 border border-gray-300 font-bold px-6 text-sm rounded-full transition-colors duration-300 flex items-center gap-2">
                  View Latest <FaArrowRight />
                </button>
              </div>
            </Link>
          </div>
          <div className='w-full flex justify-center items-end'>
            <Image
              src='https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/mag-1.png'
              alt='magazine cover'
              width={1000}
              height={600}
              className='w-full h-auto'
            />
          </div>
        </div>

      </div>
    </div>
  );
};
'use client';

import Link from 'next/link';
import React from 'react';

const BlobAnimation = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="10 10 80 80"
      className="h-screen w-full absolute top-0 left-0 z-[-1]"
    >
      <defs>
        <style>
          {`
            .out-top { filter:blur(1.5rem); transform: scale(0.6); }
            .in-top { transform: scale(0.4); filter:blur(1rem); }
            .out-bottom { filter:blur(0rem); }
            .in-bottom { filter:blur(0.8rem); }
          `}
        </style>
      </defs>
      <path fill="#FC8B5F" className="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
      <path fill="#6245D5" className="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
      <path fill="#FFFFFF" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4,0.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
      <path fill="#6245D5" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
    </svg>
  );
};

export default function Hero() {
  return (
    <div className="relative font-poppins">
      <BlobAnimation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 max-w-[1650px]">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16 lg:min-h-screen lg:py-24">

          {/* Left Column */}
          <div className="flex flex-col justify-center text-center lg:text-left gap-8 px-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold leading-snug text-gray-800">
              Unleashing the power of humanity to heal <br></br> our Earth
            </h1>
            <p className="text-black text-base sm:text-lg lg:max-w-md mx-auto lg:mx-0">
              Explore Earth Encounters! Journey through our vibrant collection of videos showcasing the beauty and diversity of nature.
            </p>

            {/* Buttons */}
            <div className="w-full flex gap-5 md:gap-8 flex-wrap mt-4 lg:mt-[50px] justify-center lg:justify-start">
              <Link href='/quizzes'>
                <div className="relative group overflow-hidden rounded-full cursor-pointer min-w-[160px] h-[60px] sm:h-[65px] sm:min-w-[180px]">
                  <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>
                  <div className="absolute w-[150px] h-[250px] bg-blue-800 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[250px] h-[100px] bg-blue-800 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                  <button className="relative z-20 text-white py-4 px-8 font-bold text-base sm:text-[1rem] rounded-full transition-colors duration-300 w-full h-full">
                    Play Quiz
                  </button>
                </div>
              </Link>

              <Link href='/login'>
                <div className="relative group overflow-hidden rounded-full cursor-pointer w-full sm:w-auto min-w-[160px] h-[60px] sm:h-[65px] sm:min-w-[180px]">
                  <div className="absolute inset-0 bg-blue-800 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>
                  <div className="absolute w-[150px] h-[250px] bg-green-500 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[250px] h-[100px] bg-green-500 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                  <button className="relative z-20 text-white py-4 px-8 font-bold text-base sm:text-[1rem] rounded-full transition-colors duration-300 w-full h-full">
                    Sign Up
                  </button>
                </div>
              </Link>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex justify-center items-center w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]">
            <model-viewer
              src="./Day.glb"
              auto-rotate
              disable-tap
              ar-modes="webxr scene-viewer quick-look"
              tone-mapping="neutral"
              camera-orbit="45deg 80deg"
              shadow-intensity="0.5"
              disable-zoom
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
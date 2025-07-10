"use client";

import Link from 'next/link';

// This lets React know about the custom <model-viewer> element
// If you need TypeScript support, move this block to a .d.ts file.

export default function Hero() {
  return (
    <div className="container  mx-auto lg:px-4 xl:px-12 2xl:px-16 lg:block max-w-[1350]">
      <div className="flex lg:items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left Column: Text and Buttons */}
          <div className="flex flex-col justify-center text-center lg:text-left gap-10">
            <h1 className="text-4xl lg:text-5xl 2xl:text-6xl font-bold leading-tight text-gray-800">
              Unleashing the power of humanity to heal our Earth
            </h1>
            <p className="text-gray-600 text-lg lg:max-w-md">
              Explore Earth Encounters! Journey through our vibrant collection of videos showcasing the beauty and diversity of nature.
            </p>
            <div className="w-full flex gap-4 mt-8 justify-center lg:justify-start">
              <Link href='/quizzes'>
                <div className="relative group max-w-[130px] overflow-hidden rounded-full cursor-pointer">
                  {/* Green Base Background */}
                  <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                  {/* Animated Blue Layers on Hover */}
                  <div className="absolute w-[130px] h-[200px] bg-blue-800 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-blue-800 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

                  {/* Button Text */}
                  <button className="relative z-20 w-[130px] text-white py-4 font-bold px-6 text-sm rounded-full transition-colors duration-300">
                    Play Quiz
                  </button>
                </div>
              </Link>
              <Link href='/login'>
                <div className="relative group max-w-[130px] overflow-hidden rounded-full cursor-pointer">
                  {/* Green Base Background */}
                  <div className="absolute inset-0 bg-blue-800 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                  {/* Animated Blue Layers on Hover */}
                  <div className="absolute w-[130px] h-[200px] bg-green-500 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-green-500 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>

                  {/* Button Text */}
                  <button className="relative z-20 w-[130px] text-white py-4 font-bold px-6 text-sm rounded-full transition-colors duration-300">
                    Sign Up
                  </button>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Model */}
          <div className="flex justify-center items-center h-[900px] lg:h-[800px]">
            <model-viewer
              // NOTE: The model in your screenshot is different. 
              // Replace "3d-earth-and-sun.glb" with the path to your actual model file in the /public folder.
              src="./Day.glb"
              disable-tap
              auto-rotate
              ar-modes="webxr scene-viewer quick-look"
              tone-mapping="neutral"
              camera-orbit="45deg 80deg"
              shadow-intensity="0.5"
              disable-zoom
              style={{ width: '100%', height: '100%' }}
            >
            </model-viewer>
          </div>

        </div>
      </div>
    </div>
  );
};
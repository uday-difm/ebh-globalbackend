"use client";
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 max-w-[1350px]">
      <div className="flex items-center justify-center min-h-screen py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column */}
          <div className="flex flex-col justify-center text-center lg:text-left gap-8 px-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold leading-snug text-gray-800">
              Unleashing the power of humanity to heal our Earth
            </h1>
            <p className="text-gray-600 text-base sm:text-lg lg:max-w-md mx-auto lg:mx-0">
              Explore Earth Encounters! Journey through our vibrant collection of videos showcasing the beauty and diversity of nature.
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
              <Link href='/quizzes'>
                <div className="relative group w-full sm:w-auto overflow-hidden rounded-full cursor-pointer">
                  <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>
                  <div className="absolute w-[130px] h-[200px] bg-blue-800 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-blue-800 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                  <button className="relative z-20 w-full sm:w-[130px] text-white py-4 font-bold px-6 text-sm rounded-full transition-colors duration-300">
                    Play Quiz
                  </button>
                </div>
              </Link>

              <Link href='/login'>
                <div className="relative group w-full sm:w-auto overflow-hidden rounded-full cursor-pointer">
                  <div className="absolute inset-0 bg-blue-800 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>
                  <div className="absolute w-[130px] h-[200px] bg-green-500 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                  <div className="absolute w-[200px] h-[90px] bg-green-500 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                  <button className="relative z-20 w-full sm:w-[130px] text-white py-4 font-bold px-6 text-sm rounded-full transition-colors duration-300">
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

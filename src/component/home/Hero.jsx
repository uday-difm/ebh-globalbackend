'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../../common/Button';

let modelViewerLoader;

const BlobAnimation = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="10 10 80 80"
      className="pointer-events-none absolute inset-0 w-full h-full min-h-[520px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[680px]"
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
  const [showModel, setShowModel] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.customElements?.get('model-viewer')) {
      setViewerReady(true);
      return;
    }

    if (!modelViewerLoader) {
      modelViewerLoader = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
      });
    }

    modelViewerLoader
      .then(() => {
        if (window.customElements?.get('model-viewer')) {
          setViewerReady(true);
        }
      })
      .catch(() => {
        setViewerReady(false);
      });
  }, []);

  useEffect(() => {
    if (!viewerReady || typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setShowModel(true));
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(() => setShowModel(true), 600);
    return () => window.clearTimeout(timeoutId);
  }, [viewerReady]);

  return (
    <section className="relative font-poppins overflow-hidden h-screen justify-center items-center flex">
      <BlobAnimation />

      <div className="relative container mx-auto max-w-[1350px] px-4 sm:px-6">
        <div className="flex flex-col-reverse gap-12 items-center pt-20 pb-16 md:pt-16 md:pb-20 md:grid md:grid-cols-2 lg:min-h-[580px] xl:min-h-[720px]">

          {/* Left Column */}
          <div className="flex flex-col justify-center text-center md:text-left gap-6 md:gap-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold leading-tight text-black">
              Unleashing the power of humanity to heal our Earth
            </h1>
            <p className="text-black text-base sm:text-lg md:text-xl lg:max-w-md mx-auto md:mx-0">
              Explore Earth Encounters! Journey through our vibrant collection of videos showcasing the beauty and diversity of nature.
            </p>

            {/* Buttons */}
            <div className="w-full flex gap-4 sm:gap-6 flex-wrap mt-4 md:mt-6 lg:mt-10 justify-center md:justify-start">
              {/* Play Quiz Button */}
              <Button href='/quizzes'>
                Play Quiz
              </Button>
              {/* Sign Up Button with custom colors */}
              <Button
                href='/login'
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex justify-center items-center w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[520px] xl:h-[580px] 2xl:h-[640px]">
            {showModel ? (
              <model-viewer
                src="/Day.glb"
                auto-rotate
                disable-tap
                ar-modes="webxr scene-viewer quick-look"
                tone-mapping="neutral"
                camera-orbit="45deg 80deg"
                shadow-intensity="0.5"
                disable-zoom
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Image
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/hero-fallback.png"
                alt="Illustration of Earth By Humans hero"
                width={640}
                height={640}
                priority
                quality={70}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
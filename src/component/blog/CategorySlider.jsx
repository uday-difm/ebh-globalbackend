"use client";

import React from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// This component styles the circular arrow buttons.
function ArrowButton({ onClick, children }) {
  return (
    <div 
      className="w-8 h-8 border-1 border-green-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-colors" 
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default function CategorySlider({ categories }) {
    const pathname = usePathname();
    const sliderRef = React.useRef(null);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        arrows: false, // We render arrows manually
        variableWidth: true, // Allows each slide to have its own natural width
        slidesToScroll: 1,
    };

    const isActive = (slug) => pathname === `/blogs/category/${slug}`;
    const isAllActive = pathname === '/blogs';

    return (
        // MODIFIED: This new flexbox layout creates space for the arrows
        <div className="flex items-center justify-center gap-4 container mx-auto max-w-[1350]">
            
            {/* Previous Arrow */}
            <ArrowButton onClick={() => sliderRef.current?.slickPrev()}>
                <FaArrowLeft size={12} className="text-green-500" />
            </ArrowButton>
            
            {/* This container ensures the slider doesn't overflow */}
            <div className="flex-1 min-w-0">
                <Slider ref={sliderRef} {...settings}>
                    {/* "All" Link with special styling */}
                    <div className="px-2">
                        <Link href="/blogs" className="h-12 flex items-center justify-center outline-none">
                            <span className={`font-semibold transition-colors duration-200 w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-full`}>
                                All
                            </span>
                        </Link>
                    </div>
                    {/* Other Category Links */}
                    {categories.map((cat) => (
                        <div key={cat.category_id} className="px-2">
                            <Link href={`/blogs/category/${cat.category_slug}`} className={`h-12 py-2 px-4 flex items-center opacity-40 hover:bg-blue-700 hover:text-white hover:opacity-90 justify-center font-semibold transition-colors duration-200 whitespace-nowrap rounded-full`}>
                                {cat.category_name}
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Next Arrow */}
            <ArrowButton onClick={() => sliderRef.current?.slickNext()}>
                <FaArrowRight size={12} className="text-green-500" />
            </ArrowButton>
        </div>
    );
}
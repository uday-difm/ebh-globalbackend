"use client";

import React, { useState, useRef } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// This component styles the circular arrow buttons
function ArrowButton({ onClick, children, isDisabled }) {
  return (
    <div 
      className={`w-8 h-8 bg-white rounded-full flex-shrink-0 flex items-center justify-center shadow-md transition-opacity ${isDisabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
      onClick={!isDisabled ? onClick : null}
    >
      {children}
    </div>
  );
}

export default function CategorySlider({ categories }) {
    const pathname = usePathname();
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const totalItems = categories.length + 1;
    const slidesToShow = 5;

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        arrows: false,
        variableWidth: true,
        slidesToScroll: 1,
        afterChange: (index) => setCurrentSlide(index),
        // Responsive settings can be kept if you still need them
    };

    const isActive = (slug) => pathname === `/blogs/category/${slug}`;
    const isAllActive = pathname === '/blogs';

    // --- Final Styling Logic ---
    const baseClasses = "h-12 py-2 px-4 flex items-center justify-center font-semibold transition-colors duration-200 whitespace-nowrap";
    const activeClasses = "text-gray-400 rounded-full";
    const inactiveClasses = "text-gray-400";

    // Logic to show/hide arrows
    const showPrevArrow = currentSlide > 0;
    // A simplified but effective way to know when to hide the next arrow with variableWidth
    const showNextArrow = currentSlide < totalItems - slidesToShow + (settings.responsive ? 1: 0); 

    return (
        <div className="relative flex text-sm items-center container  group max-w-[1350]">
            {/* Previous Arrow with correct styling and logic */}
            <div className={`transition-opacity border-1 border-green-300 rounded-full duration-300 ${showPrevArrow ? ' group-hover:opacity-100' : 'opacity-0'}`}>
                <ArrowButton onClick={() => sliderRef.current?.slickPrev()}>
                    <FaArrowLeft size={12} className="text-green-500" />
                </ArrowButton>
            </div>
            
            <div className="flex-1 min-w-0 mx-4">
                <Slider ref={sliderRef} {...settings}>
                    {/* "All" Link */}
                    <div className="px-2">
                         <Link href="/blogs" className={`bg-green-500 rounded-full text-white ${baseClasses} ${isAllActive ? activeClasses : inactiveClasses}`}>
                            All
                         </Link>
                    </div>
                    {/* Category Links */}
                    {categories.map((cat) => (
                        <div key={cat.category_id} className="px-2 text-gray-100">
                            <Link href={`/blogs/category/${cat.category_slug}`} className={`hover:bg-blue-900 hover:opacity-80 rounded-full hover:text-white ${baseClasses} ${isActive(cat.category_slug) ? activeClasses : inactiveClasses}`}>
                                {cat.category_name}
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Next Arrow with correct styling and logic */}
            <div className={`transition-opacity border-1 border-green-300 rounded-full duration-300 ${showNextArrow ? 'group-hover:opacity-100' : 'opacity-0'}`}>
                <ArrowButton onClick={() => sliderRef.current?.slickNext()}>
                    <FaArrowRight size={12} className="text-green-500" />
                </ArrowButton>
            </div>
        </div>
    );
}
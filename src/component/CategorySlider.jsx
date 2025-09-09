'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useRef } from 'react';
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export const CategorySlider = ({ categories }) => {
  const pathname = usePathname();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter out duplicate 'All' if it exists in the backend data
  const filteredCategories = categories.filter(
    (cat) =>
      cat.category_slug?.toLowerCase() !== 'all' &&
      cat.category_name?.toLowerCase() !== 'all'
  );

  const totalItems = filteredCategories.length + 1;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    variableWidth: true,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
  };

  const isActive = (slug) => pathname?.endsWith(slug);
  const isAllActive = pathname === '/blogs';
  const baseClasses =
    'h-10 px-4 flex items-center justify-center font-medium text-sm transition-all duration-300 whitespace-nowrap rounded-full';
  const showPrevArrow = currentSlide > 0;
  const showNextArrow = currentSlide < totalItems - 5;

  const ArrowButton = ({ onClick, children, isDisabled }) => (
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={`w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
        isDisabled
          ? 'opacity-20 cursor-not-allowed'
          : 'cursor-pointer hover:bg-green-700 hover:scale-105'
      }`}
    >
      {children}
    </div>
  );

  return (
    <div className="relative flex items-center container group mx-auto mt-30 px-2 max-w-screen-xl">
      <div
        className={`transition-opacity duration-300 mr-2 ${
          showPrevArrow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ArrowButton
          onClick={() => sliderRef.current?.slickPrev()}
          isDisabled={!showPrevArrow}
        >
          <FaArrowLeft size={12} className="text-white" />
        </ArrowButton>
      </div>

      <div className="flex-1 min-w-0">
        <Slider ref={sliderRef} {...settings}>
          <div className="px-2">
            <Link
              href="/blogs"
              className={`${baseClasses} ${
                isAllActive
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              All
            </Link>
          </div>
          {filteredCategories.map((cat) => (
            <div key={cat.category_id} className="px-2">
              <Link
                href={`/blogs/${cat.category_slug}`}
                className={`${baseClasses} ${
                  isActive(cat.category_slug)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                {cat.category_name}
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      <div
        className={`transition-opacity duration-300 ml-2 ${
          showNextArrow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ArrowButton
          onClick={() => sliderRef.current?.slickNext()}
          isDisabled={!showNextArrow}
        >
          <FaArrowRight size={12} className="text-white" />
        </ArrowButton>
      </div>
    </div>
  );
};

export default CategorySlider;

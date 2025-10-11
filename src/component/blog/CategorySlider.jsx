// --- MODIFIED Code for: src/component/blog/CategorySlider.jsx ---

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

// This component is now reusable for both home page (URL-based filtering)
// and blogs page (Next.js Link navigation).
export const CategorySlider = ({ categories, onCategoryClick, activeCategorySlug, isHomePage = false }) => {
  const pathname = usePathname(); // Used for blogs page active state
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // totalItems now simply categories.length because "All" comes from the API response
  const totalItems = categories.length;
  const slidesToShow = 5; // This was in your original code, used for arrow logic

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    variableWidth: true,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Active state logic now depends on 'isHomePage' prop and the activeCategorySlug
  const getIsActive = (slug) => {
    if (isHomePage) {
      // For homepage, check if the current activeCategorySlug matches the item's slug
      return activeCategorySlug === slug;
    } else {
      // For other pages (like /blogs), check if the pathname matches the category slug,
      // and if the slug is "All", activate if the pathname is /blogs
      return pathname === `/blogs/category/${slug}` || (slug === "All" && pathname === '/blogs');
    }
  };

  // Logic to show/hide arrows. This logic is often complex with variableWidth.
  // Using a simplified calculation based on currentSlide and totalItems.
  // You might need to fine-tune this with `react-slick`'s internal state if it's not perfect.
  const showPrevArrow = currentSlide > 0;
  // This calculation might need adjustment based on how many "slides" are visible with variableWidth
  // A common approach for non-infinite: last possible start index is totalItems - slidesToShow (if fixed width)
  // For variable width, it's often more about `currentSlide < sliderRef.current.props.children.length - 1` when it reaches the end.
  // Let's use a robust way to determine if next arrow should be shown.
  // For now, I'll keep the previous version's logic for showNextArrow with the new totalItems.
  const effectiveSlidesToShow = settings.responsive && settings.responsive[0].settings.slidesToShow ? settings.responsive[0].settings.slidesToShow : slidesToShow;
  const showNextArrow = currentSlide < totalItems - effectiveSlidesToShow;


  const baseClasses = "h-12 py-2 px-4 flex items-center justify-center font-semibold transition-colors duration-200 whitespace-nowrap";
  const activeClasses = "bg-green-500 text-white rounded-full";
  const inactiveClasses = "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded-full";

  return (
    <div className="relative flex text-sm items-center container group max-w-[1350px]">
      {/* Previous Arrow with correct styling and logic */}
      <div className={`transition-opacity border-1 border-green-300 rounded-full duration-300 ${showPrevArrow ? ' group-hover:opacity-100' : 'opacity-0'}`}>
        <ArrowButton onClick={() => sliderRef.current?.slickPrev()} isDisabled={!showPrevArrow}>
          <ChevronLeft className="h-4 w-4 text-green-500" />
        </ArrowButton>
      </div>

      <div className="flex-1 min-w-0 mx-4">
        <Slider ref={sliderRef} {...settings}>
          {/* Dynamic Categories */}
          {/* The "All" category is now expected to be part of the 'categories' array
              coming from the backend API. So, we iterate over the 'categories' prop directly. */}
          {categories.map((cat) => (
            <div key={cat.category_id} className="px-2">
              <Link
                // For homepage: If "All", link to base path "/". Otherwise, add category query param.
                // For other pages: If "All", link to "/blogs". Otherwise, link to "/blogs/category/[slug]".
                href={isHomePage ? (cat.category_slug === "All" ? "/" : `/?category=${cat.category_slug}`) : (cat.category_slug === "All" ? "/blogs" : `/blogs/category/${cat.category_slug}`)}
                className={`${baseClasses} ${getIsActive(cat.category_slug) ? activeClasses : inactiveClasses}`}
                onClick={isHomePage ? () => onCategoryClick(cat.category_slug) : undefined}
                // When on HomePage, onClick updates the activeCategorySlug state in HomePageClient
                // For other pages, the Link navigation handles the active state via pathname.
              >
                {cat.category_name}
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      {/* Next Arrow with correct styling and logic */}
      <div className={`transition-opacity border-1 border-green-300 rounded-full duration-300 ${showNextArrow ? 'group-hover:opacity-100' : 'opacity-0'}`}>
        <ArrowButton onClick={() => sliderRef.current?.slickNext()} isDisabled={!showNextArrow}>
          <ChevronRight className="h-4 w-4 text-green-500" />
        </ArrowButton>
      </div>
    </div>
  );
};
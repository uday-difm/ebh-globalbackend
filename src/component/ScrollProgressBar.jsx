"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollWidth(scrolled);
    };


    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const radius = 50;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollWidth / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-[1000]  rounded-full w-[100px] h-[100px] flex items-center justify-center">
      {/* Progress Circle */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-90deg]"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {!isNaN(strokeDashoffset) && (
          <circle
            stroke="#16a34a"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-200 ease-out"
          />
        )}
      </svg>

      {/* Arrow in center */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="#16a34a"
        xmlns="http://www.w3.org/2000/svg"
        className="z-10"
      >
        <path d="M12 4L6 12H10V20H14V12H18L12 4Z" />
      </svg>
    </div>
  );
}

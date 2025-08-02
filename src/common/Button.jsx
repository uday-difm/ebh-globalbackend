'use client';

import Link from 'next/link';
import React from 'react';

const Button = ({
  children,
  href,
  type = 'button',
  bgColor = 'bg-green-500', // Default background color
  animatedColor1 = 'bg-blue-800', // Default animated color 1
  animatedColor2 = 'bg-blue-800', // Default animated color 2
  className = '',
}) => {
  const buttonContent = (
    <div className={`relative group overflow-hidden rounded-full cursor-pointer ${className}`}>
      <div className={`absolute inset-0 ${bgColor} z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full`}></div>
      <div className={`absolute w-[100px] h-[220px] ${animatedColor1} transform rotate-[35deg] transition-all duration-800 ease-in-out top-[-200%] left-[-90%] group-hover:left-0 z-10`}></div>
      <div className={`absolute w-[250px] h-[110px] ${animatedColor2} transform rotate-[125deg] transition-all duration-800 ease-in-out top-[-120%] left-[100%] group-hover:left-[20%] z-10`}></div>
      <button
        type={type}
        className="relative z-20 text-white py-4 font-bold px-10 text-sm rounded-full transition-colors duration-300 flex items-center justify-center"
      >
        {children}
      </button>
    </div>
  );

  return href ? (
    <Link href={href} passHref>
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
};

export default Button;
'use client';

import Link from 'next/link';
import React from 'react';

const ScrollToTopLink = ({ children, href, ...props }) => {
  const handleClick = (e) => {
    // Scrolls to the top of the window with a smooth animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default ScrollToTopLink;
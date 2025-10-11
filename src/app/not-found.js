"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
    useEffect(() => {
    // Simulate the 404 response
    document.title = "404 - Page Not Found";
    window.history.replaceState({}, "404 - Page Not Found", window.location.href);
  }, []);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto w-32 h-32 text-green-600 animate-bounce mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 ... (you can use a ghost, emoji, or exclamation icon here)" />
        </svg>
  <h2 className="text-6xl font-extrabold text-gray-800 tracking-tight">404</h2>
        <p className="mt-4 text-2xl font-medium text-gray-700">
          Oops! Page not found
        </p>
        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

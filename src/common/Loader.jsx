import React from 'react';

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-6">
      {/* Glowing spinning loader */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-30"></div>
      </div>

      {/* Loading text */}
      <span className="text-lg font-semibold text-green-600 animate-pulse tracking-wide">
        Loading...
      </span>
    </div>
  );
};

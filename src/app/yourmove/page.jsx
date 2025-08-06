"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import YourMove from './YourMove'; // Assuming YourMove.jsx is in the same directory
import Head from 'next/head'; // Make sure you import Head if you use it

// This is the parent page component.
export default function YourMovePage() {
  const auth = useSelector(state => state.auth);

  // Define analyticUpdate as a local variable or function here.
  // It is now NOT a top-level export, which fixes the build error.
  const analyticUpdate = () => {
    // This function will be passed as a prop to the YourMove component
    // and can contain logic to trigger a re-fetch of analytics.
    console.log('Analytic update triggered');
  };

  return (
    <>
      <Head>
        <title>Your Move Analytics - Earth by Humans</title>
        <meta name="description" content="View your quiz analytics and progress on Earth by Humans." />
      </Head>
      <div className="pt-20 sm:pt-24 min-h-screen">
        <div className="container mx-auto px-4 max-w-[1350px]">
          <div className="text-center my-12 md:my-16">
            <h1 className="text-4xl md:text-5xl font-bold">Your Quiz Analytics</h1>
            <p className="text-lg text-gray-600 mt-2">Track your progress and understanding of the quizzes.</p>
          </div>
          {/* YourMove component is now correctly used with the analyticUpdate prop */}
          <YourMove analyticUpdate={analyticUpdate} />
        </div>
      </div>
    </>
  );
}
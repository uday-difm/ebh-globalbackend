"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Quiz from "../../common/Quiz";
import Dashboard from "../yourmove/dashboard";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

const QuizPage = () => {
  const [analyticUpdate, setAnalyticUpdate] = useState(0);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="environmental quizzes, test your eco knowledge, interactive Earth science quizzes"
        />
        <meta
          name="description"
          content="Challenge your understanding of the environment with our quizzes and learn more about our planet. Grow your knowledge about science and nature."
        />
        <meta
          property="og:title"
          content="Test Your Knowledge through Daily Environmental Quizzes"
        />
        <meta
          property="og:description"
          content="Challenge your understanding of the environment with our quizzes and learn more about our planet. Grow your knowledge about science and nature."
        />
      </Head>

      <main className="relative mt-4 py-8 min-h-screen overflow-hidden max-w-[1350px] mx-auto">
        {/* Decorative blurred circles */}

        <section className="relative z-10 bg-white/80 mb-10 mt-20">
          <section
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Quiz setAnalyticUpdate={setAnalyticUpdate} userId={userId} />
          </section>
        </section>
        <section className="relative z-10 bg-white/80 md:p-12">
          {userId ? (
            <Dashboard analyticUpdate={analyticUpdate} />
          ) : (
            <div className="relative">
              {/* Blurred Dashboard */}
              <div className="pointer-events-none filter blur-md select-none">
                <Dashboard analyticUpdate={analyticUpdate} />
              </div>
              {/* Overlay Popup */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl shadow-2xl mx-auto max-w-lg  p-10 relative overflow-hidden animate-fade-in">
                  {/* Decorative lock icon */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold mb-2 text-green-700 drop-shadow-sm">Login Required</h2>
                  <p className="mb-6 text-gray-600 text-base font-medium">You need to log in to view this content and track your quiz score.</p>
                  <a href="/login" className="w-full flex justify-center relative z-20 text-white font-semibold text-lg rounded-full px-6 py-2 transition-colors duration-300 items-center">
                    <div className="relative group overflow-hidden rounded-full cursor-pointer w-[100px] max-w-xs">
                      {/* Background base color */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                      {/* Animated sweep layers */}
                      <div className="absolute w-[60px] h-[220px] bg-blue-700 transform rotate-[35deg] transition-all duration-800 ease-in-out top-[-200%] left-[-90%] group-hover:left-0 z-10"></div>
                      <div className="absolute w-[250px] h-[110px] bg-blue-700 transform rotate-[125deg] transition-all duration-800 ease-in-out top-[-120%] left-[100%] group-hover:left-[20%] z-10"></div>
                      <span className="relative z-20 flex justify-center w-full py-2">
                        Login
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default QuizPage;
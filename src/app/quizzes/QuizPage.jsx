"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Quiz from "../../common/Quiz";
import Dashboard from "../yourmove/dashboard";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";

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

      <main className="mt-[96px] px-4 md:px-8 lg:px-16 2xl:px-32 py-16 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
        <section
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Quiz setAnalyticUpdate={setAnalyticUpdate} userId={userId} />
        </section>

        <section
          data-aos="fade-up"
          data-aos-delay="200"
        >

          <Dashboard analyticUpdate={analyticUpdate} />
        </section>
      </main>
    </>
  );
};

export default QuizPage;
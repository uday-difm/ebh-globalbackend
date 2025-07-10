"use client";
// pages/quiz.jsx (or pages/index.jsx if this is your homepage)
import React, { useState } from "react";
import Head from 'next/head'; // Import Head from next/head
import Quiz from  "../../common/Quiz"; // Adjust path as per your Next.js project structure
import Cta from "../../common/Cta"; // Adjust path
import DashYourMove from "../../common/DashYourMove"; // Adjust path

const QuizPage = () => {
  const [analyticUpdate, setAnalyticUpdate] = useState(0);

  return (
    <>
      <Head>
        <title>Test Your Knowledge through daily Environmental Quizzes</title>
        <meta name="keywords" content="environmental quizzes, test your eco knowledge, interactive Earth science quizzes" />
        <meta name="description" content="Challenge your understanding of the environment with our quizzes and learn more about our planet. Grow your knowledge about science and nature." />
        <meta property="og:title" content="Test Your Knowledge through daily Environmental Quizzes" />
        <meta property="og:description" content="Challenge your understanding of the environment with our quizzes and learn more about our planet. Grow your knowledge about science and nature." />
      </Head>
      <div className="mt-[96px] 2xl:px-16">
        <Quiz setAnalyticUpdate={setAnalyticUpdate} />
        <DashYourMove analyticUpdate={analyticUpdate} />
      </div>
      <Cta />
    </>
  );
};

export default QuizPage;
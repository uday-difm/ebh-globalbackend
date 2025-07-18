import React from "react";
import Head from 'next/head'; // Changed from react-helmet
import DashYourMove from "../components/Home/DashYourMove"; // Adjust path

const Move = () => {
  return (
    <>
      <Head>
        <title>Track Your Move on learning through our Quiz result tracker</title>
        <meta name="keywords" content="quiz result tracker, learn and support Earth preservation, engaging environmental education"/>
        <meta name="description" content="Track your knowledge through our quiz result tracker and be a part of the earth by humans to help support the earth and the efforts made to preserve it" />
        <meta property="og:title" content="Track Your Move on learning through our Quiz result tracker"/>
        <meta property="og:description" content="Track your knowledge through our quiz result tracker and be a part of the earth by humans to help support the earth and the efforts made to preserve it"/>
      </Head>
      <div className="py-16">
        <DashYourMove />
      </div>
    </>
  );
};

export default Move;
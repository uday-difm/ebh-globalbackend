"use client";

import QuizPage from "./QuizPage";

const Quiz = () => {
  return (
    <>
      <title>Test Your Knowledge with Nature Quizzes | Earth by Humans</title>
      <meta name="description" content="  Test your knowledge with Earth by Humans' engaging quizzes on nature, science, and sustainability. Learn and track your score!" />
      <meta name="keywords" content=" quizzes, nature, science, environment, knowledge, trivia, test, learning, sustainability, Earth by Humans" />
      <meta property="og:description" content=" Test your knowledge with Earth by Humans' engaging quizzes on nature, science, and sustainability. Learn and track your score!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div>
        <QuizPage />
      </div>
    </>
  );
};

export default Quiz;

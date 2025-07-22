"use client";

import QuizPage from "./QuizPage";
import Cta from "../../common/Cta";

const Quiz = () => {
  return (
    <div>
      <QuizPage />
      <section  className=" p-6 md:p-10  w-full "
        data-aos="fade-up">
          <Cta />
        </section>
    </div>
  );
};

export default Quiz;

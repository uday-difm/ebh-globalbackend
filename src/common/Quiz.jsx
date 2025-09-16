"use client";

import React, { useEffect, useState } from 'react';
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import axios from 'axios';
import ConfettiExplosion from 'react-confetti-explosion';
import { serverUrl } from '../common/serverUrl';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Quiz = ({ setAnalyticUpdate, userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [played, setPlayed] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    setIsMobileWidth(window.innerWidth < 1024);

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/api/quizess/quiz`);
        const shuffledQuestions = response.data.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    const checkPlayStatus = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/quizess/quiz-play?userId=${userId}`);
          if (response?.data?.played) {
            setPlayed(true);
          }
        } catch (error) {
          console.error('Error checking play status:', error);
        }
      }
    };

    fetchQuizData();
    checkPlayStatus();
    AOS.init({ duration: 500, once: true });
  }, [userId]);

  const handleClickOption = async (index) => {
    if (!userId) {
      alert('Please log in to play the quiz.');
      return;
    }

    const correct = index === questions[currentQuestionIndex].correctAnswer;

    if (correct) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
    }

    // Only save analytics if the user has not played yet
    if (!played) {
      const timeTaken = new Date().toISOString();
      const sendData = {
        userId: userId,
        quizId: questions[currentQuestionIndex]._id,
        correct,
        choose_option: index + 1,
        time_taken: timeTaken
      };

      try {
        await axios.post(`/api/quizess/quiz-analytic-save`, sendData);
        setAnalyticUpdate(prev => prev + 1);
      } catch (error) {
        console.error('Error saving quiz analytic: ', error);
        alert('Error saving quiz: ' + error.message);
      }
    }

    // This line was previously being skipped, causing the issue.
    // We now ensure the selectedOption state is always updated.
    setSelectedOption(index);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      alert('Please select an option!');
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      if (userId) {
        // Post the final analytic for logged-in users
        try {
          await axios.post(`/api/quizess/save-ip-quiz-play`);
        } catch (error) {
          console.error('Error saving IP play:', error);
        }
      }
      setQuizCompleted(true);
      return;
    }

    setSelectedOption(null);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (quizCompleted) {
    return (
      <div className='max-w-screen-xl mx-auto px-6 py-20 text-gray-900 text-center'>
        <h2 className='text-4xl font-extrabold text-green-600 mb-4'>Quiz Completed!</h2>
        <p className='text-lg font-semibold text-gray-700'>
          You've successfully finished all the questions. Check your dashboard for your updated score.
        </p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className='max-w-screen-xl mx-auto px-6 py-20 text-gray-900 text-center'>
        <h2 className='text-2xl font-extrabold text-gray-800'>Loading Quiz...</h2>
      </div>
    );
  }

  return (
    <div className='mx-auto text-gray-900 max-w-[1350px]'>
      {isExploding && (
        <div className='fixed inset-0 flex justify-center items-center z-50'>
          <ConfettiExplosion
            width={window.innerWidth}
            height={window.innerHeight}
            numberofpieces={isMobileWidth ? 20 : 100}
            explosionspeed={1}
            explosionradius={100}
            explosioncolor="#000000"
          />
        </div>
      )}
      <div className="max-w-3xl mx-auto text-center mb-10" data-aos="fade-up">
        <h1 className="text-4xl font-bold">Quiz</h1>
        <p className="text-lg font-semibold text-black mt-2">
          Test your knowledge and gain valuable insights
        </p>
      </div>


      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 '>
        <div className='bg-gray-100 rounded-lg p-8 flex flex-col justify-center shadow-md w-full' data-aos="zoom-in-up">
          <p className='text-xl font-extrabold mb-4 rounded-lg p-4 text-left'>Question:</p>
          <p className='text-lg text-left rounded-lg p-6 bg-white'>{currentQuestion?.question}</p>
        </div>

        <div className='rounded-lg p-8 border border-gray-300 flex flex-col gap-6 w-full' data-aos="fade-left">
          {currentQuestion?.options.map((option, index) => (
            <QuizOption
              key={index}
              label={index + 1}
              text={option}
              handleClickOption={() => handleClickOption(index)}
              correct={index === currentQuestion.correctAnswer}
              selected={selectedOption === index}
              selectedOption={selectedOption}
              showCorrect={selectedOption !== null}
            />
          ))}
          <div className="relative group overflow-hidden rounded-full cursor-pointer w-[90px] items-end justify-center flex">
            <div className="absolute inset-0 w-[90px] bg-green-600 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-lg"></div>
            <div className="absolute w-[80px] h-[150px] bg-blue-700 transform rotate-[35deg] transition-all duration-800 ease-in-out top-[-200%] left-[-90%] group-hover:left-0 z-10"></div>
            <div className="absolute w-[250px] h-[200px] bg-blue-700 transform rotate-[125deg] transition-all duration-800 ease-in-out top-[-70%] left-[100%] group-hover:left-[20%] z-10"></div>

            <button
              onClick={handleNextQuestion}
              data-aos="fade-up"
              data-aos-delay="100"
              className="relative z-20 text-white font-bold py-2 px-5 text-md rounded-full transition-colors duration-300 justify-end flex items-center"
            > 
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const QuizOption = ({ label, text, correct, handleClickOption, selected, selectedOption, showCorrect }) => (
  <div
    className={`w-full min-h-20 flex justify-between items-center border-2 rounded-xl py-4 px-6 cursor-pointer transition-colors duration-300 shadow-sm
      ${selected ? (correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : 'border-gray-300'}
      ${showCorrect && correct ? 'bg-green-100 border-green-500' : ''}
    `}
    onClick={selectedOption === null ? handleClickOption : null}
    style={{ pointerEvents: selectedOption !== null ? 'none' : 'auto' }}
  >
    <div className='flex gap-5 items-center'>
      <input type='radio' name='option' checked={selected} readOnly className='w-5 h-5 accent-green-600' />
      <div className='flex flex-col'>
        <p className='font-semibold text-base'>{text}</p>
      </div>
    </div>
    <div className='flex items-center'>
      {selected && !correct && <ImCross className='text-red-500' fontSize={22} />}
      {showCorrect && correct && <TiTick className='text-green-600' fontSize={26} />}
    </div>
  </div>
);

export default Quiz;

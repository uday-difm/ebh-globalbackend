"use client";

import React, { useEffect, useState } from 'react';
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import axios from 'axios';
import ConfettiExplosion from 'react-confetti-explosion';
import { serverUrl } from '../common/serverUrl';

const Quiz = ({ setAnalyticUpdate, userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [playedQuestion, setPlayedQuestion] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [played, setPlayed] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  console.log('Quiz component userId:', userId);

  const handleClosePopup = () => setShowPopup(false);

  useEffect(() => {
    setIsMobileWidth(window.innerWidth < 1024);

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/quizess/quiz`);
        setQuestions(response.data);
        const randomNum = Math.floor(Math.random() * response?.data?.length);
        setCurrentQuestion(randomNum);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleClickOption = async (index) => {
    if (!userId) {
      alert('Please log in to play the quiz.');
      return;
    }

    try {
      const response = await axios.get(`${serverUrl}/quizess/quiz-play?userId=${userId}`);
      console.log('Quiz play status response:', response.data);
      if (response?.data?.played) {
        if (!userId) {
          setShowPopup(true);
          setPlayed(true);
          return;
        }
        setPlayed(false);
      } else {
        setPlayed(false);
      }
    } catch (error) {
      console.error('Error checking play status:', error);
    }

    const correct = index === questions[currentQuestion].correctAnswer;

    if (correct) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
    }

    const timeTaken = new Date().toISOString();

    const sendData = {
      userId: userId,
      quizId: questions[currentQuestion]._id,
      correct,
      choose_option: index + 1,
      time_taken: timeTaken
    };

    try {
      await axios.post(`${serverUrl}/quizess/quiz-analytic-save`, sendData);
      setAnalyticUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error saving quiz analytic: ', error);
      alert('Error saving quiz: ' + error.message);
    }

    if (!played) {
      setSelectedOption(index + 1);
      setPlayedQuestion(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      alert('Please select an option!');
      return;
    }

    if (playedQuestion === 5 && !played) {
      try {
        const response = await axios.post(`${serverUrl}/quizess/save-ip-quiz-play`);
        if (response.status === 200) setPlayed(true);
      } catch (error) {
        console.error('Error saving IP play:', error);
        alert('Error: ' + error.message);
      }
      setShowPopup(true);
      return;
    }

    setSelectedOption(null);
    const randomNum = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(randomNum);
  };

  const question = questions[currentQuestion];

  return (
    <div className='max-w-screen-xl mx-auto px-6 py-10 text-gray-900'>
      {showPopup && (
        <PopupBox
          message="You have reached the end of the quiz.<br/> Please log in for access to more quizzes."
          onClose={handleClosePopup}
        />
      )}
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
      <div className='text-center mb-10'>
        <h1 className='text-4xl font-bold'>Quiz</h1>
        <p className='text-lg font-semibold text-gray-700'>Test your knowledge and gain valuable insights</p>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-gray-100 rounded-lg p-8 flex flex-col justify-center shadow-md w-full'>
          <p className='text-xl font-extrabold mb-4 rounded-lg p-4 text-left'>Question:</p>
          <p className='text-lg text-left rounded-lg p-6 bg-white shadow-sm'>{question?.question}</p>
        </div>
        <div className='rounded-lg p-8 border border-gray-300 flex flex-col gap-6 shadow-md w-full'>
          {question?.options.map((option, index) => (
            <QuizOption
              key={index}
              label={index + 1}
              text={option}
              handleClickOption={() => handleClickOption(index)}
              correct={index === question.correctAnswer}
              selected={selectedOption === index + 1}
              selectedOption={selectedOption}
              showCorrect={selectedOption !== null}
            />
          ))}
          <button
            className='self-end py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition duration-300 ease-in-out shadow'
            onClick={handleNextQuestion}
          >
            Next
          </button>
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
      <input type='radio' name='option' checked={selected} readOnly className='w-5 h-5 accent-blue-600'/>
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

"use client";

import React, { useEffect, useState } from 'react';
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import axios from 'axios';
import PopupBox from './PopupBox';
import ConfettiExplosion from 'react-confetti-explosion';
 import { serverUrl } from '../common/serverUrl';

import { useSelector } from 'react-redux';

const Quiz = ({ setAnalyticUpdate }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [playedQuestion, setPlayedQuestion] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [played, setPlayed] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  const userId = useSelector(state => state.auth?.userId || null);
  console.log('Quiz component userId:', userId);

  const handleClosePopup = () => setShowPopup(false);

  const handleClickOption = async (index) => {
    console.log('handleClickOption userId:', userId);
    if (!userId) {
      alert('Please log in to play the quiz.');
      return;
    }
    if (selectedOption !== null || played) return;

    // Reset played state if userId changes or on new quiz start
    if (played) {
      setPlayed(false);
      setSelectedOption(null);
    }

    try {
      const response = await axios.get(`${serverUrl}/quizess/quiz-play`);
      if (response?.data[0]?.played) {
        setShowPopup(true);
        setPlayed(true);
        return;
      }
    } catch (error) {
      console.error('Error checking play status:', error);
    }

    const correct = index === questions[currentQuestion].correctAnswer;

    if (correct) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
    }

    // Calculate dynamic time_taken (example: current ISO string)
    const timeTaken = new Date().toISOString();

    const sendData = {
      userId: userId, // Pass userId from Redux
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

    if (selectedOption !== null && !played) return;

    try {
      const response = await axios.get(`${serverUrl}/quizess/quiz-play`);
      if (response?.data[0]?.played) {
        setShowPopup(true);
        setPlayed(true);
        return;
      }
    } catch (error) {
      console.error('Error checking play status:', error);
    }

    const correct = index === questions[currentQuestion].correctAnswer;

    if (correct) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
    }

    // Calculate dynamic time_taken (example: current ISO string)
    const timeTaken = new Date().toISOString();

    const sendData = {
      userId: userId, // Pass userId from Redux
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
    <div className='container mx-auto px-4 py-10 text-gray-900'>
      {showPopup && (
        <PopupBox
          message="You have reached the end of the quiz.<br/> Please log in for access to more quizzes."
          onClose={handleClosePopup}
        />
      )}
      {isExploding && (
        <div className='w-full h-full flex justify-center items-center absolute top-0 left-0'>
          <ConfettiExplosion
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={isMobileWidth ? 20 : 100}
            explosionSpeed={1}
            explosionRadius={100}
            explosionColor="#000000"
          />
        </div>
      )}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <div className='col-span-1 flex flex-col items-center gap-7'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Quiz</h1>
          <h5 className='text-lg font-semibold text-black w-[90%] flex justify-center'>
            Test your knowledge and gain valuable insights
          </h5>
        </div>

        <div className='col-span-1 bg-gray-100 flex flex-col justify-center items-start px-5 gap-5 border-0 rounded-lg py-10'>
          <p className='text-xl bg-white border-none rounded-3xl px-3 py-2'><b>Question: </b></p>
          <p className='text-xl text-justify px-3'>{question?.question}</p>
          {selectedOption && (
            <>
              <p className='text-base bg-white border-none rounded-3xl px-3 py-2'>Explanation of the Answer</p>
              <p className='text-sm px-3'>{question?.explanation}</p>
            </>
          )}
        </div>

        <div className='col-span-1 border-2 border-gray-300 rounded-lg flex flex-col gap-5 justify-center items-center py-6 px-3'>
          {question?.options.map((option, index) => (
            <QuizOption
              key={index}
              label={index + 1}
              text={option}
              handleClickOption={() => handleClickOption(index)}
              correct={index === question.correctAnswer}
              selected={selectedOption === index + 1}
              selectedOption={selectedOption}
            />
          ))}
          <button
            className='ml-auto mr-5 py-2 px-4 bg-blue-600 hover:bg-green-500 text-white font-bold rounded-lg transition duration-500 ease-in-out'
            onClick={handleNextQuestion}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const QuizOption = ({ label, text, correct, handleClickOption, selected, selectedOption }) => (
  <div
    className={`w-full min-h-20 flex justify-between items-center border-2 border-gray-300 rounded-xl py-4 px-6 cursor-pointer transition-colors duration-300 
      ${selected ? (correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : ''} 
      ${selectedOption !== null && correct ? 'bg-green-100 border-green-500' : ''}`}
    onClick={selectedOption === null ? handleClickOption : null}
  >
    <div className='flex gap-5'>
      <input type='radio' name='option' checked={selected} readOnly />
      <div className='flex flex-col'>
        <p className='font-semibold text-[.9rem] text-blue-700'>{text}</p>
      </div>
    </div>
    {selected && (!correct && <ImCross />)}
    {selectedOption !== null && correct && <TiTick fontSize={26} />}
  </div>
);

export default Quiz;

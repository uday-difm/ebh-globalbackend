'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImCross } from 'react-icons/im';
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const AllPlayedQuiz = () => {
  const [detailedAnalytics, setDetailedAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const router = useRouter();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
      try {
        const response = await axios.get(`/api/quizess/all-ip-quiz/${userId}`,
          { withCredentials: true }
        );
        setDetailedAnalytics(response.data);
      } catch (err) {
        setError('Error fetching quiz history');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDetailedAnalytics();
    } else {
      setLoading(false);
    }
  }, [userId]);


  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  const paginate = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const renderOption = (option, idx, correctAnswer, chosenOption) => {
    const selected = idx + 1 === chosenOption;
    const correct = idx === correctAnswer;

    return (
      <div
        key={idx}
        className={`w-full h-[4rem] flex justify-between my-2 items-center border-2 rounded-xl px-6 cursor-pointer transition-colors duration-300 ${selected
            ? correct
              ? 'bg-light-green border-green'
              : 'bg-red1 border-red'
            : ''
          } ${correct ? 'bg-light-green border-green' : ''}`}
      >
        <div className="flex gap-5 items-center">
          <input type="radio" checked={selected} readOnly />
          <p className="font-semibold text-[.9rem] text-blue2">{option}</p>
        </div>
        {selected && !correct && <ImCross />}
        {correct && <TiTick fontSize={26} />}
      </div>
    );
  };

  const renderDetailedAnalytics = (data, idx) => (
    <div
      key={`${data.quizId}_${data.created_at}`}
      className="p-4 bg-gray-200 w-full mb-4 rounded-md shadow-md"
    >
      <div className="flex justify-between text-sm">
        <div className="flex gap-5 items-center">
          <span>Quiz #{idx + 1}</span>
          <span
            className={`px-3 py-1 font-medium rounded-md ${data.choose_option - 1 === data.correctAnswer
                ? 'bg-light-green text-dark-green'
                : 'bg-red text-red2'
              }`}
          >
            {data.choose_option - 1 === data.correctAnswer
              ? 'Correct'
              : 'Incorrect'}
          </span>
        </div>
        <span>{new Date(data.created_at).toLocaleDateString('en-GB')}</span>
      </div>

      <div className="mt-3 text-gray-800">
        <p>
          <strong>Question:</strong> {data.question}
        </p>
        <ul>
          {data.options.map((opt, i) =>
            renderOption(opt, i, data.correctAnswer, data.choose_option)
          )}
        </ul>
        <p className="my-5">
          <strong>Explanation:</strong> {data.explanation}
        </p>
      </div>
    </div>
  );

  const totalPages = Math.ceil(detailedAnalytics.length / questionsPerPage);
  const start = (currentPage - 1) * questionsPerPage;
  const end = start + questionsPerPage;
  const currentQuestions = detailedAnalytics.slice(start, end);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center mt-36">
      {detailedAnalytics.length === 0 ? (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded shadow-md text-center">
          <p className="text-gray-800 text-lg font-semibold">
            No quiz played yet
          </p>
          <button
            onClick={() => {
              scrollToTop();
              router.push('/quizzes');
            }}
            className="mt-6 px-16 py-4 font-medium rounded-xl text-white bg-blue hover:bg-sky transition-all duration-500"
          >
            Play Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-3xl">
            {currentQuestions.map(renderDetailedAnalytics)}
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                scrollToTop();
                router.push('/quizzes');
              }}
              className="px-7 py-2 mb-[2rem] font-medium rounded-xl text-white bg-blue hover:bg-sky transition-all duration-500"
            >
              Play More Quiz
            </button>
            <nav>
              <ul className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 border rounded-md ${currentPage === i + 1
                        ? 'bg-blue text-white'
                        : 'bg-gray text-black'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default AllPlayedQuiz;

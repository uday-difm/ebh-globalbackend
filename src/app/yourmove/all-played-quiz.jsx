"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import Link from 'next/link';

const AllPlayedQuiz = () => {
    const [detailedAnalytics, setDetailedAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(10);

    useEffect(() => {
        const fetchDetailedAnalytics = async () => {
            try {
                const response = await axios.get(`/api/all-ip-quiz`); // Adjust your backend route
                setDetailedAnalytics(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching detailed quiz analytics');
                setLoading(false);
            }
        };

        fetchDetailedAnalytics(); // Fetch data unconditionally (no auth check)
    }, []);

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = detailedAnalytics.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderOption = (option, index, correctAnswer, choose_option) => {
        const selected = index + 1 === choose_option;
        const correct = index === correctAnswer;

        return (
            <div
                key={index}
                className={`w-full h-[4rem] flex justify-between my-2 items-center border-2 border-gray2 rounded-xl px-6 cursor-pointer transition-colors duration-300 
                ${selected ? (correct ? 'bg-light-green border-green' : 'bg-red1 border-red') : ''} 
                ${correct && !selected ? 'bg-light-green border-green' : ''}`}
            >
                <div className='flex gap-5'>
                    <input type='radio' name='option' checked={selected} readOnly />
                    <div className='flex flex-col'>
                        <p className='font-semibold text-[.9rem] text-blue2'>{option}</p>
                    </div>
                </div>
                {selected && !correct && <ImCross />}
                {correct && <TiTick fontSize={26} />}
            </div>
        );
    };

    const renderDetailedAnalytics = (data, index) => (
        <div className='p-4 bg-gray-200 w-full mb-4 rounded-md shadow-md' key={data.quizId + data.created_at}>
            <div className='text-sm flex justify-between items-center'>
                <div className='flex gap-5 items-center'>
                    <span>Quiz ID: {index + 1}</span>
                    <span className={`px-3 py-1 font-medium rounded-md 
                        ${data.choose_option - 1 === data.correctAnswer ? 'bg-light-green text-dark-green' : 'bg-red text-red2'}`}>
                        {data.choose_option - 1 === data.correctAnswer ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <span>{new Date(data.created_at).toLocaleDateString('en-GB')}</span>
            </div>
            <div className='mt-3 text-gray-800'>
                <p><strong>Question:</strong> {data.question}</p>
                <ul className='list-none'>
                    {data.options.map((option, index) =>
                        renderOption(option, index, data.correctAnswer, data.choose_option)
                    )}
                </ul>
                <p className='my-5'><strong>Explanation:</strong> {data.explanation}</p>
            </div>
        </div>
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const totalPages = Math.ceil(detailedAnalytics.length / questionsPerPage);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className='flex flex-col items-center mt-36'>
            {detailedAnalytics.length === 0 && (
                <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
                    <p className="text-gray-800 text-center text-lg font-semibold">No quiz played yet</p>
                    <div className="flex justify-center mt-6">
                        <Link href={'/quizzes'}>
                            <button className="px-16 py-4 font-medium rounded-xl text-white bg-blue hover:bg-sky transition-all duration-500">
                                Play Quiz
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            <div className='w-full max-w-3xl'>
                {currentQuestions.map(renderDetailedAnalytics)}
            </div>

            <div className='mt-4'>
                {detailedAnalytics.length > 0 && (
                    <>
                        <Link href={'/quizzes'}>
                            <button onClick={scrollToTop} className="px-7 py-2 mb-8 font-medium rounded-xl text-white bg-blue hover:bg-sky transition-all duration-500">
                                Play More Quiz
                            </button>
                        </Link>
                        <nav>
                            <ul className='flex justify-center list-none'>
                                {[...Array(totalPages).keys()].map(number => (
                                    <button
                                        key={number + 1}
                                        onClick={() => {
                                            scrollToTop();
                                            paginate(number + 1);
                                        }}
                                        className={`mx-1 px-3 py-1 border rounded-md 
                                            ${currentPage === number + 1 ? 'bg-blue text-white' : 'bg-gray text-black'}`}
                                    >
                                        {number + 1}
                                    </button>
                                ))}
                            </ul>
                        </nav>
                    </>
                )}
            </div>
        </div>
    );
};

export default AllPlayedQuiz;

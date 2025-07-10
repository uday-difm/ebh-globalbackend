// components/QuizAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import axios from 'axios';// Assuming this path is correct relative to your Next.js project
import { useSelector } from 'react-redux'; // Assuming you have Redux set up with Next.js

const QuizAnalytics = ({ analyticUpdate }) => {
    const [analytics, setAnalytics] = useState({ currentDay: [], currentWeek: [], currentMonth: [], currentYear: [] });
    const auth = useSelector(state => state.auth); // Ensure Redux store is accessible

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`/quiz/current-quiz-analysis`);
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching quiz analytics:', error);
            }
        };

        if (auth.userId) { // Only fetch if userId is available
            fetchAnalytics();
        }
    }, [auth.userId, analyticUpdate]);

    const renderAnalytics = (data, title) => {
        const correctPercentage = parseFloat(data?.correct_percentage);

        return (
            <div className='p-4 bg-gray3 max-w-[340px]'>
                <div className='text-sm flex justify-between items-center'>
                    <div className='flex w-full items-center justify-between'>
                        <p>{title}</p>
                        <p className='bg-light-blue text-dark-sky px-3 py-1 font-medium rounded-md'>Analytics</p>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-2 w-full text-[12px] mt-3'>
                    <span className='flex items-center gap-2 text-gray-800'>
                        <IoMdCheckmark color='#15803d' /> Correct: {data.correct_count}
                    </span>
                    <span className='flex items-center gap-2 ml-auto text-gray-800'>
                        <RxCross2 color='#e63946' /> Incorrect: {data.wrong_count}
                    </span>
                    <span className='flex items-center gap-2 text-gray-800'>
                        Total: {data.total_count}
                    </span>
                    <span className='flex items-center gap-2 text-gray-800'>
                        Percentage: {correctPercentage !== undefined ? (correctPercentage).toFixed(2) : '0.00'}%
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className='mt-4 flex gap-8 flex-wrap items-center justify-center'>
            {analytics.currentDay.length > 0 && renderAnalytics(analytics.currentDay[0], 'Current Day')}
            {analytics.currentWeek.length > 0 && renderAnalytics(analytics.currentWeek[0], 'Current Week')}
            {analytics.currentMonth.length > 0 && renderAnalytics(analytics.currentMonth[0], 'Current Month')}
            {analytics.currentYear.length > 0 && renderAnalytics(analytics.currentYear[0], 'Current Year')}
        </div>
    );
};

export default QuizAnalytics;
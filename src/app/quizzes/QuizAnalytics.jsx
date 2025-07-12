// components/QuizAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../../Component/common/serverUrl';

const QuizAnalytics = ({ analyticUpdate, userId = null }) => {
    const [analytics, setAnalytics] = useState({ currentDay: [], currentWeek: [], currentMonth: [], currentYear: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${serverUrl}/quizess/current-quiz-analysis?userId=${userId}`);
                setAnalytics(response.data);
            } catch (error) {
                setError('Error fetching quiz analytics');
                console.error('Error fetching quiz analytics:', error);
            }
        };
        fetchAnalytics();
    }, [analyticUpdate, userId]);

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

    if (!userId) return <div className='text-center text-gray-500'>No user selected.</div>;
    if (error) return <div className='text-center text-red-500'>{error}</div>;

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
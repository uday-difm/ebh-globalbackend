"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const YourMove = ({ analyticUpdate }) => {
  const auth = useSelector(state => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!auth?.userId) return;
      try {
        console.log('Fetching analytics for userId:', auth.userId);
        const response = await axios.get(`/api/quizess/current-quiz-analysis/${auth.userId}`);
        console.log('Analytics response:', response.data);
        setAnalytics(response.data);
      } catch (err) {
        setError('Error fetching analytics data');
        console.error(err);
      }
    };
    fetchAnalytics();
  }, [auth?.userId, analyticUpdate]);

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!analytics) return <div className="text-center text-gray-500">Loading analytics...</div>;

  return (
    <div className="mt-4 flex gap-8 flex-wrap items-center justify-center">
      {analytics.currentDay?.length > 0 && renderAnalytics(analytics.currentDay[0], 'Current Day')}
      {analytics.currentWeek?.length > 0 && renderAnalytics(analytics.currentWeek[0], 'Current Week')}
      {analytics.currentMonth?.length > 0 && renderAnalytics(analytics.currentMonth[0], 'Current Month')}
      {analytics.currentYear?.length > 0 && renderAnalytics(analytics.currentYear[0], 'Current Year')}
    </div>
  );
};

const renderAnalytics = (data, title) => {
  const correctPercentage = parseFloat(data?.correct_percentage);
  return (
    <div className='p-4 bg-gray-100 max-w-[340px] rounded-md shadow-md'>
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
          Percentage: {correctPercentage !== undefined ? correctPercentage.toFixed(2) : '0.00'}%
        </span>
      </div>
    </div>
  );
};

export default YourMove;

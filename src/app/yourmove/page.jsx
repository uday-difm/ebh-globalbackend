"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import LineChart from '../../common/LineChart';
import DoughnutChart from '../../common/DoughnutChart';


const YourMove = ({ analyticUpdate }) => {
  const auth = useSelector(state => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!auth?.userId) return;
      try {
        setLoading(true);
        console.log('Fetching analytics for userId:', auth.userId, 'with analyticUpdate:', analyticUpdate);
        const response = await axios.get(`/api/quizess/current-quiz-analysis/${auth.userId}`);
        console.log('Analytics response:', response.data);
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching analytics data');
        console.error(err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [auth?.userId, analyticUpdate]);

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (loading) return <div className="text-center text-gray-500">Loading analytics...</div>;
  if (!analytics) return <div className="text-center text-gray-500">No analytics data available.</div>;

  const hasData =
    (analytics.currentDay && analytics.currentDay.length > 0) ||
    (analytics.currentWeek && analytics.currentWeek.length > 0) ||
    (analytics.currentMonth && analytics.currentMonth.length > 0) ||
    (analytics.currentYear && analytics.currentYear.length > 0);

  // Calculate total, correct, wrong counts for DoughnutChart
  const totalCorrect = analytics.currentMonth?.reduce((acc, item) => acc + (parseInt(item.correct_count) || 0), 0) || 0;
  const totalWrong = analytics.currentMonth?.reduce((acc, item) => acc + (parseInt(item.wrong_count) || 0), 0) || 0;
  const totalQuestions = totalCorrect + totalWrong;

  return (
    <div className="mt-4 flex flex-col items-center gap-8">
      {!hasData ? (
        <div className="text-center text-gray-500 w-full">No analytics data available.</div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
            {analytics.currentDay?.length > 0 && renderAnalytics(analytics.currentDay[0], 'Current Day')}
            {analytics.currentWeek?.length > 0 && renderAnalytics(analytics.currentWeek[0], 'Current Week')}
            {analytics.currentMonth?.length > 0 && renderAnalytics(analytics.currentMonth[0], 'Current Month')}
            {analytics.currentYear?.length > 0 && renderAnalytics(analytics.currentYear[0], 'Current Year')}
          </div>
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
            <div className="w-full md:w-2/3">
              <LineChart dailyResults={analytics.currentMonth || []} />
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <DoughnutChart data={[totalCorrect, totalWrong]} total={totalQuestions} />
            </div>
             
          </div>
        </>
      )}
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

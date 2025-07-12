import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import DoughnutChart from '../../common/DoughnutChart';
import LineChart from '../../common/LineChart';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { serverUrl } from '../../common/serverUrl';

const Dashboard = ({ analyticUpdate }) => {
  const [dailyResults, setDailyResults] = useState([]);
  const [totalResult, setTotalResult] = useState([0, 0]);
  const [weekStats, setWeekStats] = useState({ correct: 0, wrong: 0, total: 0, percent: 0 });
  const [dayStats, setDayStats] = useState({ correct: 0, wrong: 0, total: 0, percent: 0 });
  const [monthStats, setMonthStats] = useState({ correct: 0, wrong: 0, total: 0, percent: 0 });
  const [yearStats, setYearStats] = useState({ correct: 0, wrong: 0, total: 0, percent: 0 });

  const auth = useSelector(state => state.auth);
  const userId = auth.userId;
  const userName = auth.name;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!userId) return;

        const [analysisResponse, weekResponse, dayResponse, monthResponse, yearResponse] = await Promise.all([
          axios.get(`${serverUrl}/quizess/current-quiz-analysis?userId=${userId}`),
          axios.get(`${serverUrl}/quizess/get-week?userId=${userId}`),
          axios.get(`${serverUrl}/quizess/current-day-stats?userId=${userId}`),
          axios.get(`${serverUrl}/quizess/current-month-stats?userId=${userId}`),
          axios.get(`${serverUrl}/quizess/current-year-stats?userId=${userId}`),
        ]);

        // Parse currentMonth data for dailyResults equivalent
        const currentMonthData = analysisResponse.data.currentMonth || [];
        const dailyResultsMapped = currentMonthData.map(item => {
          let day = 1;
          if (typeof item.period === 'string' && item.period.length >= 10) {
            day = parseInt(item.period.split('-')[2], 10);
          } else if (!isNaN(item.period)) {
            const periodStr = item.period.toString();
            day = parseInt(periodStr.slice(-2), 10);
          }
          return {
            day,
            correct_count: parseInt(item.correct_count, 10) || 0,
            wrong_count: parseInt(item.wrong_count, 10) || 0,
          };
        });
        setDailyResults(dailyResultsMapped);

        // Calculate totalResult from currentYear data
        const currentYearData = analysisResponse.data.currentYear || [];
        let totalCorrect = 0;
        let totalWrong = 0;
        currentYearData.forEach(item => {
          totalCorrect += parseInt(item.correct_count, 10) || 0;
          totalWrong += parseInt(item.wrong_count, 10) || 0;
        });
        setTotalResult([totalCorrect, totalWrong]);

        const weekData = weekResponse.data;
        setWeekStats({
          correct: weekData.correct_count || 0,
          wrong: weekData.wrong_count || 0,
          total: (weekData.correct_count || 0) + (weekData.wrong_count || 0),
          percent: weekData.percent !== undefined && weekData.percent !== null ? parseFloat(weekData.percent).toFixed(2) : 0,
        });
        setDayStats(dayResponse.data);
        setMonthStats(monthResponse.data);
        setYearStats(yearResponse.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };
    fetchQuizData();
  }, [userId, analyticUpdate]);

  return (
    <div className='max-w-[1400px] mx-auto'>
      <div className=''>
        <div>
          <h2 className='text-[30px] lg:text-[55px] text-center font-medium font-bold text-blue-900' style={{ fontFamily: "poppin" }}>Track Your Score</h2>
        </div>
        <div className=' flex justify-center lg:justify-between  items-center gap-8 flex-wrap p-[16px] mt-10'>
          <div>
            <h2 className="text-2xl p-1  font-semibold mb-4 text-green-600" style={{ fontFamily: "poppin" }}>Hi {userName || 'User'},<br />Welcome to Dashboard</h2>
            <div className='mt-4 flex gap-8 flex-wrap items-center justify-center p-2'>
              <StatsCard title="Current Day" stats={dayStats} />
              <StatsCard title="Current Week" stats={weekStats} />
              <StatsCard title="Current Month" stats={monthStats} />
              <StatsCard title="Current Year" stats={yearStats} />
            </div>
          </div>
        </div>
        {/* Charts */}
        <div className='mt-[50px] grid grid-cols-12 lg:gap-10'>
          <div className='p-[15px] col-span-12 lg:col-span-8'>
            <div>
              <div className='flex justify-between'>
                <h2 className='text-2xl font-bold font-bold'>Current Month Analytics</h2>
              </div>
              <div className='p-4'>
                <LineChart data={dailyResults} />
              </div>
            </div>
          </div>
          <div className='p-[30px] w-full col-span-12 lg:col-span-4 mx-auto bg-gray-100 h-[400px] rounded-lg'>
            <div className='flex justify-between'>
              <h2 className='text-2xl font-bold'>Overall</h2>
              <button
                className="bg-blue-200 px-4 text-blue-700 font-medium rounded-md"
                onClick={() => router.push('/quizzes/QuizResultsPage')}
              >
                View
              </button>
            </div>
            <div className='relative z-10'>
              <DoughnutChart data={totalResult} total={totalResult[0] + totalResult[1]} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, stats }) => (
  <div className='p-4 bg-gray-100 max-w-[340px]'>
    <div className='text-sm flex justify-between items-center'>
      <div className='flex gap-5 items-center'>
        <span>{title}</span>
        <span className='bg-blue-200 text-blue-600 px-3 py-1 font-medium rounded-md'>Analytics</span>
      </div>
    </div>
    <div className='grid grid-cols-2 gap-2 text-[12px] mt-3'>
      <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Correct: {stats.correct}</span>
      <span className='flex items-center gap-2 text-gray-800'><RxCross2 color='#e63946' /> Incorrect: {stats.wrong}</span>
      <span className='flex items-center gap-2 text-gray-800'>Total: {stats.total}</span>
      <span className='flex items-center gap-2 text-gray-800'>Percentage: {stats.percent}%</span>
    </div>
  </div>
);

export default Dashboard;

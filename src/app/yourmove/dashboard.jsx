import React, { useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import DoughnutChart from '../../common/DoughnutChart'; // Adjust path
import LineChart from '../../common/LineChart';   // Adjust path
import axios from 'axios';
import { useSelector } from 'react-redux';
 import { serverUrl } from '../../Component/common/serverUrl';

const Dashboard = () => {
    const [analytic, setAnalytic] = React.useState([]);
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        const fetchQuizData = async () => {
          try {
            if (!auth?.user?.id) return;
            const response = await axios.get(`${serverUrl}/quizess/quiz-analytic-save/${auth.user.id}`);
            setAnalytic(response.data);
          } catch (error) {
            console.error('Error fetching quiz data:', error);
          }
        };

        fetchQuizData();
      }, [auth?.user?.id]);

    return (
        <div className='max-w-[1400px] mx-auto '>
            <div className='   px-[15px]'>
                <div>
                    <h2 className='text-[30px] lg:text-[55px] text-center font-medium'>Track Your Moves</h2>
                </div>
                <div className='bg-gray-50 flex justify-center lg:justify-between items-center gap-8 flex-wrap p-[16px] mt-10'>
                    <div>
                        <div>
                            <h2 className='text-[30px] font-bold'>Hi {auth?.user?.name || 'User'}, Welcome to Dashboard</h2>
                            <div className='mt-4 flex gap-8 flex-wrap items-center justify-center'>
                                {analytic && analytic.length > 0 ? analytic.map((item, index) => (
                                    <div key={index} className='p-4 bg-gray-100 max-w-[340px]'>
                                        <div className='text-sm flex justify-between items-center'>
                                            <div className='flex gap-5 items-center'>
                                                <span>{item.userName || 'User'}</span>
                                                <span className='bg-green-200 text-green-400  px-3 py-1 font-medium rounded-md'>User</span>
                                            </div>
                                            <span>{item.date || 'N/A'}</span>
                                        </div>
                                        <div className='grid grid-cols-2 gap-2 text-[12px] mt-3 ' >
                                            <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Correct: {item.correctCount}</span>
                                            <span className='flex items-center gap-2 text-gray-800'><RxCross2 color='#e63946' /> Incorrect: {item.incorrectCount}</span>
                                            <span className='flex items-center gap-2 text-gray-800'>Total: {item.totalCount}</span>
                                            <span className='flex items-center gap-2 text-gray-800'>Percentage: {item.percentage}%</span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className='text-center text-gray-500'>No analytics data available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='text-center max-w-[300px] bg-blue-50 rounded-lg p-4 flex flex-col items-center'>
                        <div>
                            <h2 className='font-medium text-md leading-4' >Upgrade to <br /> Enterprise account</h2>
                            <button className='relative right-[-120px] top-[-30px]'><RxCross2 /></button>
                        </div>
                        <p className='text-sm text-gray-500 '>Increase your sales by using special features of Enterprise Membership.</p>
                        <button className='bg-orange-500 text-white px-8 py-1 rounded-md w-[120px] mt-3 text-center'>Upgrade</button>
                    </div>
                </div>

                <div className='mt-[50px] grid grid-cols-12 lg:gap-10'>
                    <div className='p-[15px] col-span-12 lg:col-span-8 '>
                        <div>
                            <div className='flex justify-between'>
                                <div>
                                    <h2 className='text-2xl font-bold'>$ 12,345</h2>
                                    <span className='text-medium text-gray-500'>Wallet Balance</span>
                                </div>
                                <button className='bg-blue-200 px-4 text-blue-700 font-medium rounded-md'>View My Portfolio</button>
                            </div>
                            <div className='p-4 '>
                                <LineChart />
                            </div>
                        </div>

                    </div>
                    <div className=' p-[30px] w-full col-span-12 lg:col-span-4 mx-auto bg-gray-100 h-[400px]'>
                        <div className='flex justify-between'>
                            <h2 className='text-2xl font-bold'>Trade</h2>
                            <button className='bg-blue-200 px-4 text-blue-700 font-medium rounded-md'>See All</button>
                        </div>
                        <div className='relative z-10' >
                            <DoughnutChart/>
                        </div>
                        <div className='font-bold relative top-[-210px] text-[20px] text-center'>
                            <h2 className='flex justify-center'>User</h2>
                            <h2 className='flex justify-center'>{analytic.length}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;

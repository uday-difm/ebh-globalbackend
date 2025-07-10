import React, { useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import DoughnutChart from '../../common/DoughnutChart'; // Adjust path
import LineChart from '../../common/LineChart';   // Adjust path
import axios from 'axios';

const Dashboard = () => {
    const auth = useSelector(state => state.auth);
    const [analytic, setAnalytic] = React.useState([]);

    useEffect(() => {
        const fetchQuizData = async () => {
          try {
            const response = await axios.get(`/quiz/get-quiz-analytic/${auth.id}`);
            setAnalytic(response.data);
          } catch (error) {
            console.error('Error fetching quiz data:', error);
          }
        };

        if (auth.id) { // Fetch only if id is available
            fetchQuizData();
        }
      }, [auth.id]);

    return (
        <div className='max-w-[1400px] mx-auto '>
            <div className='   px-[15px]'>
                <div>
                    <h2 className='text-[30px] lg:text-[55px] text-center font-medium'>Track Your Moves</h2>
                </div>
                <div className='bg-gray-50 flex justify-center lg:justify-between items-center gap-8 flex-wrap p-[16px] mt-10'>
                    <div>
                        <div>
                            <h2 className='text-[30px] font-bold'>Hi Grace, Welcome to Dashboard</h2>
                            <div className='mt-4 flex gap-8 flex-wrap items-center justify-center'>
                                <div className='p-4 bg-gray-100 max-w-[340px]'>
                                    <div className='text-sm flex justify-between items-center'>
                                        <div className='flex gap-5 items-center'>
                                            <span>Ashley H.</span>
                                            <span className='bg-green-200 text-green-400  px-3 py-1 font-medium rounded-md'>Admin</span>
                                        </div>

                                        <span>2019/06/24</span>
                                    </div>
                                    <div className='grid grid-cols-2 gap-2 text-[12px] mt-3 ' >
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Manage User Accounts</span>
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Edit Company Info</span>
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> See Analytics</span>
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Export Data</span>
                                    </div>
                                </div>
                                <div className='p-4 bg-gray-100 max-w-[340px]'>
                                    <div className='text-sm flex justify-between items-center'>
                                        <div className='flex gap-5 items-center'>
                                            <span>Ashley H.</span>
                                            <span className='bg-blue-200 text-blue-500  px-3 py-1 font-medium rounded-md'>Admin</span>
                                        </div>

                                        <span>2019/06/24</span>
                                    </div>
                                    <div className='grid grid-cols-2 gap-2 text-[12px] mt-3 ' >
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Manage User Accounts</span>
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Edit Company Info</span>
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> See Analytics</span>
                                        <span className='flex items-center gap-2 text-gray-800'><IoMdCheckmark color='#15803d' /> Export Data</span>
                                    </div>
                                </div>
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
                            <h2 className='flex justify-center'>32454</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
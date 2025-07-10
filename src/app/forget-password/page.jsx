'use client'; // ✅ This tells Next.js to treat this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // ✅ Correct hook for App Router

const ForgetPassword = () => {
    const router = useRouter(); // ✅ For App Router use 'next/navigation'

    const handleNextClick = () => {
        router.push('/login');
    };

    const handleCancelClick = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white flex items-start justify-center pt-8" style={{ fontFamily: "Poppins, sans-serif" }}>
            <div className="flex w-full max-w-6xl min-h-[692px] md:min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Left: Image Section */}
                <div className="w-1/2 hidden md:block">
                    <img
                        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Login-earthbyhumans.jpeg"
                        alt="Login visual"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Right: Form Section */}
                <div className="w-full md:w-1/2 flex flex-col text-black justify-center px-8 py-12 lg:px-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontSize: "24px" }}>
                        Reset Your Password
                    </h2>

                    <form className="space-y-6">
                        <div>
                            <label className="block font-semibold mb-1 text-blue-700">Username or Email:</label>
                            <input
                                type="text"
                                placeholder="Enter your email or username"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleNextClick}
                                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                            >
                                Next
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-8 text-sm" style={{ fontSize: "16px" }}>
                        Sign Up If You Haven't Account?{' '}
                        <a href="/signup" className="text-blue-700 font-semibold hover:underline">
                            Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ForgetPasswordPage() {
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });
    const router = useRouter();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setStatus({ message: "Sending OTP...", type: 'loading' });
        try {
            const res = await fetch('/api/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrUsername: email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ message: data.message, type: 'success' });
                setStep(2);
            } else {
                setStatus({ message: data.message, type: 'error' });
            }
        } catch (err) {
            setStatus({ message: 'An error occurred.', type: 'error' });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setStatus({ message: "Resetting password...", type: 'loading' });
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ message: "Success! Redirecting to login...", type: 'success' });
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setStatus({ message: data.message, type: 'error' });
            }
        } catch (err) {
            setStatus({ message: 'An error occurred.', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center pt-8">
            <div className="flex w-full max-w-6xl min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="w-1/2 hidden md:block">
                    <Image src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Login-earthbyhumans.jpeg" alt="Visual" className="object-cover w-full h-full" priority/>
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 text-black">
                    <h2 className="text-3xl font-bold mb-8">Reset Your Password</h2>
                    
                    {/* Step 1: Email Form */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <p className="text-gray-600">Enter your email and we'll send you a code to reset your password.</p>
                            <div>
                                <label className="block font-semibold mb-1">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send OTP</button>
                        </form>
                    )}

                    {/* Step 2: OTP and New Password Form */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <p className="text-gray-600">Check your email for the OTP and enter it below along with your new password.</p>
                            <div>
                                <label className="block font-semibold mb-1">OTP Code</label>
                                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter the 6-digit code" maxLength="6" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                             <div>
                                <label className="block font-semibold mb-1">New Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your new password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Reset Password</button>
                        </form>
                    )}

                    {status.message && (
                        <p className={`mt-4 text-sm text-center font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {status.message}
                        </p>
                    )}
                </div>
            </div>
        </div>

    );
};
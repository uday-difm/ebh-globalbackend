"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (res.ok) {
        router.push('/'); // Redirect to homepage on successful login
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-8">
      <div className="flex w-full max-w-6xl min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Login-earthbyhumans.jpeg" alt="Login visual" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 text-black">
          <h2 className="text-3xl font-bold mb-8">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Email or Username</label>
              <input type="text" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required placeholder="Enter email/username" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end">
              <Link href="/forget-password" className="text-blue-700 text-sm font-medium hover:underline">Forgot Password?</Link>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded transition-colors hover:bg-green-700" style={{backgroundColor:"#54AE47"}}>Log In</button>
          </form>
          <div className="text-center mt-8 text-sm">
            Don’t have an account? <Link href="/signup" className="text-blue-700 font-semibold hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
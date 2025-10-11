"use client";

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/actions/action';
import { Loader } from '../../common/Loader';
import Image from 'next/image';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (res.ok) {
        // Fetch auth status after login
        const statusRes = await fetch('/api/auth/status');
        const statusData = await statusRes.json();

        if (statusData.isAuthenticated) {
          console.log('Dispatching setAuth with:', statusData);
          dispatch(setAuth(
            statusData.isAuthenticated,
            statusData.user?.id,
            statusData.user?.name,
            statusData.user?.profile,
            statusData.user?.username,
            statusData.user?.profession,
            statusData.user?.email,
            statusData.user?.bio
          ));
        }

        router.push('/'); // Redirect to homepage on successful login
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Sign In to Your Nature Hub Access | Earth by Humans</title>
      <meta name="description" content=" Log in to your Earth by Humans account to explore captivating nature videos, inspiring stories, and engaging quizzes. Your journey awaits!" />
      <meta name="keywords" content=" sign in, login, account, Earth by Humans, nature, conservation, environment, member, portal, access" />
      <meta property="og:description" content=" Log in to your Earth by Humans account to explore captivating nature videos, inspiring stories, and engaging quizzes. Your journey awaits!" />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div className="min-h-screen bg-white flex items-center justify-center pt-8">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <Loader />
          </div>
        )}
        <div className="flex w-full max-w-6xl min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="w-1/2 hidden md:block">
            <Image src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Login-earthbyhumans.jpeg" alt="Login visual" width={500} height={300} className="object-cover w-full h-full" priority />
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
              <div className="relative group overflow-hidden rounded-full cursor-pointer w-full">
                {/* Background color layer */}
                <div className="absolute inset-0 bg-green-600 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>

                {/* Blue animated sweeps */}
                <div className="absolute w-[180px] h-[220px] bg-blue-700 transform rotate-[35deg] transition-all duration-800 ease-in-out top-[-200%] left-[-90%] group-hover:left-0 z-10"></div>
                <div className="absolute w-[400px] h-[260px] bg-blue-700 transform rotate-[125deg] transition-all duration-800 ease-in-out top-[-120%] left-[100%] group-hover:left-[20%] z-10"></div>

                {/* Button */}
                <button
                  type="submit"
                  className="relative z-20 text-white font-bold py-2 px-5 text-sm rounded-full transition-colors duration-300 flex items-center justify-center w-full"
                >
                  Log In
                </button>
              </div>

            </form>
            <div className="text-center mt-8 text-sm">
              Don’t have an account? <Link href="/signup" className="text-blue-700 font-semibold hover:underline">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

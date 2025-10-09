'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/actions/action';
import { Link } from 'lucide-react';

const SignIn = () => {
  const [errors, setErrors] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');

    try {
      const res = await fetch('/api/dashboard/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const statusRes = await fetch('/api/dashboard/admin/status-admin');
        const statusData = await statusRes.json();

        if (statusData.isAuthenticated) {
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

          // ✅ Navigate *after* confirming auth
          router.push('/dashboard');
        } else {
          setErrors('Authentication failed. Please try again.');
        }
      } else {
        setErrors(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div
        className="relative h-[99.83vh] bg-cover mt-0 bg-center"
        style={{
          backgroundImage: "url('https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH%203_11zon.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gray bg-opacity-0 "></div>
        <div className="relative z-10 max-w-[90%] mx-auto">
          <div className="absolute inset-0 top-28 bg-black/30 rounded-lg h-[700px] -z-10"></div>

          <div className="flex flex-col mr-80 pt-80 justify-center items-center space-y-6">
            <h1 className="text-6xl font-bold text-center text-white">Visit Earth By Humans</h1>
            <p className="text-2xl text-center text-white">
              Explore Stories of Nature’s Wonders and Human Impact.
            </p>
            <div className="flex space-x-8">
              <Link
                href="https://earthbyhumans.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-64 py-6 bg-transparent border-4 border-white text-center text-white text-2xl font-semibold hover:bg-white hover:text-black transition duration-300"
              >
                Visit Website
              </Link>
              <Link
                href="https://earthbyhumans.com/blogs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-64 py-6 bg-transparent border-4 text-center border-white text-white text-2xl font-semibold hover:bg-white hover:text-black transition duration-300"
              >
                Visit Blogs
              </Link>
            </div>
            <Link
              href="https://earthbyhumans.com/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 py-4 bg-white hover:bg-[#45B05F] hover:text-white text-black text-lg font-semibold transition duration-300"
            >
              Contact us now
            </Link>
          </div>

          {/* Sign In Form */}
          <div className="absolute top-72 right-36 z-10 bg-white p-8 rounded-lg shadow-lg w-96">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    onChange={handleInput}
                    id="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#45B05F]"
                    placeholder="Enter your email"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">📧</span>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    onChange={handleInput}
                    id="password"
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#45B05F]"
                    placeholder="6+ Characters, 1 Capital letter"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">🔒</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#45B05F]" />
                  <span className="ml-2 text-sm text-gray-700">Remember Me</span>
                </label>
                <Link href="/password_reset" className="text-sm text-[#45B05F] hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 font-bold rounded-lg transition duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#3853A4] hover:bg-[#45B05F] text-white'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {errors && (
                <p className="text-red-500 text-sm mt-4 text-center">{errors}</p>
              )}
            </form>
          </div>

          <div className="absolute top-36 right-10 text-sm z-10">
            <p className="text-white hover:text-gray-300">Employee login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

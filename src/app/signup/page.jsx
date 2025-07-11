"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-8">
      <div className="flex w-full max-w-6xl min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Login-earthbyhumans.jpeg" alt="Signup visual" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 text-black">
          <h2 className="text-3xl font-bold mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Enter your First Name" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Enter your Last Name" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Enter your Username" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your Email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your Password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your Password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded transition-colors hover:bg-green-700" style={{ backgroundColor: "#54AE47" }}>Sign Up</button>
          </form>
          <div className="text-center mt-6 text-sm">
            Already have an account? <Link href="/login" className="text-blue-700 font-semibold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
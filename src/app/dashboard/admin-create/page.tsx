'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import DashboardLayout from '../../../component/DashboardLayout';
import { baseUrl } from '../../../lib/config';

// Define types for the form state
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface ApiResponse {
  message: string;
}

export default function CreateAdminPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '1', // Default role to 'Admin'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setPasswordMatch(false);
      setLoading(false);
      return;
    }

    setPasswordMatch(true);
    const roleValue = parseInt(form.role) || 1; // default fallback to Admin

    try {
      const response = await fetch(`${baseUrl}/api/dashboard/admin/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: roleValue,
          image: '', // Optional image, or add file upload if needed
        }),
      });

      const result: ApiResponse = await response.json();

      if (response.status === 201) {
        setMessage('Admin created successfully!');
        setForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '1', // reset to Admin
        });
      } else {
        setMessage(result.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('API error:', error);
      setMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
        <div className="max-w-lg w-full p-8 bg-white shadow-2xl rounded-lg border border-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Create Admin</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Role Selection */}
            <div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300"
              >
                <option value="1">Admin</option>
                <option value="2">Super Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>

            {/* Password Match Error Message */}
            {!passwordMatch && (
              <p className="text-red-500 text-sm text-center">
                Passwords do not match!
              </p>
            )}

            {/* Success/Error Message */}
            {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

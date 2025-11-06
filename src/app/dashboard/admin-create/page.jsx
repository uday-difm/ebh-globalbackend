'use client';

import { useState } from 'react';
import DashboardLayout from '../../../component/DashboardLayout';

export default function CreateAdminPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Contributor', // Default to 'Contributor'
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validate password match
        if (form.password !== form.confirmPassword) {
            setPasswordMatch(false);
            setLoading(false);
            return;
        }
        
        setPasswordMatch(true); // Reset password match error state

        try {
            const response = await fetch(`/api/dashboard/admin/add-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role, // Role selected by the user
                    image: '', // Optional image field; can be updated with file upload logic
                }),
            });

            const result = await response.json();

            if (response.status === 201) {
                setMessage('Admin created successfully!');
                setForm({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'Contributor', // Reset role to default 'Contributor'
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
                                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
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
                                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
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
                                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
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
                                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
                            >
                                <option value="Administrator">Administrator</option>
                                <option value="Subscriber">Subscriber</option>
                                <option value="SEO Editor">SEO Editor</option>
                                <option value="SEO Manager">SEO Manager</option>
                                <option value="Contributor">Contributor</option>
                                <option value="Author">Author</option>
                                <option value="Editor">Editor</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded bg-green-600 hover:bg-green-600 py-2 px-6 text-white hover:bg-opacity-90"
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

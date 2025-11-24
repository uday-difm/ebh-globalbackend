'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '../../../../component/DashboardLayout'

export default function UpdateAdminPage() {
    const params = useParams();
    const id = params.id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchAdmin() {
            if (!id) return;

            try {
                const res = await fetch(`/api/dashboard/admin/getuser/${id}`);
                const data = await res.json();
                console.log("GET API Response:", data);

                if (res.ok) {
                    const user = data.user;
                    setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        role: user.role || '',
                        bio: user.bio || '',
                        facebook: user['facebook'] || '',
                        twitter: user['twitter'] || '',
                        linkedin: user['linkedin'] || '',
                        instagram: user['instagram'] || ''
                    });
                } else {
                    setMessage(data.message || 'Failed to fetch admin data');
                }
            } catch (err) {
                console.error(err);
                setMessage('Error fetching admin data');
            } finally {
                setFetching(false);
            }
        }

        fetchAdmin();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`/api/dashboard/admin/update-user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("PUT API Response:", data);
            setMessage(data.message);
        } catch (err) {
            console.error(err);
            setMessage('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <DashboardLayout>
                <p className="text-center mt-20">Loading admin data...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
                <div className="max-w-6xl w-full p-8 bg-white shadow-2xl rounded-lg border border-gray-200">
                    <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Update Admin</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1: Name & Email */}
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300"
                            />
                        </div>

                        {/* Row 2: Role & Bio */}
                        <div className="flex gap-4">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300"
                            >
                                <option value="Administrator">Administrator</option>
                                <option value="Subscriber">Subscriber</option>
                                <option value="SEO Editor">SEO Editor</option>
                                <option value="SEO Manager">SEO Manager</option>
                                <option value="Contributor">Contributor</option>
                                <option value="Author">Author</option>
                                <option value="Editor">Editor</option>
                            </select>

                            <textarea
                                name="bio"
                                placeholder="Bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={1}
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300"
                            />
                        </div>

                        {/* Row 3: Facebook & Twitter */}
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="facebook"
                                placeholder="Facebook URL"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all duration-300"
                            />
                            <input
                                type="text"
                                name="twitter"
                                placeholder="Twitter URL"
                                value={formData.twitter}
                                onChange={handleChange}
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
                            />
                        </div>

                        {/* Row 4: LinkedIn & Instagram */}
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn URL"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-700 focus:outline-none transition-all duration-300"
                            />
                            <input
                                type="text"
                                name="instagram"
                                placeholder="Instagram URL"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-1/2 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-400 focus:outline-none transition-all duration-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded bg-green-500 hover:bg-green-600 py-2 px-6 text-white hover:bg-opacity-90"
                        >
                            {loading ? 'Updating...' : 'Update Admin'}
                        </button>

                        {message && (
                            <p className="mt-4 text-sm text-center text-gray-600">{message}</p>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
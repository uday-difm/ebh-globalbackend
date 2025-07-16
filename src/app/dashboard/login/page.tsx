'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const SignIn = () => {
    const [errors, setErrors] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Enable cookies for cross-origin (only if necessary)
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
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
                router.push('/dashboard');
            } else {
                setErrors(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setErrors('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-md border border-white/30">
                <h2 className="text-3xl font-bold mb-6 text-center">Admin Sign In</h2>

                <label className="block mb-3 text-sm">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 w-full px-4 py-2 rounded bg-white/80 text-black border border-gray-400"
                    />
                </label>

                <label className="block mb-4 text-sm">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 w-full px-4 py-2 rounded bg-white/80 text-black border border-gray-400"
                    />
                </label>

                {errors && <p className="text-red-400 mb-4 text-sm">{errors}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition duration-300"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default SignIn;

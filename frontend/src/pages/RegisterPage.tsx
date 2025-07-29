// src/pages/RegisterPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import productivityImage from '/src/assets/productivity-image.jpg'; // ใช้ Absolute Path เพื่อความแน่นอน

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            const msg = "Passwords do not match!";
            setError(msg);
            toast.error(msg);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await api.post('/auth/register', { email, password });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:grid lg:grid-cols-2">

            {/* === Left Side: Form === */}
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h1 className="text-center text-4xl font-bold text-blue-600 dark:text-blue-400">
                           TodoApp
                        </h1>
                        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                           Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Or{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                sign in to your existing account
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 lg:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* --- เติม Input Fields ที่ขาดไป --- */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                                <div className="mt-1">
                                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm ..."/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <div className="mt-1">
                                    <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm ..."/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                <div className="mt-1">
                                    <input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm ..."/>
                                </div>
                            </div>
                            {/* ---------------------------------- */}

                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading 
                                        ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> 
                                        : <><UserPlus className="mr-2 h-5 w-5" />Create Account</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

             {/* === Right Side: Image (Hidden on small screens) === */}
             <div className="hidden lg:block relative">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={productivityImage}
                    alt="A person organizing tasks on a board"
                />
                {/* ใช้ Overlay สีดำโปร่งแสง แทนการผสมหลาย class */}
                <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

                 <div className="relative p-12 text-white flex flex-col justify-center h-full">
                     <h2 className="text-4xl font-extrabold">Start fresh.</h2>
                     <p className="mt-4 text-xl opacity-90">
                         A clear space for your thoughts, plans, and goals. All in one place.
                     </p>
                </div>
            </div>
        </div>
    );
}

// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import productivityImage from '/src/assets/productivity-image.jpg'; // 1. Import รูปภาพ

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data);
            toast.success(`Welcome back, ${response.data.email}!`);
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            toast.error(errorMessage);
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
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Or{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                create your account now
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 lg:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ... Input fields (เหมือนเดิม) ... */}
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                                <div className="mt-1"><input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border ..."/></div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <div className="mt-1"><input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border ..."/></div>
                            </div>

                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                            <div>
                                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 ...">
                                    {isLoading ? <div className="animate-spin ..."></div> : <><LogIn className="mr-2 h-5 w-5" />Sign In</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* === Right Side: Image (Hidden on small screens) === */}
            <div className="hidden lg:block relative">
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-70" 
                    src={productivityImage}
                    alt="A person organizing tasks on a board"
                />
                <div className="absolute inset-0 bg-blue-700 mix-blend-multiply" aria-hidden="true" />
                <div className="relative p-12 text-white flex flex-col justify-center h-full">
                     <h2 className="text-4xl font-extrabold">Organize your life.</h2>
                     <p className="mt-4 text-xl opacity-80">
                         From daily chores to life's biggest projects, TodoApp helps you get it all done.
                     </p>
                </div>
            </div>
        </div>
    );
}
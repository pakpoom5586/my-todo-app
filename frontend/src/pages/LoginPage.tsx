// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import productivityImage from '/src/assets/productivity-image.jpg';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 lg:grid lg:grid-cols-2">
            
            {/* === Left Side: Form === */}
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10" />
                
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-600/25 mb-6">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Achievo
                        </h1>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            ยินดีต้อนรับ
                        </h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            ยังไม่มีบัญชีใช่ไหม?{' '}
                            <Link 
                                to="/register" 
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                            >
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 lg:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    อีเมล
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white transition-all duration-200"
                                        placeholder="กรอกอีเมล์ของคุณ"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    รหัสผ่าน
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white transition-all duration-200"
                                        placeholder="กรอกรหัสผ่านของคุณ"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-5 w-5" />
                                        เข้าสู่ระบบ
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* === Right Side: Image === */}
            <div className="hidden lg:block relative overflow-hidden rounded-l-3xl">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={productivityImage}
                    alt="A person organizing tasks on a board"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-800/80" />
                <div className="relative p-12 text-white flex flex-col justify-center h-full">
                    <h2 className="text-5xl font-bold mb-6 leading-tight">
                        จัดระเบียบชีวิตของคุณได้อย่างง่ายดาย
                    </h2>
                    <p className="text-xl opacity-90 leading-relaxed">
                        ไม่ว่าจะเป็นงานประจำวันหรือโปรเจ็กต์ใหญ่ Achievo จะช่วยให้คุณทำงานได้อย่างมีประสิทธิภาพและมุ่งเน้นไปที่สิ่งที่สำคัญที่สุด
                    </p>
                </div>
            </div>
        </div>
    );
}
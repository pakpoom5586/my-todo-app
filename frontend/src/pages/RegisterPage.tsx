// src/pages/RegisterPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import productivityImage from '/src/assets/productivity-image.jpg';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            toast.success('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
            navigate('/login');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'การลงทะเบียนล้มเหลว';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, text: '', color: '' };
        if (password.length < 6) return { strength: 1, text: 'Weak', color: 'text-red-500' };
        if (password.length < 10) return { strength: 2, text: 'Medium', color: 'text-yellow-500' };
        return { strength: 3, text: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 lg:grid lg:grid-cols-2">

            {/* === Left Side: Form === */}
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 dark:from-purple-600/10 dark:to-blue-600/10" />
                
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl shadow-purple-600/25 mb-6">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Achievo
                        </h1>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                           สร้างบัญชีของคุณ
                        </h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            มีบัญชีอยู่แล้วใช่ไหม?{' '}
                            <Link 
                                to="/login" 
                                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 transition-colors"
                            >
                                ลงชื่อเข้าใช้ที่นี่
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 lg:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    ที่อยู่อีเมล
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                      className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white transition-all duration-200"
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
                                       type={showPassword ? 'text' : 'password'}
                                       required
                                       minLength={6}
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       placeholder="6+ characters"
                                       className="w-full pl-12 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white transition-all duration-200"
                                   />
                                   <button
                                       type="button"
                                       onClick={() => setShowPassword(!showPassword)}
                                       className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                   >
                                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                   </button>
                               </div>
                               
                               {/* Password Strength Indicator */}
                               {password && (
                                   <div className="mt-2">
                                       <div className="flex items-center justify-between mb-1">
                                           <span className="text-xs text-slate-500 dark:text-slate-400">ระดับความปลอดภัยรหัสผ่าน</span>
                                           <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                               {passwordStrength.text}
                                           </span>
                                       </div>
                                       <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                           <div
                                               className={`h-2 rounded-full transition-all duration-300 ${
                                                   passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                                                   passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                                                   passwordStrength.strength === 3 ? 'bg-green-500 w-full' : 'w-0'
                                               }`}
                                           />
                                       </div>
                                   </div>
                               )}
                           </div>

                           {/* Confirm Password Field */}
                           <div className="space-y-2">
                               <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                   ยืนยันรหัสผ่าน
                               </label>
                               <div className="relative">
                                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                       <Shield className="h-5 w-5 text-slate-400" />
                                   </div>
                                   <input
                                       id="confirm-password"
                                       type={showConfirmPassword ? 'text' : 'password'}
                                       required
                                       value={confirmPassword}
                                       onChange={(e) => setConfirmPassword(e.target.value)}
                                       placeholder="Repeat your password"
                                       className={`w-full pl-12 pr-12 py-3 border rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white transition-all duration-200 ${
                                           confirmPassword && password !== confirmPassword 
                                               ? 'border-red-300 dark:border-red-600' 
                                               : 'border-slate-300 dark:border-slate-600'
                                       }`}
                                   />
                                   <button
                                       type="button"
                                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                       className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                   >
                                       {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                   </button>
                               </div>
                               
                               {/* Password Match Indicator */}
                               {confirmPassword && (
                                   <div className="flex items-center mt-2">
                                       <div className={`w-2 h-2 rounded-full mr-2 ${
                                           password === confirmPassword ? 'bg-green-500' : 'bg-red-500'
                                       }`} />
                                       <span className={`text-xs ${
                                           password === confirmPassword 
                                               ? 'text-green-600 dark:text-green-400' 
                                               : 'text-red-600 dark:text-red-400'
                                       }`}>
                                           {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                       </span>
                                   </div>
                               )}
                           </div>

                           {error && (
                               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                   <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                               </div>
                           )}

                           <button
                               type="submit"
                               disabled={isLoading || password !== confirmPassword}
                               className="w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-medium shadow-xl shadow-purple-600/25 hover:shadow-2xl hover:shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
                           >
                               {isLoading ? (
                                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                               ) : (
                                   <>
                                       <UserPlus className="mr-2 h-5 w-5" />
                                       สมัครสมาชิก
                                   </>
                               )}
                           </button>

                           {/* Terms and Privacy */}
                           <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                               โดยการสร้างบัญชี คุณยอมรับข้อตกลงของเรา{' '}
                               <a href="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400">
                                   เงื่อนไขการบริการ
                               </a>{' '}
                               และ{' '}
                               <a href="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400">
                                  นโยบายความเป็นส่วนตัว
                               </a>
                           </p>
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
               <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-blue-800/80" />

                <div className="relative p-12 text-white flex flex-col justify-center h-full">
                    <h2 className="text-5xl font-bold mb-6 leading-tight">
                       เริ่มต้นการเดินทางสู่ประสิทธิภาพการทำงานของคุณ
                    </h2>
                    <p className="text-xl opacity-90 leading-relaxed mb-8">
                        เข้าร่วมกับผู้ใช้หลายคนที่ได้เปลี่ยนเวิร์กโฟลว์ประจำวันของตนด้วยระบบจัดการงานที่ใช้งานง่ายของเรา
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="space-y-4">
                       <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                               <div className="w-2 h-2 bg-white rounded-full" />
                           </div>
                           <span className="text-sm opacity-90">การจัดการงานแบบลากและวาง</span>
                       </div>
                       <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                               <div className="w-2 h-2 bg-white rounded-full" />
                           </div>
                           <span className="text-sm opacity-90">ระบบจัดหมวดหมู่</span>
                       </div>
                       <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                               <div className="w-2 h-2 bg-white rounded-full" />
                           </div>
                           <span className="text-sm opacity-90">ความร่วมมือแบบเรียลไทม์</span>
                       </div>
                    </div>
               </div>
           </div>
       </div>
   );
}
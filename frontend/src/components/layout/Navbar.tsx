// src/components/layout/Navbar.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { LogOut, Sun, Moon, User, CheckSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            setIsLoggingOut(true);
            try {
                await api.post('/auth/logout');
                setUser(null);
                navigate('/login');
            } catch (error) {
                console.error('Logout failed', error);
                setUser(null);
                navigate('/login');
            } finally {
                setIsLoggingOut(false);
            }
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <CheckSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                                Achievo
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">ทุกเรื่องสำคัญ เรียงร้อยเป็นระเบียบ</p>
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3">
                        {/* User Info */}
                        {user && (
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">ยินดีต้อนรับกลับ</p>
                                    <p className="text-gray-600 dark:text-gray-400 -mt-0.5">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="group relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                            aria-label="Toggle theme"
                        >
                            <div className="relative">
                                {theme === 'light' ? (
                                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform group-hover:rotate-12" />
                                ) : (
                                    <Sun className="h-5 w-5 text-yellow-500 transition-transform group-hover:rotate-12" />
                                )}
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                            </div>
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="group relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            )}
                            <span className="hidden sm:inline">
                                {isLoggingOut ? 'Logging out...' : 'ออกจากระบบ'}
                            </span>
                            
                            {/* Tooltip for mobile */}
                            <div className="sm:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Logout
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
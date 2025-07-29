// src/components/layout/Navbar.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
export default function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme(); 
    // สมมติว่ามี theme state
    const isDarkMode = document.documentElement.classList.contains('dark');

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            try {
                await api.post('/auth/logout');
                // เคลียร์ข้อมูล user ใน context
                setUser(null); 
                // ส่งผู้ใช้กลับไปหน้า Login
                navigate('/login');
            } catch (error) {
                console.error('Logout failed', error);
                // อาจจะบังคับ logout ที่ฝั่ง client เลยก็ได้
                setUser(null);
                navigate('/login');
            }
        }
    };
    



    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex items-center justify-between h-16">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">TodoApp</span>
                    <div className="flex items-center space-x-4">
                        {user && <span className="hidden sm:block text-gray-800 dark:text-gray-200">Welcome, {user.email}</span>}
                       <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                            ) : (
                                <Sun className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                        >
                            <LogOut size={16} className="mr-2"/>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
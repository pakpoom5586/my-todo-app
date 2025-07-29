// src/context/AuthContext.tsx
import { createContext, useState, useContext,  useEffect } from 'react';
import api from '../lib/api';
import type { ReactNode } from 'react';
interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // เช็คสถานะ login ตอนเปิดแอปครั้งแรก
        const checkUserStatus = async () => {
            try {
                // สร้าง endpoint 'me' ใน backend เพื่อเช็ค token
                const response = await api.get('/auth/me'); 
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
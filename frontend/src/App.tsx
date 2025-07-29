// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/auth/PrivateRoute';
// import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/layout/MainLayout';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
             <Route path="/register" element={<RegisterPage />} />
            {/* Private Routes Wrapper */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}> {/* <--- ครอบด้วย Layout */}
                    <Route path="/" element={<DashboardPage />} />
                    {/* หน้าอื่นๆ ที่ต้อง login ก็ใส่ไว้ในนี้ */}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
// src/components/auth/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from "../ui/Spinner";
const PrivateRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // หรือใส่ Spinner สวยๆ
        <Spinner />
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
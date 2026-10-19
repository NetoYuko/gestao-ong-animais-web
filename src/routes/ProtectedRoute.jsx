import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>; 
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
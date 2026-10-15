import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userString = localStorage.getItem(STORAGE_KEYS.USER);
  const user = userString ? JSON.parse(userString) : null;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
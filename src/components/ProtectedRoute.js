import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

/**
 * ProtectedRoute component for restricting access to authenticated users only.
 * Redirects to login if user is not authenticated.
 */
const ProtectedRoute = () => {
  const isAuthenticated = authService.isLoggedIn();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children routes
  return <Outlet />;
};

export default ProtectedRoute; 
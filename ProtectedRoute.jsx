import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Route Guard requiring authentication and matching user roles.
 * @param {Array<string>} allowedRoles - e.g. ['admin'] or ['student']
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        <p className="mt-4 text-sm font-medium text-slate-500">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are mandated, enforce them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If student attempts to access admin area, send to student dashboard
    if (user?.role === 'student') {
      return <Navigate to="/dashboard" replace />;
    }
    // If admin attempts to access student-only area, send to admin dashboard
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

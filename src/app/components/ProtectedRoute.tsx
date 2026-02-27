import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  role: 'student' | 'admin';
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'student' && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

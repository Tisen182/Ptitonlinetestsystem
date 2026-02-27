import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExamPage } from './pages/ExamPage';
import { ResultsPage } from './pages/ResultsPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ExamManagePage } from './pages/admin/ExamManagePage';
import { ExamFormPage } from './pages/admin/ExamFormPage';
import { StatisticsPage } from './pages/admin/StatisticsPage';
import { StudentResultsPage } from './pages/admin/StudentResultsPage';
import { UsersManagePage } from './pages/admin/UsersManagePage';
import { AdminLayout } from './components/AdminLayout';
import { UserLayout } from './components/UserLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute role="student">
        <UserLayout>
          <DashboardPage />
        </UserLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exam/:id',
    element: (
      <ProtectedRoute role="student">
        <ExamPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results/:id',
    element: (
      <ProtectedRoute role="student">
        <UserLayout>
          <ResultsPage />
        </UserLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'exams', element: <ExamManagePage /> },
      { path: 'exams/create', element: <ExamFormPage /> },
      { path: 'exams/:id/edit', element: <ExamFormPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'students', element: <StudentResultsPage /> },
      { path: 'users', element: <UsersManagePage /> },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4" style={{ fontWeight: 800, color: '#C8102E' }}>404</div>
          <p className="text-gray-500 mb-4">Page not found.</p>
          <a href="/login" className="bg-[#C8102E] text-white px-4 py-2 rounded-lg text-sm">Go Home</a>
        </div>
      </div>
    ),
  },
]);

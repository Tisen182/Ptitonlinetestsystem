import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/exams', icon: BookOpen, label: 'Manage Exams' },
  { path: '/admin/statistics', icon: BarChart3, label: 'Statistics' },
  { path: '/admin/students', icon: GraduationCap, label: 'Student Results' },
  { path: '/admin/users', icon: Users, label: 'Manage Users' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-rose-800">
        <div className="flex items-center gap-3">
          <div className="bg-[#C8102E] rounded-lg p-2">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white" style={{ fontWeight: 700 }}>PTIT Admin</div>
            <div className="text-rose-300 text-xs">Online Test System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                isActive
                  ? 'bg-[#C8102E] text-white'
                  : 'text-rose-200 hover:bg-rose-800/30 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 border-t border-rose-800">
        {user && (
          <div className="mb-3 px-2">
            <div className="text-white text-sm">{user.fullName}</div>
            <div className="text-rose-300 text-xs">{user.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-rose-200 hover:bg-[#C8102E] hover:text-white transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#9F1239] shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#9F1239] z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#9F1239] text-white px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span style={{ fontWeight: 700 }}>PTIT Admin</span>
          <button onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
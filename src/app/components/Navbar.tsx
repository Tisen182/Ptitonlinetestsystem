import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, BookOpen } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#9F1239] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-[#C8102E] rounded-lg p-1.5">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg text-white" style={{ fontWeight: 700 }}>PTIT</span>
              <span className="text-sm text-rose-200 ml-2 hidden sm:inline">Online Test System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-rose-200 hover:text-white transition-colors text-sm">
              Exams
            </Link>
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-rose-900/40 rounded-full px-3 py-1.5">
                  <div className="bg-[#C8102E] rounded-full p-1">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-sm">
                    <span className="text-white">{user.fullName}</span>
                    {user.studentId && (
                      <span className="text-rose-300 ml-1.5 text-xs">({user.studentId})</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#a00d24] px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#7D0F30] px-4 py-3 space-y-3">
          <Link to="/dashboard" className="block text-rose-200 hover:text-white py-1" onClick={() => setMobileOpen(false)}>
            Exams
          </Link>
          {user && (
            <>
              <div className="text-sm text-rose-300">
                {user.fullName} {user.studentId && `(${user.studentId})`}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-[#C8102E] px-3 py-1.5 rounded-lg text-sm text-white w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, BookOpen, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('ptit_current_user') || 'null');
      if (storedUser?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#9F1239] to-[#BE123C] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-white" />
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border-4 border-white" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="bg-[#C8102E] rounded-2xl p-5 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>PTIT Online Test</h1>
          <p className="text-rose-200 text-lg mb-8">Posts and Telecommunications Institute of Technology</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl text-[#FFB81C]" style={{ fontWeight: 700 }}>500+</div>
              <div className="text-rose-200 text-sm">Students</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl text-[#FFB81C]" style={{ fontWeight: 700 }}>50+</div>
              <div className="text-rose-200 text-sm">Exams</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl text-[#FFB81C]" style={{ fontWeight: 700 }}>98%</div>
              <div className="text-rose-200 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="bg-[#C8102E] rounded-2xl p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[#9F1239]" style={{ fontWeight: 800 }}>PTIT Online Test</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-[#9F1239] mb-1" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Welcome Back</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to your PTIT account</p>

            {apiError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter your username"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9F1239]/30 transition ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#9F1239]/30 transition ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C8102E] hover:bg-[#a00d24] text-white rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60 mt-2"
                style={{ fontWeight: 600 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">Don't have an account? </span>
              <Link to="/register" className="text-[#C8102E] hover:underline text-sm" style={{ fontWeight: 600 }}>
                Register here
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-2">Demo accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setForm({ username: 'student1', password: 'password123' })}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg px-3 py-2 transition-colors"
                >
                  👤 Student: student1 / password123
                </button>
                <button
                  onClick={() => setForm({ username: 'admin', password: 'admin123' })}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-lg px-3 py-2 transition-colors"
                >
                  🔑 Admin: admin / admin123
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
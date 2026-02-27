import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, BookOpen, AlertCircle, ShieldCheck } from 'lucide-react';

export function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (user?.role === 'student') navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.password) e.password = 'Password is required.';
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
      const stored = JSON.parse(localStorage.getItem('ptit_current_user') || 'null');
      if (stored?.role !== 'admin') {
        setApiError('This account does not have administrator privileges.');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00205B] to-[#001540] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/5" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border border-white/5" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full border border-white/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top banner */}
          <div className="bg-gradient-to-r from-[#C8102E] to-[#8B0000] px-8 py-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-white/20 rounded-lg p-2">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-white" style={{ fontWeight: 800 }}>Admin Portal</h1>
            <p className="text-red-200 text-sm">PTIT Online Test System</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-gray-800 mb-1" style={{ fontWeight: 700 }}>Administrator Sign In</h2>
            <p className="text-gray-500 text-sm mb-6">Access restricted to authorized administrators only.</p>

            {apiError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Admin Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter admin username"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
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
                    placeholder="Enter admin password"
                    className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 transition ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
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
                className="w-full bg-[#C8102E] hover:bg-[#a00d24] text-white rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setForm({ username: 'admin', password: 'admin123' })}
                className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg px-3 py-2 transition-colors"
              >
                Demo: admin / admin123
              </button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-4">
              Not an admin?{' '}
              <a href="/login" className="text-[#00205B] hover:underline">Student Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
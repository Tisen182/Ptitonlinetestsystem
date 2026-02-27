import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.username.trim()) e.username = 'Username is required.';
    else if (form.username.length < 3) e.username = 'Username must be at least 3 characters.';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Username can only contain letters, numbers, underscores.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
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
    const result = register(form.username, form.email, form.password, form.fullName);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setApiError(result.message);
    }
  };

  const Field = ({
    label, name, type = 'text', placeholder, showToggle, onToggle, show,
  }: {
    label: string; name: string; type?: string; placeholder: string;
    showToggle?: boolean; onToggle?: () => void; show?: boolean;
  }) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <input
          type={showToggle ? (show ? 'text' : 'password') : type}
          value={form[name as keyof typeof form]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9F1239]/30 transition ${
            errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
          } ${showToggle ? 'pr-10' : ''}`}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#C8102E] to-[#8B0000] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-4 border-white" />
          <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full border-4 border-white" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="bg-[#9F1239] rounded-2xl p-5 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>Join PTIT</h1>
          <p className="text-red-200 text-lg mb-8">Create your student account and start your learning journey</p>
          <ul className="space-y-3 text-left">
            {['Access all practice exams for free', 'Track your progress and scores', 'Review detailed answer explanations', 'Participate in scheduled exams'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-red-100 text-sm">
                <CheckCircle className="w-4 h-4 text-[#FFB81C] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {success ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700 }}>Registration Successful!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-[#9F1239] mb-1" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Create Account</h2>
              <p className="text-gray-500 text-sm mb-6">Register for PTIT Online Test System</p>

              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Field label="Full Name" name="fullName" placeholder="Enter your full name" />
                <Field label="Username" name="username" placeholder="Choose a username" />
                <Field label="Email Address" name="email" type="email" placeholder="your.email@ptit.edu.vn" />
                <Field
                  label="Password" name="password" type="password" placeholder="At least 6 characters"
                  showToggle onToggle={() => setShowPwd(!showPwd)} show={showPwd}
                />
                <Field
                  label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter your password"
                  showToggle onToggle={() => setShowConfirm(!showConfirm)} show={showConfirm}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C8102E] hover:bg-[#a00d24] text-white rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60 mt-2"
                  style={{ fontWeight: 600 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-[#C8102E] hover:underline" style={{ fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
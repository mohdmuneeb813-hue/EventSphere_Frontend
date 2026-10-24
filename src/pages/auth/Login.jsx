import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      const redirectPath =
        location.state?.from?.pathname ||
        (user.role === 'admin'
          ? '/admin'
          : user.role === 'exhibitor'
            ? '/exhibitor'
            : '/attendee');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#221A15]">Sign in to your portal</h2>
        <p className="text-xs text-[#6E5D50] mt-1">
          Welcome back! Access your personalized exhibition portal.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#5A4B40]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#A4512D] hover:text-[#8C3F1F] transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#A4512D]/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#E8DFD5] text-center space-y-2">
        <p className="text-xs text-[#6E5D50]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#A4512D] hover:text-[#8C3F1F] transition"
          >
            Create one now
          </Link>
        </p>
        <p>
          <Link
            to="/"
            className="text-[11px] text-[#8C7A6B] hover:text-[#A4512D] font-medium transition inline-flex items-center space-x-1"
          >
            <span>← Return to Home</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;



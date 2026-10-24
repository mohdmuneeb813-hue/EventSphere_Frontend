import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim(), newPassword);
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#221A15]">Set New Password</h2>
        <p className="text-xs text-[#6E5D50] mt-1">
          Create a secure new password for your account.
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
            Registered Email
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
          <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#E8DFD5] text-center">
        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-[#A4512D] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;

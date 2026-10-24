import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Navigate directly to reset-password with email pre-filled
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#A4512D]/10 text-[#A4512D] flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#221A15]">Forgot Password?</h2>
        <p className="text-xs text-[#6E5D50] mt-1">
          Enter your registered email address to set a new password.
        </p>
      </div>

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

        <button
          type="submit"
          className="w-full py-3 px-4 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#A4512D]/20 transition flex items-center justify-center space-x-2"
        >
          <span>Continue to Reset</span>
          <ArrowRight className="w-4 h-4" />
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

export default ForgotPassword;

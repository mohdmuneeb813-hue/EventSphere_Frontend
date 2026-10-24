import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Building2,
  Package,
  FileText,
  ArrowRight,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Public self-registration is limited to these two roles.
  // Admin ("Organizer") accounts can only be created via the bootstrap path
  // (when zero admins exist) or by an existing admin via the API — both
  // enforced on the backend in routes/authRoutes.js.
  const [role, setRole] = useState('attendee'); // 'attendee' | 'exhibitor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    productsOrServices: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
      };

      if (role === 'exhibitor') {
        payload.companyDetails = {
          companyName: formData.companyName.trim(),
          productsOrServices: formData.productsOrServices.trim(),
          description: formData.description.trim(),
        };
      }

      await register(payload);
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#221A15]">Create an Account</h2>
        <p className="text-xs text-[#6E5D50] mt-1">
          Join EventSphere to discover, exhibit, or organize expos.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Role Selection — Attendee or Exhibitor only.
          The "Organizer" (admin) tab has been removed from this public
          registration form. Admin accounts can only be created via the
          backend's bootstrap path (when zero admins exist) or by an
          existing admin via the API; both are enforced in authRoutes.js. */}
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C7A6B] mb-2">
          I am signing up as
        </p>
        <div className="bg-[#F5EFEB] p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 border border-[#E8DFD5]">
          <button
            type="button"
            onClick={() => setRole('attendee')}
            className={`py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 text-left ${
              role === 'attendee'
                ? 'bg-[#A4512D] text-white shadow-sm'
                : 'text-[#6E5D50] hover:text-[#221A15] hover:bg-white/60'
            }`}
          >
            <Ticket className={`w-4 h-4 flex-shrink-0 ${role === 'attendee' ? 'text-white' : 'text-[#A4512D]'}`} />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold">Attendee</span>
              <span className={`text-[10px] font-normal ${role === 'attendee' ? 'text-white/85' : 'text-[#8C7A6B]'}`}>
                Visit expos & book passes
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setRole('exhibitor')}
            className={`py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 text-left ${
              role === 'exhibitor'
                ? 'bg-[#A4512D] text-white shadow-sm'
                : 'text-[#6E5D50] hover:text-[#221A15] hover:bg-white/60'
            }`}
          >
            <Building2 className={`w-4 h-4 flex-shrink-0 ${role === 'exhibitor' ? 'text-white' : 'text-[#A4512D]'}`} />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold">Exhibitor</span>
              <span className={`text-[10px] font-normal ${role === 'exhibitor' ? 'text-white/85' : 'text-[#8C7A6B]'}`}>
                Reserve booths & showcase
              </span>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Khan"
              required
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@example.com"
              required
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
            />
          </div>
        </div>

        {/* Exhibitor Specific Fields */}
        {role === 'exhibitor' && (
          <div className="p-3.5 bg-[#F5EFEB] rounded-2xl border border-[#E8DFD5] space-y-3 animate-in fade-in duration-200">
            <p className="text-xs font-bold text-[#A4512D] uppercase tracking-wider">
              Company & Exhibition Details
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A4B40] mb-1">
                Company / Organization Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Apex Technologies Ltd."
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8C9BB] rounded-xl text-[#221A15] focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A4B40] mb-1">
                Products or Services Offered
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="productsOrServices"
                  value={formData.productsOrServices}
                  onChange={handleChange}
                  placeholder="AI Analytics & Hardware Solutions"
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8C9BB] rounded-xl text-[#221A15] focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A4B40] mb-1">
                Company Description
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-3" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short overview for expo booth visitors..."
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8C9BB] rounded-xl text-[#221A15] focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D]"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A4B40] mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF7F2] border border-[#D8C9BB] rounded-xl text-[#221A15] focus:bg-white focus:outline-none focus:border-[#A4512D] focus:ring-1 focus:ring-[#A4512D] transition"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#A4512D]/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#E8DFD5] text-center space-y-2">
        <p className="text-xs text-[#6E5D50]">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-bold text-[#A4512D] hover:text-[#8C3F1F] transition"
          >
            Sign in here
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

export default Register;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Unauthorized = () => {
  const { user } = useAuth();

  const homeLink =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'exhibitor'
      ? '/exhibitor'
      : '/attendee';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">403 Forbidden</h1>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Access Denied</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        You do not have administrative permission to view this section with your current role ({user?.role || 'Guest'}).
      </p>
      <Link
        to={homeLink}
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-terracotta-600 text-white text-sm font-semibold rounded-xl hover:bg-terracotta-700 transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to your portal</span>
      </Link>
    </div>
  );
};

export default Unauthorized;

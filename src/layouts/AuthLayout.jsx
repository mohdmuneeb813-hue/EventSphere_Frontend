import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-[#A4512D] selection:text-white">
      {/* Decorative ambient warmth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A4512D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2F3A2A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        {/* Brand Emblem */}
        <Link to="/" className="inline-flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-full bg-[#A4512D] flex items-center justify-center text-white shadow-lg shadow-[#A4512D]/20 group-hover:scale-105 transition-transform">
            <span className="font-serif text-2xl font-bold italic">E</span>
          </div>
          <div className="text-left">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#221A15]">
              EXPO<span className="text-[#A4512D]">SPHERE</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-[#8C7A6B] font-semibold -mt-1">
              Exhibitions & Management
            </span>
          </div>
        </Link>
        <p className="text-xs text-[#6E5D50]">
          The premier platform for world-class exhibitions and passes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#E8DFD5]">
          <Outlet />
        </div>

        <div className="mt-6 text-center text-xs text-[#8C7A6B]">
          Need assistance? Contact <a href="mailto:info@eventsphere.com" className="text-[#A4512D] hover:underline">info@eventsphere.com</a>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

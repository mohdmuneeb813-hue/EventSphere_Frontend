import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'exhibitor') return '/exhibitor';
    return '/attendee';
  };

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'All Expos', to: '/expos' },
    { name: 'About Us', to: '/about' },
    { name: 'Gallery', to: '/gallery' },
    { name: 'Contact Us', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-full bg-[#A4512D] flex items-center justify-center text-white shadow-md shadow-[#A4512D]/20 group-hover:scale-105 transition-transform">
            <span className="font-serif text-lg font-bold italic">E</span>
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#221A15]">
              EXPO<span className="text-[#A4512D]">SPHERE</span>
            </span>
            <span className="hidden sm:block text-[9px] uppercase tracking-widest text-[#8C7A6B] font-semibold -mt-1">
              Exhibitions & Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-semibold uppercase tracking-wider text-[#5A4B40]">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-[#A4512D] py-1 ${
                  isActive ? 'text-[#A4512D] font-bold border-b-2 border-[#A4512D]' : ''
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/expos"
            className="p-2 text-[#5A4B40] hover:text-[#A4512D] transition hidden sm:block"
            title="Search Expos"
          >
            <Search className="w-4 h-4" />
          </Link>

          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              className="px-5 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-full shadow-md shadow-[#A4512D]/20 transition flex items-center space-x-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-bold text-[#5A4B40] hover:text-[#A4512D] transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-full shadow-md shadow-[#A4512D]/20 transition flex items-center space-x-1"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#221A15] hover:text-[#A4512D] rounded-lg transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#E8DFD5] pb-4 space-y-2 animate-fadeIn bg-[#FAF7F2]">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#A4512D]/10 text-[#A4512D] font-bold'
                      : 'text-[#5A4B40] hover:bg-[#EFE7DC] hover:text-[#221A15]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8DFD5] flex flex-col space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-[#5A4B40] border border-[#D8C9BB] bg-white hover:bg-[#EFE7DC] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-white bg-[#A4512D] hover:bg-[#8C3F1F] transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-white bg-[#A4512D] hover:bg-[#8C3F1F] transition flex items-center justify-center space-x-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;

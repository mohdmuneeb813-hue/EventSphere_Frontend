import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  LogOut,
  User as UserIcon,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { RoleBadge } from './Badge';
import MessagingDrawer from '../chat/MessagingDrawer';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] px-4 sm:px-6 py-3 transition-colors">
        <div className="flex items-center justify-between">
          {/* Left: Mobile hamburger + Brand logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-[#5A4B40] hover:bg-[#EFE7DC] transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full bg-[#A4512D] flex items-center justify-center text-white shadow-md shadow-[#A4512D]/20 group-hover:scale-105 transition-transform">
                <span className="font-serif text-base font-bold italic">E</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-base font-bold text-[#221A15] tracking-tight">
                  EXPO<span className="text-[#A4512D]">SPHERE</span>
                </span>
                <span className="block text-[9px] text-[#8C7A6B] font-semibold -mt-1 tracking-wider uppercase">
                  Workspace Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Live status indicator, Chat, User menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real-time status indicator — reflects actual socket connection state */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5EFEB] border border-[#E8DFD5] text-[11px] font-medium text-[#5A4B40]">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{isConnected ? 'Live Sync Active' : 'Connecting...'}</span>
            </div>

            {/* Chat button */}
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="p-2 rounded-xl text-[#5A4B40] hover:bg-[#EFE7DC] hover:text-[#A4512D] transition relative"
              title="Open Live Messenger"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-[#EFE7DC] transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#A4512D]/10 text-[#A4512D] font-serif font-bold flex items-center justify-center text-xs border border-[#A4512D]/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-[#221A15] leading-none">{user.name}</p>
                    <p className="text-[10px] text-[#8C7A6B] mt-0.5">{user.email}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] hidden md:block" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8DFD5] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#F0E6DB]">
                      <p className="text-xs font-bold text-[#221A15]">{user.name}</p>
                      <p className="text-[11px] text-[#8C7A6B] truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>

                    <Link
                      to={
                        user.role === 'admin'
                          ? '/admin'
                          : user.role === 'exhibitor'
                          ? '/exhibitor/profile'
                          : '/attendee/bookings'
                      }
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-[#5A4B40] hover:bg-[#FAF7F2] hover:text-[#A4512D] transition"
                    >
                      <UserIcon className="w-4 h-4 text-[#8C7A6B]" />
                      <span>My Profile / Portal</span>
                    </Link>

                    <Link
                      to="/"
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-[#5A4B40] hover:bg-[#FAF7F2] hover:text-[#A4512D] transition"
                    >
                      <Sparkles className="w-4 h-4 text-[#A4512D]" />
                      <span>Public Landing & Expos</span>
                    </Link>

                    <div className="border-t border-[#F0E6DB] my-1"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-[#5A4B40] hover:text-[#A4512D] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#A4512D] rounded-full hover:bg-[#8C3F1F] transition shadow-md shadow-[#A4512D]/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out chat drawer */}
      <MessagingDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Navbar;

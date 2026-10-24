import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Grid,
  Users,
  Clock,
  BarChart3,
  HelpCircle,
  Briefcase,
  Layers,
  MessageSquare,
  Compass,
  Ticket,
  Bookmark,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from './Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'attendee';

  const adminNav = [
    { name: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Expo Management', to: '/admin/expos', icon: Calendar },
    { name: 'Floor Plan & Spaces', to: '/admin/floorplan', icon: Grid },
    { name: 'Exhibitor Requests', to: '/admin/exhibitors', icon: Users },
    { name: 'Schedule & Sessions', to: '/admin/schedules', icon: Clock },
    { name: 'Analytics & Insights', to: '/admin/analytics', icon: BarChart3 },
    { name: 'Feedback & Support', to: '/admin/feedback', icon: HelpCircle },
  ];

  const exhibitorNav = [
    { name: 'Overview', to: '/exhibitor', icon: LayoutDashboard, end: true },
    { name: 'Company Profile', to: '/exhibitor/profile', icon: Briefcase },
    { name: 'Reserve Booth', to: '/exhibitor/booths', icon: Layers },
    { name: 'Messenger & Networking', to: '/exhibitor/messages', icon: MessageSquare },
  ];

  const attendeeNav = [
    { name: 'Home & Feed', to: '/attendee', icon: LayoutDashboard, end: true },
    { name: 'Browse Expos', to: '/attendee/expos', icon: Compass },
    { name: 'Exhibitor Directory', to: '/attendee/directory', icon: Users },
    { name: 'My Tickets', to: '/attendee/bookings', icon: Ticket },
    { name: 'Saved Sessions', to: '/attendee/bookmarks', icon: Bookmark },
    { name: 'Help & Feedback', to: '/attendee/feedback', icon: HelpCircle },
  ];

  let currentNav = attendeeNav;
  if (role === 'admin') currentNav = adminNav;
  else if (role === 'exhibitor') currentNav = exhibitorNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#221A15]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E8DFD5] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-[#E8DFD5] flex items-center justify-between">
          <span className="font-serif font-bold text-[#221A15] text-sm">Navigation</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C7A6B] hover:bg-[#FAF7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-[#F5EFEB] border border-[#E8DFD5]">
          <p className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
            Workspace Portal
          </p>
          <p className="text-sm font-serif font-bold text-[#221A15] mt-1 truncate">
            {user?.name || 'Guest User'}
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <RoleBadge role={role} />
            <span className="text-[10px] text-[#A4512D] font-bold bg-[#A4512D]/10 px-2 py-0.5 rounded-full border border-[#A4512D]/20">
              Active
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#A4512D] text-white shadow-md shadow-[#A4512D]/20 font-bold'
                      : 'text-[#5A4B40] hover:bg-[#FAF7F2] hover:text-[#A4512D]'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[#E8DFD5] text-center">
          <p className="text-[10px] text-[#8C7A6B] font-medium tracking-wide">
            EventSphere Luxury Platform v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

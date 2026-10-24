import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Ticket,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { expoApi } from '../../api/expoApi';
import { bookingApi } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [expos, setExpos] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [allExpos, bookingsData] = await Promise.all([
          expoApi.getAll(),
          user?.id ? bookingApi.getAttendeeBookings(user.id) : Promise.resolve([]),
        ]);
        setExpos(allExpos || []);
        setMyBookings(bookingsData || []);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load your dashboard';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  if (loading) {
    return <Loader text="Loading your expo guide..." size="lg" />;
  }

  return (
    <div className="space-y-8 font-sans selection:bg-[#A4512D] selection:text-white">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#221A15] via-[#2F221B] to-[#18120E] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-[#3E2E24]">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDB892] bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Attendee Discovery Hub
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-3 tracking-tight">
            Hello, {user?.name || 'Explorer'}!
          </h1>
          <p className="text-sm text-[#D3C6BC] mt-2 leading-relaxed">
            Discover ground-breaking exhibitions, register for passes, and navigate booths with ease.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/attendee/expos"
              className="px-5 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white font-bold text-xs sm:text-sm rounded-full transition shadow-md flex items-center space-x-2"
            >
              <span>Explore Expos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/attendee/bookings"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-full transition border border-white/20 flex items-center space-x-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>My Passes ({myBookings.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-[#A4512D]/10 text-[#A4512D] rounded-2xl">
              <Compass className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-[#A4512D] bg-[#A4512D]/10 px-2.5 py-0.5 rounded-full border border-[#A4512D]/20">
              Live
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Featured Expos</p>
          <p className="font-serif text-3xl font-bold text-[#221A15] mt-1">{expos.length}</p>
          <p className="text-xs text-[#6E5D50] mt-1">Open for public registration</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Ticket className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Confirmed
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">My Tickets</p>
          <p className="font-serif text-3xl font-bold text-[#221A15] mt-1">{myBookings.length}</p>
          <p className="text-xs text-[#6E5D50] mt-1">Ready for check-in</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-[#2F3A2A]/10 text-[#2F3A2A] rounded-2xl">
              <Clock className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-[#2F3A2A] bg-[#2F3A2A]/10 px-2.5 py-0.5 rounded-full border border-[#2F3A2A]/20">
              Real-time
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Floor Navigation</p>
          <p className="font-serif text-lg font-bold text-[#221A15] mt-1">Interactive Map</p>
          <p className="text-xs text-[#6E5D50] mt-1">Hall A, B & C Available</p>
        </div>
      </div>

      {/* Featured Expos Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DB]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#221A15]">Upcoming Expo Exhibitions</h2>
            <p className="text-xs text-[#6E5D50]">Pick an event to view sessions, booths & register</p>
          </div>
          <Link
            to="/attendee/expos"
            className="text-xs font-bold text-[#A4512D] hover:text-[#8C3F1F] flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expos.slice(0, 3).map((expo) => (
            <div
              key={expo._id}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] hover:border-[#D8C9BB] transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#A4512D] bg-[#A4512D]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {expo.theme || 'Exhibition'}
                </span>
                <h3 className="font-serif text-base font-bold text-[#221A15] mt-2 leading-snug">
                  {expo.title}
                </h3>
                <p className="text-xs text-[#6E5D50] mt-1 line-clamp-2 leading-relaxed">
                  {expo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8DFD5] mt-4 flex items-center justify-between">
                <span className="text-xs text-[#8C7A6B]">
                  {formatDate(expo.date)}
                </span>
                <Link
                  to={`/attendee/expos/${expo._id}`}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#A4512D] hover:text-[#8C3F1F] bg-white rounded-full border border-[#D8C9BB] hover:bg-[#F5EFEB] transition"
                >
                  View Expo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;

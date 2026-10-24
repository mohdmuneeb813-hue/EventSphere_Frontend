import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Grid,
  Users,
  Ticket,
  Plus,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  MapPin,
} from 'lucide-react';
import { expoApi } from '../../api/expoApi';
import { boothApi } from '../../api/boothApi';
import { bookingApi } from '../../api/bookingApi';
import { useSocket } from '../../context/SocketContext';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const { subscribe } = useSocket();
  const [expos, setExpos] = useState([]);
  const [booths, setBooths] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exposData, boothsData, bookingsData] = await Promise.all([
        expoApi.getAll(),
        boothApi.getAll(),
        bookingApi.getAll(),
      ]);
      setExpos(exposData || []);
      setBooths(boothsData || []);
      setBookings(bookingsData || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load dashboard metrics';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time: the backend emits these 2 events when an admin elsewhere
    // approves/rejects a booth or creates a new expo. There is no
    // BOOTH_APPLIED / BOOKING_CREATED server event, so we don't subscribe to them.
    const u1 = subscribe('EXPO_CREATED', fetchData);
    const u2 = subscribe('BOOTH_STATUS_CHANGED', fetchData);

    return () => {
      u1();
      u2();
    };
  }, [subscribe]);

  const handleStatusChange = async (boothId, newStatus) => {
    try {
      await boothApi.updateStatus(boothId, newStatus);
      toast.success(`Booth marked as ${newStatus}`);
      // The backend will broadcast BOOTH_STATUS_CHANGED via Socket.io, which
      // triggers fetchData via our subscription above. We also refetch
      // immediately for snappy UX.
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update booth status';
      toast.error(msg);
    }
  };

  if (loading) {
    return <Loader text="Loading organizer metrics..." size="lg" />;
  }

  const approvedBooths = booths.filter((b) => b.status === 'Approved');
  const pendingBooths = booths.filter((b) => b.status === 'Pending');

  return (
    <div className="space-y-8 font-sans selection:bg-[#A4512D] selection:text-white">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221A15] tracking-tight">
            Organizer Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D50] mt-1">
            Real-time management for EventSphere expos, booths, and schedules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/expos"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs sm:text-sm font-bold rounded-full shadow-md shadow-[#A4512D]/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Expo</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-2xl bg-[#A4512D]/10 text-[#A4512D]">
              <Calendar className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-[#A4512D] bg-[#A4512D]/10 px-2.5 py-0.5 rounded-full border border-[#A4512D]/20">
              Active Expos
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Total Expos
          </p>
          <p className="font-serif text-3xl font-bold text-[#221A15] mt-1">{expos.length}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-2xl bg-[#2F3A2A]/10 text-[#2F3A2A]">
              <Grid className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-[#2F3A2A] bg-[#2F3A2A]/10 px-2.5 py-0.5 rounded-full border border-[#2F3A2A]/20">
              Spaces
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Allocated Booths
          </p>
          <p className="font-serif text-3xl font-bold text-[#221A15] mt-1">{approvedBooths.length}</p>
          <p className="text-[11px] text-[#8C7A6B] mt-1">
            {pendingBooths.length} awaiting review
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-2xl bg-[#DDB892]/20 text-[#A4512D]">
              <Users className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-[#A4512D] bg-[#DDB892]/20 px-2.5 py-0.5 rounded-full border border-[#DDB892]/30">
              Review
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Pending Applications
          </p>
          <p className="font-serif text-3xl font-bold text-[#221A15] mt-1">{pendingBooths.length}</p>
          <p className="text-[11px] text-[#8C7A6B] mt-1">From registered exhibitors</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
              <Ticket className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Total
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Tickets & Bookings
          </p>
          <p className="font-serif text-3xl font-bold text-[#221A15] mt-1">{bookings.length}</p>
          <p className="text-[11px] text-[#8C7A6B] mt-1">Confirmed attendees</p>
        </div>
      </div>

      {/* Two Column Layout: Pending Applications & Active Expos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Exhibitor Requests */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-4">
            <div>
              <h2 className="font-serif text-base font-bold text-[#221A15]">
                Pending Booth Requests
              </h2>
              <p className="text-xs text-[#6E5D50]">
                Review and assign spaces to exhibitors
              </p>
            </div>
            <Link
              to="/admin/exhibitors"
              className="text-xs font-bold text-[#A4512D] hover:text-[#8C3F1F] flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingBooths.length === 0 ? (
            <div className="py-8 text-center text-[#8C7A6B] text-xs">
              All exhibitor booth applications have been reviewed!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBooths.slice(0, 4).map((booth) => (
                <div
                  key={booth._id}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#221A15]">
                        {booth.boothNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#A4512D]/10 text-[#A4512D] rounded-md font-bold uppercase tracking-wider">
                        {booth.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A4B40] mt-1 font-medium">
                      {booth.exhibitor?.name || 'Exhibitor'} ({booth.exhibitor?.email})
                    </p>
                    <p className="text-[11px] text-[#8C7A6B]">
                      Expo: {booth.expo?.title || 'General Expo'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStatusChange(booth._id, 'Approved')}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#2F3A2A] text-white hover:bg-[#1E261B] transition flex items-center space-x-1 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(booth._id, 'Rejected')}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Expos Overview */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-4">
            <div>
              <h2 className="font-serif text-base font-bold text-[#221A15]">Upcoming Expos</h2>
              <p className="text-xs text-[#6E5D50]">Scheduled events on calendar</p>
            </div>
            <Link
              to="/admin/expos"
              className="text-xs font-bold text-[#A4512D] hover:text-[#8C3F1F] flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {expos.slice(0, 4).map((expo) => (
              <div
                key={expo._id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] hover:border-[#D8C9BB] transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#221A15]">{expo.title}</h3>
                    <p className="text-xs text-[#6E5D50] mt-0.5 line-clamp-1">
                      {expo.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#A4512D] bg-[#A4512D]/10 px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wider">
                    {expo.theme || 'Expo'}
                  </span>
                </div>
                <div className="mt-3 flex items-center space-x-4 text-xs text-[#8C7A6B]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-[#A4512D]" />
                    <span>{formatDate(expo.date)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A4512D]" />
                    <span>{expo.location}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

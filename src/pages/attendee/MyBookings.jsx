import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, QrCode, Printer, CheckCircle, ArrowRight } from 'lucide-react';
import { bookingApi } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      // If we still don't have a user id (shouldn't happen after AuthContext
      // normalization, but defensive), surface a clear error and turn off the
      // loader instead of leaving the page stuck on "Loading…" forever.
      if (!user?.id) {
        setLoading(false);
        if (user) {
          toast.error('Could not resolve your account id. Please log out and sign back in.');
        }
        return;
      }
      try {
        setLoading(true);
        const data = await bookingApi.getAttendeeBookings(user.id);
        setBookings(data || []);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load your bookings';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id, user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loader text="Retrieving your digital passes..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Event Passes & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Present these digital passes at the event entrance for QR check-in and badging.
          </p>
        </div>

        {bookings.length > 0 && (
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print All Badges</span>
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No Active Bookings"
          description="You haven't registered for any expo events yet. Browse our upcoming schedule to claim passes."
          actionLabel="Browse Upcoming Expos"
          onAction={() => (window.location.href = '/attendee/expos')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition print:break-inside-avoid"
            >
              {/* Ticket Top Banner */}
              <div className="bg-gradient-to-r from-terracotta-900 to-terracotta-800 p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-terracotta-300">
                    Official Attendee Pass
                  </span>
                  <h3 className="text-lg font-black mt-1 leading-snug">
                    {b.expo?.title || 'EventSphere Expo'}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-terracotta-700/60 border border-terracotta-500/40 flex items-center justify-center text-white">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Attendee Name
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                      {b.attendee?.name || user?.name}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      {b.attendee?.email || user?.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Ticket Serial Number
                    </span>
                    <span className="text-sm font-mono font-extrabold text-terracotta-600 block mt-0.5">
                      {b.ticketNumber}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold block">
                      ✓ Confirmed
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Event Date: {formatDate(b.expo?.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Venue: {b.expo?.location || 'Main Exhibition Hall'}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Bottom Tear-off bar with simulated QR Code */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shadow-inner">
                    <QrCode className="w-10 h-10 text-slate-800" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Scan at Turnstile
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {b.ticketNumber}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/attendee/expos/${typeof b.expo === 'object' ? b.expo?._id : b.expo}`}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition"
                >
                  View Floor Map →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  User,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { expoApi } from '../../api/expoApi';
import { scheduleApi } from '../../api/scheduleApi';
import { boothApi } from '../../api/boothApi';
import { bookingApi } from '../../api/bookingApi';
import { extraApi } from '../../api/extraApi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { formatDate } from '../../utils/formatters';
import FloorPlanView from '../../components/floorplan/FloorPlanView';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const ExpoDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { subscribe } = useSocket();

  const [expo, setExpo] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [booths, setBooths] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'schedule' | 'floorplan'

  // Per-session bookmark state is derived from Schedule.attendees on the server.
  // We refetch sessions whenever the user toggles a bookmark so the local view
  // matches the backend's persisted state. No localStorage fallback.
  const fetchData = async () => {
    try {
      setLoading(true);
      const [allExpos, scheds, allBooths, myBookings] = await Promise.all([
        expoApi.getAll(),
        scheduleApi.getByExpo(id),
        boothApi.getAll(),
        user?.id ? bookingApi.getAttendeeBookings(user.id) : Promise.resolve([]),
      ]);

      const match = (allExpos || []).find((e) => e._id === id);
      setExpo(match);
      setSchedules(scheds || []);
      setBooths(allBooths || []);
      setUserBookings(myBookings || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load expo details';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time: backend emits BOOTH_STATUS_CHANGED when an admin approves/rejects
    // a booth. Refetch so the floor plan reflects the latest state.
    const unsub = subscribe('BOOTH_STATUS_CHANGED', fetchData);
    return unsub;
  }, [id, subscribe]);

  const existingBooking = userBookings.find((b) => {
    const eid = typeof b.expo === 'object' ? b.expo?._id : b.expo;
    return eid === id;
  });

  const handleBookTicket = async () => {
    if (!user) {
      toast.error('Please log in to book a ticket');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingApi.book({
        expo: id,
        attendee: user.id,
      });

      // Visual celebration only — does not indicate any backend state beyond
      // the successful 201 from POST /api/bookings/book.
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      toast.success('Ticket registered successfully!');
      // Note: the backend does NOT emit a BOOKING_CREATED socket event, so we just
      // refetch this attendee's bookings to refresh the UI.
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed';
      toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  // Toggle the calling user's bookmark on a session via POST /api/extra/schedule/bookmark.
  // Backend (extraController.toggleSessionBookmark) adds/removes the user from
  // Schedule.attendees and returns the updated schedule; we refetch to sync.
  const toggleBookmark = async (session) => {
    if (!user?.id) {
      toast.error('Please log in to bookmark sessions.');
      return;
    }
    setBookmarkLoadingId(session._id);
    try {
      await extraApi.toggleSessionBookmark(session._id, user.id);
      // Refetch schedules so the bookmark badge reflects the persisted server state.
      const scheds = await scheduleApi.getByExpo(id);
      setSchedules(scheds || []);
      toast.success('Bookmark updated.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Bookmark toggle failed';
      toast.error(msg);
    } finally {
      setBookmarkLoadingId(null);
    }
  };

  if (loading) {
    return <Loader text="Loading expo details..." size="lg" />;
  }

  if (!expo) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Expo event not found.{' '}
        <Link to="/attendee/expos" className="text-terracotta-600 font-bold underline">
          Return to browse
        </Link>
      </div>
    );
  }

  const expoBooths = booths.filter((b) => {
    const eid = typeof b.expo === 'object' ? b.expo?._id : b.expo;
    return eid === id;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full">
              {expo.theme || 'Exhibition'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {expo.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{expo.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-2">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-terracotta-600" />
                <span>{formatDate(expo.date)}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{expo.location}</span>
              </span>
            </div>
          </div>

          {/* Registration Action Box */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 lg:w-80 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visitor Access Pass
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">Free Admission</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Includes full hall access & speaker tracks
              </p>
            </div>

            {existingBooking ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You are Registered!</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-mono">
                  Pass: {existingBooking.ticketNumber}
                </p>
                <Link
                  to="/attendee/bookings"
                  className="text-[11px] font-bold text-terracotta-600 hover:underline block pt-1"
                >
                  View Digital Pass →
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBookTicket}
                disabled={bookingLoading}
                className="w-full py-3 px-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-terracotta-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Ticket className="w-4 h-4" />
                <span>{bookingLoading ? 'Registering...' : 'Claim Free Pass'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 pt-4 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-terracotta-600 text-terracotta-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sessions & Agenda ({schedules.length})
          </button>
          <button
            onClick={() => setActiveTab('floorplan')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'floorplan'
                ? 'border-terracotta-600 text-terracotta-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Interactive Floor Map
          </button>
        </div>
      </div>

      {/* Tab 1: Schedules & Sessions */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Program Schedule</h2>
            <span className="text-xs text-slate-400">{schedules.length} confirmed sessions</span>
          </div>

          {schedules.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              No sessions published for this expo yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((item) => {
                // Server-truth: a session is bookmarked by the current user when
                // their id appears in item.attendees (array of ObjectId strings).
                const isBookmarked = (item.attendees || []).some(
                  (a) => (typeof a === 'object' ? a?._id : a)?.toString() === user?.id
                );

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
                          {item.topic}
                        </span>
                        <button
                          onClick={() => toggleBookmark(item)}
                          disabled={bookmarkLoadingId === item._id}
                          className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                            isBookmarked
                              ? 'text-amber-500 bg-amber-50'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                          }`}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark session'}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                        {item.sessionTitle}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-terracotta-500" />
                          <span className="font-semibold text-slate-800">
                            Speaker: {item.speaker}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>{item.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Open to all attendees</span>
                      {isBookmarked && (
                        <span className="text-amber-600 font-bold flex items-center space-x-1">
                          <Bookmark className="w-3 h-3 fill-current" />
                          <span>Bookmarked</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Interactive Floor Plan */}
      {activeTab === 'floorplan' && (
        <div>
          <FloorPlanView
            booths={expoBooths}
            currentExpoTitle={expo.title}
            interactive={true}
          />
        </div>
      )}
    </div>
  );
};

export default ExpoDetails;

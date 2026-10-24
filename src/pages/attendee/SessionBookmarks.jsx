import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, User, MapPin, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { scheduleApi } from '../../api/scheduleApi';
import { extraApi } from '../../api/extraApi';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// Bookmarked Sessions page — wired to GET /api/schedules/bookmarked/:userId
// (single round-trip; the backend populates the parent expo). Previously this
// page fanned out N requests (one per expo) to find bookmarked sessions; the
// new backend endpoint collapses that into one request.
//
// Remove-bookmark calls POST /api/extra/schedule/bookmark (which toggles).
export const SessionBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchBookmarks = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // The backend returns sessions where `attendees` includes the user's id,
      // with the parent `expo` populated (title, location, date, theme, description).
      const data = await scheduleApi.getBookmarked(user.id);
      setBookmarks(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load bookmarks';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user?.id]);

  const removeBookmark = async (session) => {
    if (!user?.id) return;
    setRemovingId(session._id);
    try {
      // toggleSessionBookmark removes the user if already present.
      await extraApi.toggleSessionBookmark(session._id, user.id);
      setBookmarks((prev) => prev.filter((b) => b._id !== session._id));
      toast.success('Session removed from saved list');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove bookmark';
      toast.error(msg);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Bookmarked Sessions & Agenda
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your personal conference itinerary with session reminders and speaker details.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-12 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading your bookmarks...</span>
        </div>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Sessions Saved"
          description="Browse expos and click the bookmark icon on any session to construct your personal agenda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((item) => {
            // The backend populates `expo` with { title, location, date, theme, description }.
            const expo = typeof item.expo === 'object' ? item.expo : null;
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
                      onClick={() => removeBookmark(item)}
                      disabled={removingId === item._id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {item.sessionTitle}
                  </h3>

                  <p className="text-xs font-semibold text-terracotta-600 mb-3">
                    Event: {expo?.title || 'Featured Expo'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-terracotta-500" />
                      <span>Speaker: {item.speaker}</span>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionBookmarks;

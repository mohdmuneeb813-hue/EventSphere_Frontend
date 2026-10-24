import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, MessageSquare, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { feedbackApi } from '../../api/feedbackApi';
import { formatDate } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// Admin Support Desk — wired to /api/feedback (REST) + Socket.io FEEDBACK_SUBMITTED.
// On POST the backend (feedbackController.createFeedback) persists the feedback
// and broadcasts FEEDBACK_SUBMITTED via io.emit; we subscribe to that event for
// cross-client real-time updates.
export const FeedbackSupport = () => {
  const { user } = useAuth();
  const { subscribe } = useSocket();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await feedbackApi.getAll();
      setFeedbacks(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load feedback';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Real-time: append new feedback when broadcast by the backend.
  useEffect(() => {
    const unsub = subscribe('FEEDBACK_SUBMITTED', (newFb) => {
      if (!newFb) return;
      setFeedbacks((prev) => {
        if (prev.some((f) => f._id === newFb._id || f.id === newFb.id)) return prev;
        return [newFb, ...prev];
      });
    });
    return unsub;
  }, [subscribe]);

  const toggleStatus = async (id, currentStatus) => {
    const next = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
    try {
      await feedbackApi.updateStatus(id, next);
      setFeedbacks((prev) =>
        prev.map((f) =>
          (f._id === id || f.id === id) ? { ...f, status: next } : f
        )
      );
      toast.success(`Ticket marked ${next}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Status update failed';
      toast.error(msg);
    }
  };

  const filtered = feedbacks.filter((fb) => {
    if (filter === 'ALL') return true;
    return (fb.status || '').toUpperCase() === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Support Desk & Attendee Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review inquiries, issue reports, and feedback submitted across all expos.
          </p>
        </div>

        {/* Status filters */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          {['ALL', 'OPEN', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                filter === s
                  ? 'bg-white text-terracotta-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 text-sm py-8 bg-white rounded-3xl border border-slate-200/80">
          Loading feedback...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Feedback Tickets"
          description="There are currently no tickets matching your filter."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {item.status || 'Open'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(item.createdAt || item.date)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.subject}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                <div className="pt-2 text-xs text-slate-500 flex items-center space-x-2">
                  <span className="font-semibold text-slate-700">{item.userName}</span>
                  <span>({item.userEmail})</span>
                  {item.role && (
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                      {item.role}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => toggleStatus(item._id || item.id, item.status)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 ${
                    item.status === 'Resolved'
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {item.status === 'Resolved' ? 'Reopen Ticket' : 'Mark Resolved'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackSupport;

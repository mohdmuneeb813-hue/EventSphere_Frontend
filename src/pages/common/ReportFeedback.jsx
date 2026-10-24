import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { feedbackApi } from '../../api/feedbackApi';
import toast from 'react-hot-toast';

// Public + attendee feedback form — wired to POST /api/feedback.
// The backend route is `verifyToken`-protected, so unauthenticated users are
// prompted to sign in instead of being allowed to fake-submit. On success,
// the backend broadcasts FEEDBACK_SUBMITTED via Socket.io so admin viewers
// see the new ticket in real time — no client-side emit required.
export const ReportFeedback = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState('Feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Map the 5 UI categories down to the 4 backend-enum values
  // ('Feedback' | 'Booth Issue' | 'Schedule Issue' | 'Other').
  const mapCategory = (uiValue) => {
    if (uiValue === 'Booth Issue') return 'Booth Issue';
    if (uiValue === 'Schedule Query' || uiValue === 'Schedule Issue') return 'Schedule Issue';
    if (uiValue === 'Technical Bug' || uiValue === 'Registration') return 'Other';
    return 'Feedback';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || submitting) return;

    if (!isAuthenticated) {
      toast.error('Please sign in to submit feedback.');
      navigate('/login', { state: { from: { pathname: '/feedback' } } });
      return;
    }

    try {
      setSubmitting(true);
      await feedbackApi.create({
        category: mapCategory(category),
        subject: subject.trim(),
        message: message.trim(),
        userName: user?.name || 'Anonymous',
        userEmail: user?.email || 'unknown@example.com',
        role: user?.role || 'attendee',
      });
      toast.success('Your feedback has been submitted to organizers!');
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit feedback';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Not signed in — show a sign-in prompt instead of a non-functional form.
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Help Desk & Support Feedback
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Have an issue or suggestion for EventSphere organizers? Let us know below.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-14 h-14 bg-terracotta-100 text-terracotta-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Sign in to submit feedback</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            To prevent spam and route your ticket to the right organizer, feedback submission requires a signed-in account.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/login"
              state={{ from: { pathname: '/feedback' } }}
              className="px-5 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-semibold rounded-xl transition inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Help Desk & Support Feedback
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Have an issue or suggestion for EventSphere organizers? Let us know below.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Feedback Received!</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Thank you for helping us improve EventSphere. Our management team will review your report shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubject('');
              setMessage('');
              setSubmitted(false);
            }}
            className="px-5 py-2.5 bg-terracotta-600 text-white text-sm font-semibold rounded-xl hover:bg-terracotta-700 transition"
          >
            Submit Another Ticket
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feedback Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
              >
                <option value="Feedback">General Suggestion</option>
                <option value="Booth Issue">Booth / Space Issue</option>
                <option value="Schedule Query">Schedule / Session Query</option>
                <option value="Technical Bug">Technical Platform Issue</option>
                <option value="Registration">Ticketing / Registration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'N/A'}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Summary
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question about Hall A Wi-Fi and power outlets"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide specific details so our organizers can assist you effectively..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-terracotta-600/20 transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Sending...' : 'Send Feedback to Organizers'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportFeedback;

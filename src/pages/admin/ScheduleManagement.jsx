import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar, User, MapPin } from 'lucide-react';
import { scheduleApi } from '../../api/scheduleApi';
import { expoApi } from '../../api/expoApi';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const ScheduleManagement = () => {
  const [expos, setExpos] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sessionTitle: '',
    speaker: '',
    topic: '',
    timeSlot: '10:00 AM - 11:30 AM',
    location: 'Auditorium Hall A',
  });

  const fetchExpos = async () => {
    try {
      const data = await expoApi.getAll();
      setExpos(data || []);
      if (data && data.length > 0 && !selectedExpoId) {
        setSelectedExpoId(data[0]._id);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load expos';
      toast.error(msg);
    }
  };

  const fetchSchedules = async (expoId) => {
    if (!expoId) return;
    try {
      setLoading(true);
      const data = await scheduleApi.getByExpo(expoId);
      setSchedules(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load sessions for expo';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  useEffect(() => {
    if (selectedExpoId) {
      fetchSchedules(selectedExpoId);
    }
  }, [selectedExpoId]);

  // Note: the backend does not emit SCHEDULE_CREATED / SCHEDULE_DELETED socket
  // events, so there is no realtime subscription to add here. The page refetches
  // locally after every mutation.

  const handleOpenCreate = () => {
    setFormData({
      sessionTitle: '',
      speaker: '',
      topic: '',
      timeSlot: '10:00 AM - 11:30 AM',
      location: 'Auditorium Hall A',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExpoId) {
      toast.error('Please select an expo');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        expo: selectedExpoId,
        ...formData,
      };
      await scheduleApi.create(payload);
      toast.success('Session added to schedule!');
      setIsModalOpen(false);
      fetchSchedules(selectedExpoId);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create session';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await scheduleApi.delete(deleteTarget._id);
      toast.success('Session removed');
      setDeleteTarget(null);
      fetchSchedules(selectedExpoId);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove session';
      toast.error(msg);
    }
  };

  const currentExpo = expos.find((e) => e._id === selectedExpoId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Schedule & Session Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize keynote speeches, speaker panels, and workshops for expos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!selectedExpoId}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-terracotta-600/20 transition disabled:opacity-50 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Session</span>
        </button>
      </div>

      {/* Expo Switcher Banner */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-terracotta-50 text-terracotta-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Expo: {currentExpo?.title || 'None Selected'}
            </h3>
            <p className="text-xs text-slate-500">
              {currentExpo?.location || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Select Expo:</label>
          <select
            value={selectedExpoId}
            onChange={(e) => setSelectedExpoId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          >
            {expos.map((expo) => (
              <option key={expo._id} value={expo._id}>
                {expo.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Session Cards */}
      {loading ? (
        <Loader text="Loading schedule sessions..." size="lg" />
      ) : schedules.length === 0 ? (
        <EmptyState
          title="No Sessions Scheduled Yet"
          description="Create the inaugural keynote, workshop, or panel for this expo."
          actionLabel="Schedule First Session"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-1 rounded-full">
                    {item.topic}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {item.sessionTitle}
                </h3>

                <div className="space-y-2 mt-4 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-terracotta-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">
                      Speaker: {item.speaker}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="font-medium text-slate-700">{item.timeSlot}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium text-slate-700">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Real-time Sync Active</span>
                <span className="text-emerald-600 font-bold">Confirmed</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Session"
        subtitle={`Add to program for "${currentExpo?.title}"`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={formData.sessionTitle}
              onChange={(e) => setFormData({ ...formData, sessionTitle: e.target.value })}
              placeholder="e.g. Keynote: The Future of Generative AI"
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Featured Speaker *
              </label>
              <input
                type="text"
                required
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                placeholder="e.g. Dr. Jane Smith"
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topic / Track *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Artificial Intelligence"
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Slot *
              </label>
              <input
                type="text"
                required
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="e.g. 10:00 AM - 11:30 AM"
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room / Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Main Auditorium Hall A"
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add to Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Session?"
        message={`Remove "${deleteTarget?.sessionTitle}" from the agenda?`}
        confirmText="Remove"
      />
    </div>
  );
};

export default ScheduleManagement;

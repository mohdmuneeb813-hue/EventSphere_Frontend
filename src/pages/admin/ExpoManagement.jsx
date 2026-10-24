import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Search,
} from 'lucide-react';
import { expoApi } from '../../api/expoApi';
import { useSocket } from '../../context/SocketContext';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const ExpoManagement = () => {
  const { subscribe } = useSocket();

  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpo, setEditingExpo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    location: '',
    date: '',
  });

  const fetchExpos = async () => {
    try {
      setLoading(true);
      const data = await expoApi.getAll();
      setExpos(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load expos';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
    // Real-time: the backend emits EXPO_CREATED when an admin elsewhere creates
    // an expo. There is no EXPO_UPDATED / EXPO_DELETED server event, so we don't
    // subscribe to those — we refetch locally after each mutation instead.
    const u1 = subscribe('EXPO_CREATED', fetchExpos);
    return u1;
  }, [subscribe]);

  const handleOpenCreate = () => {
    setEditingExpo(null);
    setFormData({
      title: '',
      description: '',
      theme: 'Innovation & Technology',
      location: '',
      date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expo) => {
    setEditingExpo(expo);
    setFormData({
      title: expo.title,
      description: expo.description,
      theme: expo.theme || '',
      location: expo.location,
      date: expo.date ? new Date(expo.date).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.date) {
      toast.error('Please fill all required fields');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingExpo) {
        await expoApi.update(editingExpo._id, formData);
        toast.success('Expo updated successfully!');
        // The backend does not broadcast an update event; refetch locally.
      } else {
        // Backend (hardened) reads `createdBy` from the JWT (req.user.id),
        // so we don't send it in the body anymore.
        await expoApi.create(formData);
        toast.success('New Expo published successfully!');
        // The backend emits EXPO_CREATED via Socket.io; our subscription will
        // trigger fetchExpos. We also refetch locally for snappy UX.
      }
      setIsModalOpen(false);
      fetchExpos();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await expoApi.delete(deleteTarget._id);
      toast.success('Expo deleted successfully');
      setDeleteTarget(null);
      fetchExpos();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete expo';
      toast.error(msg);
    }
  };

  const filteredExpos = expos.filter((expo) => {
    const q = searchTerm.toLowerCase();
    return (
      expo.title?.toLowerCase().includes(q) ||
      expo.location?.toLowerCase().includes(q) ||
      expo.theme?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Expo Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, configure, and manage high-profile exhibition events.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-terracotta-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Expo</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search expos by title, venue, or theme..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-sm"
        />
      </div>

      {/* Expo Cards Grid */}
      {loading ? (
        <Loader text="Loading expos from database..." size="lg" />
      ) : filteredExpos.length === 0 ? (
        <EmptyState
          title="No Expos Available"
          description="Create your first exhibition event to get started."
          actionLabel="Create Expo Now"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpos.map((expo) => (
            <div
              key={expo._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full">
                    {expo.theme || 'General Expo'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(expo)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-terracotta-600 hover:bg-terracotta-50 transition"
                      title="Edit Expo"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(expo)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Expo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {expo.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {expo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">{formatDate(expo.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium truncate">{expo.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpo ? 'Edit Expo Details' : 'Launch New Exhibition'}
        subtitle="Manage public event information, theme, and schedule."
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expo Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Global Tech & AI Summit 2026"
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Theme / Focus Area
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder="e.g. Robotics, AI & Cloud Computing"
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Grand Convention Center Hall 1"
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Highlights *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a compelling overview for attendees and exhibitors..."
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
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
              disabled={formSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {formSubmitting ? 'Saving...' : editingExpo ? 'Update Expo' : 'Publish Expo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expo Event?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All associated booth records and schedules may be affected.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default ExpoManagement;

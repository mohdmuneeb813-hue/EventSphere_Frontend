import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { boothApi } from '../../api/boothApi';
import { useSocket } from '../../context/SocketContext';
import { formatDate } from '../../utils/formatters';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const ExhibitorManagement = () => {
  const { subscribe } = useSocket();
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBooths = async () => {
    try {
      setLoading(true);
      const data = await boothApi.getAll();
      setBooths(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load exhibitor applications';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooths();
    // Real-time: backend emits BOOTH_STATUS_CHANGED when an admin elsewhere
    // approves/rejects. There is no BOOTH_APPLIED server event.
    const u1 = subscribe('BOOTH_STATUS_CHANGED', fetchBooths);
    return u1;
  }, [subscribe]);

  const handleUpdateStatus = async (boothId, newStatus) => {
    try {
      await boothApi.updateStatus(boothId, newStatus);
      toast.success(`Exhibitor application ${newStatus.toLowerCase()} successfully`);
      // The backend broadcasts BOOTH_STATUS_CHANGED; the subscription refetches.
      fetchBooths();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update status';
      toast.error(msg);
    }
  };

  const filteredBooths = booths.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status?.toUpperCase() === statusFilter;
  });

  const columns = [
    {
      header: 'Exhibitor',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-xs sm:text-sm">
            {row.exhibitor?.name || 'Unknown'}
          </p>
          <p className="text-xs text-slate-500">{row.exhibitor?.email || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Expo Event',
      render: (row) => (
        <div>
          <p className="font-semibold text-xs text-slate-800">
            {row.expo?.title || 'General Exhibition'}
          </p>
          <p className="text-[11px] text-slate-400">{row.expo?.location || ''}</p>
        </div>
      ),
    },
    {
      header: 'Booth #',
      render: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
          {row.boothNumber}
        </span>
      ),
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="text-xs text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-full font-medium">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Applied Date',
      render: (row) => (
        <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Decision Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          {row.status !== 'Approved' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'Approved')}
              className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition text-xs font-bold flex items-center space-x-1"
              title="Approve Application"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          )}
          {row.status !== 'Rejected' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'Rejected')}
              className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition text-xs font-bold flex items-center space-x-1"
              title="Reject Application"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Exhibitor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review exhibitor booth applications, manage space requests, and approve stalls.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                statusFilter === st
                  ? 'bg-white text-terracotta-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredBooths}
        loading={loading}
        searchPlaceholder="Search by exhibitor, expo, booth number..."
        emptyTitle="No Exhibitor Applications"
        emptyDescription="There are currently no booth applications matching your filter."
      />
    </div>
  );
};

export default ExhibitorManagement;

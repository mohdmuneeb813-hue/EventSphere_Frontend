import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { boothApi } from '../../api/boothApi';
import { expoApi } from '../../api/expoApi';
import { useSocket } from '../../context/SocketContext';
import FloorPlanView from '../../components/floorplan/FloorPlanView';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const FloorPlanManagement = () => {
  const { subscribe } = useSocket();
  const [expos, setExpos] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState('');
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooth, setSelectedBooth] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exposData, boothsData] = await Promise.all([
        expoApi.getAll(),
        boothApi.getAll(),
      ]);
      setExpos(exposData || []);
      if (exposData && exposData.length > 0 && !selectedExpoId) {
        setSelectedExpoId(exposData[0]._id);
      }
      setBooths(boothsData || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load floor plan data';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time: the backend emits BOOTH_STATUS_CHANGED when an admin elsewhere
    // approves/rejects a booth. There is no BOOTH_APPLIED server event.
    const u1 = subscribe('BOOTH_STATUS_CHANGED', fetchData);
    return u1;
  }, [subscribe]);

  const currentExpo = expos.find((e) => e._id === selectedExpoId) || expos[0];
  const currentExpoBooths = booths.filter((b) => {
    const expoId = typeof b.expo === 'object' ? b.expo?._id : b.expo;
    return expoId === (currentExpo?._id || selectedExpoId);
  });

  const handleStatusChange = async (status) => {
    if (!selectedBooth?.data?._id) return;
    try {
      await boothApi.updateStatus(selectedBooth.data._id, status);
      toast.success(`Booth ${selectedBooth.boothNumber} ${status}`);
      // The backend broadcasts BOOTH_STATUS_CHANGED via Socket.io, which
      // triggers fetchData via our subscription. We also refetch locally.
      setSelectedBooth(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update status';
      toast.error(msg);
    }
  };

  if (loading) {
    return <Loader text="Loading floor plan data..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Floor Plan & Space Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual map of booth spaces, exhibitor assignments, and hall configurations.
          </p>
        </div>

        {/* Expo Selector */}
        {expos.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Selected Expo:</span>
            <select
              value={selectedExpoId}
              onChange={(e) => {
                setSelectedExpoId(e.target.value);
                setSelectedBooth(null);
              }}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              {expos.map((expo) => (
                <option key={expo._id} value={expo._id}>
                  {expo.title} ({expo.location})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Interactive Floor Plan Component */}
      <FloorPlanView
        booths={currentExpoBooths}
        selectedBoothNumber={selectedBooth?.boothNumber}
        onSelectBooth={(b) => setSelectedBooth(b)}
        currentExpoTitle={currentExpo?.title || 'Main Exhibition'}
      />

      {/* Admin Action Bar when a booth is selected */}
      {selectedBooth && selectedBooth.data && (
        <div className="p-4 bg-terracotta-50 rounded-2xl border border-terracotta-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-bold text-terracotta-900">
              Selected Booth: {selectedBooth.boothNumber}
            </span>
            <p className="text-xs text-terracotta-700">
              Assigned to: {selectedBooth.data?.exhibitor?.name} ({selectedBooth.data?.exhibitor?.email}) • Status: {selectedBooth.status}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {selectedBooth.status !== 'Approved' && (
              <button
                onClick={() => handleStatusChange('Approved')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center space-x-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve Booth Space</span>
              </button>
            )}
            {selectedBooth.status !== 'Rejected' && (
              <button
                onClick={() => handleStatusChange('Rejected')}
                className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 rounded-xl transition flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject / Free Space</span>
              </button>
            )}
            <button
              onClick={() => setSelectedBooth(null)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanManagement;

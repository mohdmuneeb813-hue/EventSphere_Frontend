import React, { useState, useEffect } from 'react';
import { Layers, Send } from 'lucide-react';
import { boothApi } from '../../api/boothApi';
import { expoApi } from '../../api/expoApi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import FloorPlanView from '../../components/floorplan/FloorPlanView';
import { StatusBadge } from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const ExhibitorBooths = () => {
  const { user } = useAuth();
  const { subscribe } = useSocket();

  const [expos, setExpos] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState('');
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booth reservation form
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [category, setCategory] = useState('Tech & AI');
  const [submitting, setSubmitting] = useState(false);

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
      const msg = err.response?.data?.message || err.message || 'Failed to load booth reservations';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time: backend emits BOOTH_STATUS_CHANGED when an admin approves/rejects
    // a booth. There is no BOOTH_APPLIED server event.
    const u1 = subscribe('BOOTH_STATUS_CHANGED', fetchData);
    return u1;
  }, [subscribe]);

  const currentExpo = expos.find((e) => e._id === selectedExpoId) || expos[0];
  const currentExpoBooths = booths.filter((b) => {
    const expoId = typeof b.expo === 'object' ? b.expo?._id : b.expo;
    return expoId === (currentExpo?._id || selectedExpoId);
  });

  // Check if exhibitor already applied for a booth in this expo
  const myExistingBooth = currentExpoBooths.find((b) => {
    const exhibitorId = typeof b.exhibitor === 'object' ? b.exhibitor?._id : b.exhibitor;
    return exhibitorId === user?.id;
  });

  const handleApplyBooth = async (e) => {
    e.preventDefault();
    if (!selectedBooth) {
      toast.error('Please select an available booth on the floor plan');
      return;
    }

    if (!selectedExpoId) {
      toast.error('Please select an expo');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        expo: selectedExpoId,
        exhibitor: user?.id,
        boothNumber: selectedBooth.boothNumber,
        category,
      };

      await boothApi.apply(payload);
      toast.success(`Application for Booth ${selectedBooth.boothNumber} submitted!`);
      setSelectedBooth(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Booth application failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading expo floor plan..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Select & Reserve Your Booth Space
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pick your preferred booth position on the live interactive floor plan.
          </p>
        </div>

        {/* Expo Selector */}
        {expos.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Choose Expo:</span>
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

      {/* Existing Reservation Notice if applicable */}
      {myExistingBooth && (
        <div className="p-4 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-terracotta-600 text-white rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-terracotta-900">
                You have requested Booth {myExistingBooth.boothNumber} for this event
              </p>
              <p className="text-xs text-terracotta-700">
                Category: {myExistingBooth.category}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={myExistingBooth.status} />
          </div>
        </div>
      )}

      {/* Interactive Floor Plan */}
      <FloorPlanView
        booths={currentExpoBooths}
        selectedBoothNumber={selectedBooth?.boothNumber}
        onSelectBooth={(b) => {
          if (b.status === 'Approved') {
            toast.error('This booth is already occupied.');
            return;
          }
          setSelectedBooth(b);
        }}
        currentExpoTitle={currentExpo?.title || 'Active Expo'}
      />

      {/* Reservation Form Drawer/Card */}
      {selectedBooth && selectedBooth.status === 'Available' && (
        <form
          onSubmit={handleApplyBooth}
          className="bg-white p-6 rounded-3xl border border-terracotta-200 shadow-xl space-y-4 animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Reservation for Booth {selectedBooth.boothNumber}
              </h3>
              <p className="text-xs text-slate-500">
                Submit this application to organizers for review and confirmation.
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full self-start sm:self-auto">
              Space Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exhibition Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="Tech & AI">Tech & Artificial Intelligence</option>
                <option value="Software & Cloud">Software & Cloud Solutions</option>
                <option value="Cybersecurity">Cybersecurity & Networking</option>
                <option value="Hardware & IoT">Hardware, IoT & Robotics</option>
                <option value="Fintech">Fintech & Payments</option>
                <option value="E-Commerce">E-Commerce & Retail Tech</option>
                <option value="HealthTech">HealthTech & Biotech</option>
                <option value="General Expo">General Expo Category</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applying Exhibitor
              </label>
              <input
                type="text"
                disabled
                value={`${user?.name} (${user?.companyDetails?.companyName || 'Registered Exhibitor'})`}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedBooth(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel Selection
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-terracotta-600/20 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Submit Booth Application'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExhibitorBooths;

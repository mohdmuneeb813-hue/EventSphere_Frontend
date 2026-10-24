import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Store,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { boothApi } from '../../api/boothApi';
import { expoApi } from '../../api/expoApi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const ExhibitorDashboard = () => {
  const { user } = useAuth();
  const { subscribe } = useSocket();
  const [myBooths, setMyBooths] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExhibitorData = async () => {
    try {
      setLoading(true);
      const [allBooths, allExpos] = await Promise.all([
        boothApi.getAll(),
        expoApi.getAll(),
      ]);

      const mine = (allBooths || []).filter((b) => {
        const exhId = typeof b.exhibitor === 'object' ? b.exhibitor?._id : b.exhibitor;
        return exhId === user?.id;
      });

      setMyBooths(mine);
      setExpos(allExpos || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load exhibitor data';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitorData();
    const u1 = subscribe('BOOTH_STATUS_CHANGED', fetchExhibitorData);
    const u2 = subscribe('EXPO_CREATED', fetchExhibitorData);
    return () => {
      u1();
      u2();
    };
  }, [user?.id, subscribe]);

  if (loading) {
    return <Loader text="Loading exhibitor portal..." size="lg" />;
  }

  const activeBooth = myBooths[0];

  return (
    <div className="space-y-8 font-sans selection:bg-[#A4512D] selection:text-white">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#221A15] via-[#2F221B] to-[#18120E] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-[#3E2E24]">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDB892] bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Exhibitor Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-3 tracking-tight">
            Welcome back, {user?.name || 'Partner'}!
          </h1>
          <p className="text-sm text-[#D3C6BC] mt-2 leading-relaxed">
            Manage your booth reservations, showcase products, and connect with thousands of expo attendees.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/exhibitor/booths"
              className="px-5 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white font-bold text-xs sm:text-sm rounded-full transition shadow-md flex items-center space-x-2"
            >
              <span>{activeBooth ? 'View Reserved Booth' : 'Reserve a Booth Space'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/exhibitor/profile"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-full transition border border-white/20"
            >
              Edit Company Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-[#A4512D]/10 text-[#A4512D] rounded-2xl">
              <Layers className="w-6 h-6" />
            </span>
            {activeBooth && <StatusBadge status={activeBooth.status} />}
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Booth Space</p>
          <p className="font-serif text-2xl font-bold text-[#221A15] mt-1">
            {activeBooth ? activeBooth.boothNumber : 'None Reserved'}
          </p>
          <p className="text-xs text-[#6E5D50] mt-1">
            {activeBooth ? `Category: ${activeBooth.category}` : 'Explore floor plan to apply'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-[#2F3A2A]/10 text-[#2F3A2A] rounded-2xl">
              <Calendar className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-[#2F3A2A] bg-[#2F3A2A]/10 px-2.5 py-0.5 rounded-full border border-[#2F3A2A]/20">
              Exhibition
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Registered Expo</p>
          <p className="font-serif text-lg font-bold text-[#221A15] mt-1 truncate">
            {activeBooth?.expo?.title || (expos[0] && expos[0].title) || 'No expo registered'}
          </p>
          <p className="text-xs text-[#6E5D50] mt-1">
            {activeBooth?.expo?.location || (expos[0] && expos[0].location) || 'Venue TBA'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Store className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live
            </span>
          </div>
          <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Company Profile</p>
          <p className="font-serif text-lg font-bold text-[#221A15] mt-1 truncate">
            {user?.companyDetails?.companyName || user?.name}
          </p>
          <p className="text-xs text-[#6E5D50] mt-1">
            {user?.companyDetails?.productsOrServices || 'Products Listed'}
          </p>
        </div>
      </div>

      {/* Booth Applications Summary */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#F0E6DB]">
          <div>
            <h3 className="font-serif text-base font-bold text-[#221A15]">
              Your Booth Applications & Space Status
            </h3>
            <p className="text-xs text-[#6E5D50]">Live updates from event organizers</p>
          </div>
          <Link
            to="/exhibitor/booths"
            className="text-xs font-bold text-[#A4512D] hover:text-[#8C3F1F]"
          >
            Apply for another booth
          </Link>
        </div>

        {myBooths.length === 0 ? (
          <div className="py-8 text-center text-[#8C7A6B] text-xs">
            You haven't requested any booths yet. Click above to view the floor plan and apply!
          </div>
        ) : (
          <div className="space-y-3">
            {myBooths.map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#221A15]">
                      Booth {b.boothNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#A4512D]/10 text-[#A4512D]">
                      {b.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A4B40] mt-1">
                    Event: {b.expo?.title || 'Main Expo'} • Date: {formatDate(b.expo?.date)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-[#8C7A6B]">
                    {b.status === 'Approved'
                      ? 'Confirmed & Locked'
                      : b.status === 'Pending'
                      ? 'Under Organizer Review'
                      : 'Declined'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExhibitorDashboard;

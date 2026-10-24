import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';
import PublicNavbar from '../../components/common/PublicNavbar';
import PublicFooter from '../../components/common/PublicFooter';
import FloorPlanView from '../../components/floorplan/FloorPlanView';
import { expoApi } from '../../api/expoApi';
import { boothApi } from '../../api/boothApi';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

// Public expo detail view — wired entirely to GET /api/expos/all and
// GET /api/booths/all. The original theme fell back to a fully fake
// "Tech & Innovation Expo 2026" object when the expo wasn't in the DB;
// that fake fallback, the hardcoded highlights list, the hardcoded
// gallery Unsplash images, and the bogus "500+/50K+/50+" stats have
// all been removed. When the expo is not found, we render an explicit
// "not found" empty state instead of inventing one.
export const ExpoDetailsView = () => {
  const { id } = useParams();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const [allExpos, allBooths] = await Promise.all([
          expoApi.getAll(),
          boothApi.getAll(),
        ]);
        const found = (allExpos || []).find((e) => e._id === id);
        if (!found) {
          setNotFound(true);
        } else {
          setExpo(found);
        }
        setBooths(allBooths || []);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load expo details';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const expoBooths = expo
    ? booths.filter((b) => {
        const expoId = typeof b.expo === 'object' ? b.expo?._id : b.expo;
        return expoId === expo._id;
      })
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col font-sans">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Loading expo details..." size="lg" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (notFound || !expo) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col font-sans">
        <PublicNavbar />
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-16 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold text-[#221A15]">
            Expo not found
          </h1>
          <p className="text-sm text-[#6E5D50]">
            The expo you are looking for is not in the database. It may have been removed or never existed.
          </p>
          <Link
            to="/expos"
            className="inline-block px-6 py-3 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-full transition"
          >
            Browse All Expos
          </Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-12">
        {/* 1. Hero banner — uses the expo's title as the visual; no fake Unsplash image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[21/9] sm:aspect-[16/7] bg-[#221A15]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#221A15] via-[#2F221B] to-[#18120E]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#221A15]/85 via-[#221A15]/30 to-transparent"></div>

          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#A4512D] text-white">
                {expo.theme || 'Exhibition'}
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {expo.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#E5B79F] font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-white" />
                  <span>{formatDate(expo.date)}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-white" />
                  <span>{expo.location}</span>
                </span>
              </div>
            </div>

            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl transition flex items-center space-x-2 self-start sm:self-auto"
            >
              <Ticket className="w-4 h-4" />
              <span>Register to Attend →</span>
            </Link>
          </div>
        </div>

        {/* 2. About the Event (no fake stats, no hardcoded highlights list) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: About text */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#221A15]">About the Event</h2>
              <p className="text-sm text-[#6B5A4E] leading-relaxed mt-3">
                {expo.description || 'No description provided for this expo yet.'}
              </p>
            </div>

            {/* Real DB-derived counts: number of approved booths for this expo */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8DFD5]">
              <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] text-center">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#A4512D]">
                  {expoBooths.filter((b) => b.status === 'Approved').length}
                </p>
                <p className="text-[11px] text-[#7D6B5E] uppercase tracking-wider font-semibold mt-0.5">
                  Approved Booths
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] text-center">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#221A15]">
                  {expoBooths.length}
                </p>
                <p className="text-[11px] text-[#7D6B5E] uppercase tracking-wider font-semibold mt-0.5">
                  Total Booth Applications
                </p>
              </div>
            </div>
          </div>

          {/* Right: Action Card — no fake highlights list, just routing */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#221A15]">Attend this Expo</h3>
            <p className="text-xs text-[#6E5D50] leading-relaxed">
              Sign in or register an account to claim a free attendee pass, browse the floor plan, and bookmark sessions.
            </p>

            <div className="space-y-3 pt-4 border-t border-[#E8DFD5]">
              <Link
                to="/register"
                className="w-full py-3 bg-[#A4512D] hover:bg-[#8C3F1F] text-white font-bold text-xs sm:text-sm rounded-full transition shadow-md flex items-center justify-center space-x-2"
              >
                <span>Register to Attend</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register"
                className="w-full py-3 bg-[#F5EFEB] hover:bg-[#E8DFD5] text-[#221A15] font-bold text-xs rounded-full transition flex items-center justify-center space-x-2"
              >
                <span>Register as Exhibitor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Interactive Floor Plan — wired to real booths for this expo */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#221A15]">Exhibition Floor Plan</h2>
              <p className="text-xs text-[#7D6B5E]">
                {expoBooths.length === 0
                  ? 'No booth applications for this expo yet.'
                  : `${expoBooths.length} booth application${expoBooths.length === 1 ? '' : 's'} — live from the database.`}
              </p>
            </div>
            <Link to="/register" className="text-xs font-bold text-[#A4512D] hover:underline">
              Reserve a Booth →
            </Link>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-sm">
            <FloorPlanView
              booths={expoBooths}
              currentExpoTitle={expo.title}
              interactive={true}
            />
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ExpoDetailsView;

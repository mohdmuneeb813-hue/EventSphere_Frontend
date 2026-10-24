import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { boothApi } from '../../api/boothApi';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

// Attendee Exhibitor Directory — wired to GET /api/booths/all (which the
// backend populates with `exhibitor` and `expo`). The "Book Meeting" modal
// in the original theme had no backend endpoint behind it, so it has been
// removed (per "completely remove unsupported features" — not disabled).
// Approved booths only are shown by default, since Pending/Rejected booths
// aren't visible to attendees at the venue.
export const ExhibitorDirectory = () => {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await boothApi.getAll();
        setBooths(data || []);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load exhibitors';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derive category filter chips from the actual backend data instead of a
  // hardcoded list — this naturally adapts to whatever categories exist.
  const categories = ['ALL', ...Array.from(new Set(booths.map((b) => b.category).filter(Boolean)))];

  const filtered = booths
    .filter((b) => b.status === 'Approved') // attendees only see approved booths
    .filter((b) => {
      const q = searchTerm.toLowerCase();
      const matchCategory =
        selectedCategory === 'ALL' ||
        b.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !q ||
        b.exhibitor?.name?.toLowerCase().includes(q) ||
        b.boothNumber?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        b.expo?.title?.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Exhibitor Directory & Company Showcase
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore confirmed exhibition stalls and connect with company representatives on the floor.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, category, or booth number..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-sm"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex bg-slate-100 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  selectedCategory === cat
                    ? 'bg-white text-terracotta-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <Loader text="Loading exhibitors directory..." size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Exhibitors Found"
          description="No approved exhibitor booths match your filter yet. Try broadening your category or keyword."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-terracotta-50 text-terracotta-700">
                    Booth {b.boothNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {b.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-terracotta-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {b.exhibitor?.name ? b.exhibitor.name.charAt(0) : 'E'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {b.exhibitor?.name || 'Exhibitor Company'}
                    </h3>
                    <p className="text-xs text-slate-400">{b.exhibitor?.email}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-700">
                    Expo: {b.expo?.title || 'General Event'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Location: {b.expo?.location || 'Main Hall'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Date: {b.expo?.date ? formatDate(b.expo.date) : 'TBA'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={b.status} />
                <span className="text-[11px] text-slate-400">
                  {b.exhibitor?.companyDetails?.productsOrServices || '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExhibitorDirectory;

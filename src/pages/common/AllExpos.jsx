import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import PublicNavbar from '../../components/common/PublicNavbar';
import PublicFooter from '../../components/common/PublicFooter';
import { expoApi } from '../../api/expoApi';
import { formatDate } from '../../utils/formatters';
import { getThemeIcon } from '../../utils/themeIcons';
import toast from 'react-hot-toast';

// Public "All Expos" directory — wired entirely to GET /api/expos/all.
// The original theme merged 4 hardcoded curated expos with DB rows and used
// 8 hardcoded Unsplash category tiles + cosmetic pagination. All fake data
// has been removed:
//   - Only DB expos are shown.
//   - Category chips are derived from the unique `theme` values in DB expos
//     (no hardcoded Unsplash tiles).
//   - Pagination is removed (the backend has no pagination; client-side
//     slicing of a small list is cosmetic and not needed).
//   - Location filter is derived from the unique `location` values in DB expos.
export const AllExpos = () => {
  const [dbExpos, setDbExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        setLoading(true);
        const data = await expoApi.getAll();
        setDbExpos(data || []);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load expos';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchExpos();
  }, []);

  // Derive category chips + location chips from real DB data.
  const categoryChips = ['All', ...Array.from(new Set(dbExpos.map((e) => e.theme).filter(Boolean)))];
  const locationChips = ['All', ...Array.from(new Set(dbExpos.map((e) => e.location).filter(Boolean)))];

  const filteredExpos = dbExpos.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.theme?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q);

    const matchCategory =
      selectedCategory === 'All' ||
      item.theme?.toLowerCase() === selectedCategory.toLowerCase();

    const matchLocation =
      selectedLocation === 'All' ||
      item.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchSearch && matchCategory && matchLocation;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10">
        {/* Page Title */}
        <div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#221A15] tracking-tight">
            All Expos
          </h1>
          <p className="text-xs sm:text-sm text-[#7D6B5E] mt-1.5">
            Explore all upcoming exhibitions and find the perfect expo for your interests.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, topics, or venues..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4512D]/20 focus:border-[#A4512D]"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-semibold bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-[#5A4B40] focus:outline-none focus:ring-2 focus:ring-[#A4512D]/20"
            >
              {categoryChips.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-semibold bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-[#5A4B40] focus:outline-none focus:ring-2 focus:ring-[#A4512D]/20"
            >
              {locationChips.map((loc) => (
                <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLocation('All'); }}
              className="px-6 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-xl transition shadow-sm w-full sm:w-auto"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category chips (derived from real data, no Unsplash images) */}
        {categoryChips.length > 1 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Filter by Theme
              </span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs font-bold text-[#A4512D] hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryChips.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                    selectedCategory === cat
                      ? 'bg-[#A4512D] text-white border-transparent shadow-md'
                      : 'bg-white text-[#5A4B40] border-[#E8DFD5] hover:bg-[#F5EFEB] hover:border-[#A4512D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expos List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#8C7A6B] bg-white rounded-3xl border border-[#E8DFD5]">
              Loading expos from the database...
            </div>
          ) : filteredExpos.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8C7A6B] bg-white rounded-3xl border border-[#E8DFD5]">
              {dbExpos.length === 0
                ? 'No expos have been published yet. Please check back soon.'
                : 'No expos match your filter. Try a different category or location.'}
            </div>
          ) : (
            filteredExpos.map((expo) => (
              <div
                key={expo._id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#F5EFEB] to-[#E8DFD5] border border-[#E8DFD5] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#A4512D22,transparent_60%)]" />
                    {(() => {
                      const Icon = getThemeIcon(expo.theme || expo.title);
                      return <Icon className="w-8 h-8 text-[#A4512D]/55 relative z-10" strokeWidth={1.5} />;
                    })()}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5EFEB] text-[#8C3F1F] border border-[#E8DFD5]">
                      {expo.theme || 'Exhibition'}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#221A15] group-hover:text-[#A4512D] transition leading-snug">
                      {expo.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#7D6B5E]">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#A4512D]" />
                        <span>{formatDate(expo.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#A4512D]" />
                        <span>{expo.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-auto">
                  <Link
                    to={`/expo-details/${expo._id}`}
                    className="px-6 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center space-x-1.5 whitespace-nowrap"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AllExpos;

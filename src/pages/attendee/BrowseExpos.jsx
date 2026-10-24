import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Search, Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import { expoApi } from '../../api/expoApi';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const BrowseExpos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [sortBy, setSortBy] = useState('soonest');

  const themes = ['ALL', 'AI & Future', 'Website development', 'Artificial Intelligence & Cloud', 'General'];

  const filtered = expos
    .filter((e) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.theme?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q);

      const matchTheme =
        selectedTheme === 'ALL' ||
        (e.theme && e.theme.toLowerCase().includes(selectedTheme.toLowerCase()));

      return matchSearch && matchTheme;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'soonest' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Browse All Expos & Conferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore upcoming industry expos, book your delegate pass, and view live agendas.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, location, or theme..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          >
            <option value="soonest">Sort: Soonest First</option>
            <option value="latest">Sort: Latest First</option>
          </select>
        </div>
      </div>

      {/* Theme Pills */}
      <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto gap-1 self-start">
        {['ALL', 'AI & Future', 'Website development', 'Cloud', 'General'].map((thm) => (
          <button
            key={thm}
            onClick={() => setSelectedTheme(thm)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              selectedTheme === thm
                ? 'bg-white text-terracotta-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {thm}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading expos from server..." size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Expos Found"
          description="Try adjusting your search criteria to discover events."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((expo) => (
            <div
              key={expo._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-1 rounded-full">
                  {expo.theme || 'Exhibition'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2 leading-snug">
                  {expo.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {expo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{formatDate(expo.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{expo.location}</span>
                  </div>
                </div>

                <Link
                  to={`/attendee/expos/${expo._id}`}
                  className="w-full py-2.5 px-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>View Details & Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseExpos;

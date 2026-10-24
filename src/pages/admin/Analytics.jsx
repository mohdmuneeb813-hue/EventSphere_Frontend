import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Grid, Users, Ticket, TrendingUp } from 'lucide-react';
import { expoApi } from '../../api/expoApi';
import { boothApi } from '../../api/boothApi';
import { bookingApi } from '../../api/bookingApi';
import { extraApi } from '../../api/extraApi';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

// Color palette for pie chart slices. All warm — terracotta + olive + emerald
// + amber + rose. No cool blue/indigo/purple/violet family.
const COLORS = ['#BE6D48', '#8C3F1F', '#10b981', '#f59e0b', '#ec4899', '#556A4C'];

// Admin Analytics — wired to:
//   GET /api/extra/admin/analytics  -> { totalUsers, totalExhibitors, totalAttendees, totalBookings, totalBooths, approvedBooths }
//   GET /api/expos/all              -> used to derive attendance-per-expo (real)
//   GET /api/booths/all             -> used to derive category & status breakdowns (real)
//   GET /api/bookings/all           -> cross-referenced with expos for attendance chart
// No fabricated time series — the original "Registration Velocity" chart used
// a synthetic 5-day curve based on bookings.length × multipliers, which has
// been removed (per "no fake statistics" rule). It has been replaced by a
// Booths-by-Status bar chart derived from real booth data.
export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [expos, setExpos] = useState([]);
  const [booths, setBooths] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [exposData, boothsData, bookingsData, analyticsData] = await Promise.all([
          expoApi.getAll(),
          boothApi.getAll(),
          bookingApi.getAll(),
          extraApi.getAnalytics().catch(() => null), // optional; tolerates failure
        ]);
        setExpos(exposData || []);
        setBooths(boothsData || []);
        setBookings(bookingsData || []);
        setAnalytics(analyticsData);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load analytics';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <Loader text="Calculating expo analytics..." size="lg" />;
  }

  // 1. Real booth category breakdown.
  const categoryCounts = {};
  booths.forEach((b) => {
    const cat = b.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const boothCategoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  // 2. Real attendance per expo (from bookings × expos join).
  const expoAttendanceData = expos.map((e) => {
    const count = bookings.filter((b) => {
      const eid = typeof b.expo === 'object' ? b.expo?._id : b.expo;
      return eid === e._id;
    }).length;
    return {
      name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
      attendees: count,
    };
  });

  // 3. Real booth status breakdown.
  const approvedCount = booths.filter((b) => b.status === 'Approved').length;
  const pendingCount = booths.filter((b) => b.status === 'Pending').length;
  const rejectedCount = booths.filter((b) => b.status === 'Rejected').length;
  const boothStatusData = [
    { name: 'Approved', count: approvedCount },
    { name: 'Pending', count: pendingCount },
    { name: 'Rejected', count: rejectedCount },
  ];

  // KPI numbers — prefer the dedicated analytics endpoint; fall back to
  // local counts derived from the same data sets if it failed.
  const totalBookings = analytics?.totalBookings ?? bookings.length;
  const totalBooths = analytics?.totalBooths ?? booths.length;
  const totalApproved = analytics?.approvedBooths ?? approvedCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Executive Analytics & Engagement Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time intelligence on visitor registration, booth occupancy, and industry domains.
        </p>
      </div>

      {/* KPI Cards — all values sourced from the backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-terracotta-50 text-terracotta-600 rounded-2xl">
              <Ticket className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Tickets Issued</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-olive-50 text-olive-600 rounded-2xl">
              <Grid className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Booths</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalBooths}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-terracotta-50 text-terracotta-600 rounded-2xl">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Approved Exhibitors</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalApproved}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Requests In Pipeline</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booth Status breakdown (replaces the fabricated "Registration Velocity" chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Booth Application Pipeline
          </h3>
          <p className="text-xs text-slate-500 mb-6">Live breakdown of booth applications by review status</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={boothStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1D1713',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" name="Booths" fill="#BE6D48" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booth Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Exhibitor Category Diversity
          </h3>
          <p className="text-xs text-slate-500 mb-6">Domain breakdown across all booths</p>
          <div className="h-64 flex items-center justify-center">
            {boothCategoryData.length === 0 ? (
              <p className="text-xs text-slate-400">No category data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={boothCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {boothCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1D1713',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Expo Attendance Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Attendance Across Individual Expos
        </h3>
        <p className="text-xs text-slate-500 mb-6">Confirmed attendee bookings per event</p>
        <div className="h-72">
          {expoAttendanceData.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">No expo records to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expoAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1D1713',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                  }}
                />
                <Bar
                  dataKey="attendees"
                  fill="#A4512D"
                  radius={[8, 8, 0, 0]}
                  name="Attendee Registrations"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

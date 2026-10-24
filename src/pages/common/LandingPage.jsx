import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Ticket,
  Building2,
  Globe2,
  Users,
  Store,
  Award,
  Laptop,
  Shirt,
  Coins,
  Utensils,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { expoApi } from '../../api/expoApi';
import { boothApi } from '../../api/boothApi';
import { formatDate } from '../../utils/formatters';
import { getThemeIcon } from '../../utils/themeIcons';
import FloorPlanView from '../../components/floorplan/FloorPlanView';
import PublicNavbar from '../../components/common/PublicNavbar';
import terracottaTexture from '../../assets/textures/terracotta-texture.jpg';
import oliveTexture from '../../assets/textures/olive-texture.jpg';
import heroBannerBg from '../../assets/textures/hero-banner-bg.jpg';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const [dbExpos, setDbExpos] = useState([]);
  const [dbBooths, setDbBooths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [expos, booths] = await Promise.all([
          expoApi.getAll(),
          boothApi.getAll(),
        ]);
        setDbExpos(expos || []);
        setDbBooths(booths || []);
      } catch (err) {
        // Silent fail on the landing page — the page still renders marketing content.
        console.error('Failed to fetch landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // The "Upcoming Expos" showcase used to merge 4 hardcoded fake expos with
  // DB rows. We now show the first 4 DB expos directly. If the DB is empty,
  // the section falls back to a call-to-action card.
  const showcaseExpos = (dbExpos || []).slice(0, 4);
  const featuredExpo = dbExpos[0];
  const featuredExpoTitle = featuredExpo?.title || 'Upcoming Exhibition';

  // Booths for the floor plan: prefer the first DB expo so the floor plan
  // reflects a real event. If there are no DB expos, show all booths as a
  // preview (with no expo context).
  const floorPlanBooths = featuredExpo
    ? dbBooths.filter((b) => {
        const expoId = typeof b.expo === 'object' ? b.expo?._id : b.expo;
        return expoId === featuredExpo._id;
      })
    : dbBooths;

  const industries = [
    { icon: Laptop, name: 'Technology' },
    { icon: Shirt, name: 'Fashion & Lifestyle' },
    { icon: Coins, name: 'Business & Finance' },
    { icon: Utensils, name: 'Food & Hospitality' },
    { icon: Car, name: 'Automotive' },
    { icon: Home, name: 'Real Estate' },
    { icon: HeartPulse, name: 'Healthcare' },
    { icon: GraduationCap, name: 'Education' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] font-sans selection:bg-[#A4512D] selection:text-white">
      {/* 1. TOP HEADER / NAVBAR (Unified with all pages) */}
      <PublicNavbar />

      {/* 2. HERO SECTION (With exact background matching user reference) */}
      <section 
        id="hero" 
        className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center border-b border-[#E8DFD5] overflow-hidden bg-[#FAF7F2]"
        style={{
          backgroundImage: `url(${heroBannerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft wash overlay for seamless typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/80 md:via-[#FAF7F2]/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-24 relative z-10">
          <div className="max-w-xl lg:max-w-2xl space-y-6">
            <p className="text-xs font-bold tracking-[0.25em] text-[#8C7A6B] uppercase">
              Explore • Connect • Grow
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#221A15] font-normal leading-[1.12] tracking-tight">
              World-Class <br />
              <span className="italic font-medium text-[#221A15]">Exhibitions &</span> <br />
              Events
            </h1>

            <p className="text-sm sm:text-base text-[#5A4B40] max-w-lg leading-relaxed">
              Discover the most innovative expos, trade shows and industry events from around the world.
              One platform, endless opportunities.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#expos"
                className="px-7 py-3.5 bg-[#2F3A2A] hover:bg-[#1E261B] text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-lg shadow-[#2F3A2A]/20 flex items-center space-x-2 group"
              >
                <span>Explore Upcoming Expos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING EXPOS (Horizontal Card Grid matching screenshot) */}
      <section id="expos" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#E8DFD5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#221A15] tracking-tight">
              Upcoming Expos
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B5E] mt-1.5">
              Explore the latest exhibitions and be part of something extraordinary.
            </p>
          </div>

          <Link
            to={isAuthenticated ? '/attendee/expos' : '/login'}
            className="text-xs font-bold text-[#A4512D] hover:text-[#8C3F1F] flex items-center space-x-1 uppercase tracking-wider"
          >
            <span>View All Expos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Card Horizontal Exhibition Grid (real DB expos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-xs text-[#8C7A6B] bg-white rounded-3xl border border-[#E8DFD5]">
              Loading upcoming expos from the database...
            </div>
          ) : showcaseExpos.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-[#8C7A6B] bg-white rounded-3xl border border-[#E8DFD5]">
              No expos have been scheduled yet. Please check back soon.
            </div>
          ) : (
            showcaseExpos.map((expo) => (
              <div
                key={expo._id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 bg-gradient-to-br from-[#F5EFEB] to-[#E8DFD5] flex items-center justify-center border-b border-[#E8DFD5] overflow-hidden">
                    {/* Decorative texture wash */}
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#A4512D22,transparent_60%)]" />
                    {(() => {
                      const Icon = getThemeIcon(expo.theme || expo.title);
                      return (
                        <Icon className="w-14 h-14 text-[#A4512D]/40 relative z-10" strokeWidth={1.25} />
                      );
                    })()}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2]/90 text-[#221A15] backdrop-blur-sm border border-[#E8DFD5]">
                        {expo.theme || 'Exhibition'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-serif text-base font-bold text-[#221A15] group-hover:text-[#A4512D] transition leading-snug line-clamp-1">
                      {expo.title}
                    </h3>
                    <p className="text-xs text-[#7D6B5E] flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A4512D]" />
                      <span>{formatDate(expo.date)}</span>
                    </p>
                    <p className="text-xs text-[#7D6B5E] flex items-center space-x-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#A4512D]" />
                      <span>{expo.location}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/expo-details/${expo._id}`}
                    className="w-full py-2.5 px-4 bg-[#F5EFEB] hover:bg-[#A4512D] text-[#5A4B40] hover:text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Database Expos Notice */}
        {dbExpos.length > 0 && (
          <div className="mt-8 p-4 rounded-2xl bg-[#F5EFEB] border border-[#E8DFD5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <p className="text-xs font-semibold text-[#5A4B40]">
                {dbExpos.length} live event{dbExpos.length === 1 ? '' : 's'} synchronized live from MongoDB.
              </p>
            </div>
            <Link
              to={isAuthenticated ? '/attendee/expos' : '/login'}
              className="text-xs font-bold text-[#A4512D] hover:underline"
            >
              Browse Live Database →
            </Link>
          </div>
        )}
      </section>

      {/* 4. DIFFERENT INDUSTRIES. ONE PLATFORM. (Terracotta Banner with uploaded texture) */}
      <section 
        id="industries" 
        className="py-20 px-4 sm:px-8 text-white relative overflow-hidden bg-[#8C3F1F]"
        style={{
          backgroundImage: `url(${terracottaTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft color wash to preserve rich warmth and text readability over texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#71331A]/70 via-[#8C3F1F]/50 to-[#71331A]/70 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              Different Industries. <br />
              <span className="italic">One Platform.</span>
            </h2>
            <p className="text-sm text-[#F2D7C8] leading-relaxed">
              From technology to fashion, food to real estate — explore a world of possibilities
              at our diverse expos.
            </p>
            <div>
              <Link
                to={isAuthenticated ? '/attendee/expos' : '/register'}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FAF7F2] text-[#8C3F1F] hover:bg-white text-xs font-bold rounded-full shadow-lg transition"
              >
                <span>Browse All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right 8-Item Category Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition text-center flex flex-col items-center justify-center space-y-2 group cursor-pointer shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-white/95 leading-snug">
                    {ind.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WHY ATTEND OUR EXPOS? (Olive Forest Banner with uploaded texture) */}
      <section 
        id="why-us" 
        className="py-20 px-4 sm:px-8 text-white relative overflow-hidden bg-[#2F3A2A]"
        style={{
          backgroundImage: `url(${oliveTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft tint overlay to harmonize contrast and show through the canvas grain */}
        <div className="absolute inset-0 bg-[#222B1E]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2F3A2A]/40 via-transparent to-[#1B2317]/70 pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B0C1A9]">
              Excellence & Global Reach
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal">
              Why Attend Our Expos?
            </h2>
            <p className="text-xs sm:text-sm text-[#D0DBCB] leading-relaxed">
              Connect with industry leaders, discover new opportunities, and be part of a global community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live DB-derived stats (replaces the 4 hardcoded "100+/50K+/5K+/40+" counters) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <Globe2 className="w-6 h-6 text-[#B0C1A9] mb-3" />
                <p className="font-serif text-3xl sm:text-4xl font-bold">{dbExpos.length}</p>
                <p className="text-xs text-[#D0DBCB] uppercase tracking-wider mt-1">Live Expos</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <Store className="w-6 h-6 text-[#B0C1A9] mb-3" />
                <p className="font-serif text-3xl sm:text-4xl font-bold">{dbBooths.length}</p>
                <p className="text-xs text-[#D0DBCB] uppercase tracking-wider mt-1">Booth Reservations</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <Award className="w-6 h-6 text-[#B0C1A9] mb-3" />
                <p className="font-serif text-3xl sm:text-4xl font-bold">
                  {dbBooths.filter((b) => b.status === 'Approved').length}
                </p>
                <p className="text-xs text-[#D0DBCB] uppercase tracking-wider mt-1">Approved Stalls</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition shadow-sm">
                <Users className="w-6 h-6 text-[#B0C1A9] mb-3" />
                <p className="font-serif text-3xl sm:text-4xl font-bold">
                  {Array.from(new Set(dbExpos.map((e) => e.location).filter(Boolean))).length}
                </p>
                <p className="text-xs text-[#D0DBCB] uppercase tracking-wider mt-1">Unique Venues</p>
              </div>
            </div>

            {/* Static venue imagery card — no fake "Watch Video" button */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border-2 border-white/20 aspect-[16/10] shadow-xl">
              <img
                src={terracottaTexture}
                alt="Expo Hall"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#2F3A2A]/60 flex items-center justify-center text-center p-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-white">{featuredExpoTitle}</h3>
                  <p className="text-xs text-[#D0DBCB] max-w-sm mx-auto">
                    {featuredExpo?.description || 'Explore the latest exhibitions and reserve your space.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE 2D FLOOR PLAN SECTION */}
      <section id="floorplan" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A4512D]">
              Live Space Allocation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#221A15] tracking-tight mt-1">
              Interactive 2D Hall Floor Plan
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B5E] mt-1">
              Select Hall A, Hall B, or Hall C to inspect available stalls, confirmed exhibitors, and reserve spaces.
            </p>
          </div>

          <Link
            to={isAuthenticated ? '/exhibitor/booths' : '/register'}
            className="px-6 py-2.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-full shadow-md shadow-[#A4512D]/20 transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Apply for Booth</span>
          </Link>
        </div>

        {/* Component with warm styling container */}
        <div className="rounded-3xl shadow-xl overflow-hidden border border-[#E8DFD5] bg-white">
          <FloorPlanView
            booths={floorPlanBooths}
            currentExpoTitle={featuredExpoTitle}
            interactive={true}
          />
        </div>
      </section>

      {/* 7. THREE ECOSYSTEM WORKSPACES (Organizers, Exhibitors, Attendees) */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5EFEB] border-t border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A4512D]">
              Unified Management
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#221A15]">
              Tailored Portals for Every Role
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B5E]">
              From coordinating an entire convention hall to reserving an individual stall or booking delegate passes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Organizer */}
            <div className="p-8 rounded-3xl bg-white border border-[#E8DFD5] shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F9ECE4] text-[#A4512D] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#221A15]">Event Organizers (Admin)</h3>
                <p className="text-xs text-[#7D6B5E] leading-relaxed">
                  Command center for launching expos, approving or rejecting exhibitor booth
                  applications, creating keynote agendas, and tracking live metrics.
                </p>
                <ul className="space-y-2 text-xs text-[#5A4B40]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                    <span>Real-time Space Approvals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                    <span>Executive Occupancy Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                    <span>Support Ticket Resolution</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/login"
                className="py-3 px-4 bg-[#221A15] hover:bg-[#A4512D] text-white font-bold text-xs rounded-full transition text-center"
              >
                Sign In as Organizer →
              </Link>
            </div>

            {/* Exhibitors */}
            <div className="p-8 rounded-3xl bg-white border border-[#E8DFD5] shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E7EDE4] text-[#3F4D3A] flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#221A15]">Exhibitors & Vendors</h3>
                <p className="text-xs text-[#7D6B5E] leading-relaxed">
                  Reserve prime stalls on the visual floor plan, catalog your showcase demos, register
                  booth team badges, and message organizers directly.
                </p>
                <ul className="space-y-2 text-xs text-[#5A4B40]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3F4D3A] flex-shrink-0" />
                    <span>Interactive Stall Reservations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3F4D3A] flex-shrink-0" />
                    <span>Showcase Products & Staff</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3F4D3A] flex-shrink-0" />
                    <span>Live Organizer Messenger</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="py-3 px-4 bg-[#A4512D] hover:bg-[#8C3F1F] text-white font-bold text-xs rounded-full transition text-center shadow-md shadow-[#A4512D]/20"
              >
                Register as Exhibitor →
              </Link>
            </div>

            {/* Attendees */}
            <div className="p-8 rounded-3xl bg-white border border-[#E8DFD5] shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDE4DC] text-[#71331A] flex items-center justify-center font-bold">
                  <Ticket className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#221A15]">Visitors & Attendees</h3>
                <p className="text-xs text-[#7D6B5E] leading-relaxed">
                  Claim admission passes with QR codes, print event passes, bookmark session agendas,
                  and schedule 1-on-1 meetings with exhibitors.
                </p>
                <ul className="space-y-2 text-xs text-[#5A4B40]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#71331A] flex-shrink-0" />
                    <span>Digital Passes & QR Check-In</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#71331A] flex-shrink-0" />
                    <span>Personal Session Agendas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#71331A] flex-shrink-0" />
                    <span>Exhibitor Meeting Scheduler</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="py-3 px-4 bg-[#221A15] hover:bg-[#A4512D] text-white font-bold text-xs rounded-full transition text-center"
              >
                Get Free Attendee Pass →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BE PART OF SOMETHING BIGGER (Banner matching screenshot) */}
      <section className="py-20 px-4 sm:px-8 bg-[#221A15] text-white relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            Be Part of Something Bigger
          </h2>
          <p className="text-xs sm:text-sm text-[#D2C0B0] max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals, creators and innovators at our next expo. Secure your pass today or showcase your brand.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs sm:text-sm font-bold rounded-full shadow-xl transition"
            >
              Register as Visitor →
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-[#D2C0B0]/40 text-xs sm:text-sm font-bold rounded-full transition"
            >
              Become an Exhibitor →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. LUXURY FOOTER (Deep Espresso matching screenshot) */}
      <footer id="contact" className="py-16 px-4 sm:px-8 bg-[#18120E] text-[#AFA49C] border-t border-[#2C241F]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2C241F]">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-[#A4512D] text-white flex items-center justify-center font-serif font-bold text-sm">
                E
              </span>
              <span className="font-serif text-lg font-bold text-white tracking-wider">
                EXPO<span className="text-[#A4512D]">SPHERE</span>
              </span>
            </div>
            <p className="text-xs text-[#83746A] leading-relaxed">
              The premier platform for world-class exhibitions, booth space reservations, and attendee management.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#hero" className="hover:text-white transition">Home</a></li>
              <li><a href="#expos" className="hover:text-white transition">Expos Directory</a></li>
              <li><a href="#floorplan" className="hover:text-white transition">Interactive Floor Plan</a></li>
              <li><a href="#why-us" className="hover:text-white transition">About the Platform</a></li>
              <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Event Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-white transition">Technology & AI</span></li>
              <li><span className="hover:text-white transition">Fashion & Lifestyle</span></li>
              <li><span className="hover:text-white transition">Business & Finance</span></li>
              <li><span className="hover:text-white transition">Food & Hospitality</span></li>
              <li><span className="hover:text-white transition">Automotive & Hardware</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Get in Touch</h4>
            <div className="space-y-3 text-xs text-[#83746A]">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>Expo Center, Dubai, UAE & Karachi, PK</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>info@eventsphere.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>+971 4 123 4567</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B5A4E] gap-4">
          <p>© 2026 EventSphere Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/login" className="hover:text-[#AFA49C] transition">Admin Portal</Link>
            <Link to="/login" className="hover:text-[#AFA49C] transition">Exhibitor Portal</Link>
            <Link to="/login" className="hover:text-[#AFA49C] transition">Attendee Pass</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

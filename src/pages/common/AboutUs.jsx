import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Globe2,
  Users,
  Lightbulb,
  ShieldCheck,
  Award,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  Building2
} from 'lucide-react';
import PublicNavbar from '../../components/common/PublicNavbar';
import PublicFooter from '../../components/common/PublicFooter';
import terracottaTexture from '../../assets/textures/terracotta-texture.jpg';
import oliveTexture from '../../assets/textures/olive-texture.jpg';

export const AboutUs = () => {
  const pillars = [
    {
      icon: Lightbulb,
      title: 'Pioneering Innovation',
      tagline: 'Technology-Driven Experiences',
      description:
        'From interactive 2D floor plans and real-time booth bookings to contactless digital passes and smart badges, we redefine how expos operate in the modern era.'
    },
    {
      icon: Users,
      title: 'Meaningful Collaboration',
      tagline: 'Bridging Global Minds',
      description:
        'We design spaces and curated networking sessions that turn fleeting encounters into high-impact partnerships, joint ventures, and global commercial contracts.'
    },
    {
      icon: Globe2,
      title: 'Boundless Global Reach',
      tagline: 'From Dubai to Karachi & Beyond',
      description:
        'Connecting diverse markets across the Middle East, South Asia, Europe, and the Americas, bringing international exhibitors to emerging and established commercial hubs.'
    }
  ];

  // Brand-marketing milestones — historical narrative about the platform itself.
  // The original entries cited specific fake counts ("50,000 verified attendees",
  // "50+ annual expos") which the backend does not provide; those numbers have
  // been removed in favour of qualitative narrative.
  const milestones = [
    { year: '2021', title: 'The Genesis', desc: 'Launched as a boutique design exhibition in Dubai.' },
    { year: '2023', title: 'Cross-Border Expansion', desc: 'Expanded into South Asia and Europe, bringing international exhibitors and visitors together.' },
    { year: '2025', title: 'Smart Floor Plan Launch', desc: 'Introduced instant digital booth reservations and synchronized attendee + exhibitor portals.' },
    { year: '2026', title: 'The Premier Platform', desc: 'Now hosting expos across Tech, Design, Gastronomy, and Industry segments.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col font-sans selection:bg-[#A4512D] selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 border-b border-[#E8DFD5] overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE1] to-[#FAF7F2]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#A4512D]/10 text-[#A4512D] text-xs font-bold uppercase tracking-widest border border-[#A4512D]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About EventSphere</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#221A15] leading-[1.15]">
            Bringing people, businesses and ideas together through{' '}
            <span className="italic font-normal text-[#A4512D]">world-class exhibitions.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#6E5D50] leading-relaxed font-normal">
            EventSphere is the premier exhibition ecosystem designed to bridge world-class commerce, design,
            and technological progress. We connect pioneering exhibitors with discerning attendees through 
            refined curation, state-of-the-art floor plans, and frictionless ticketing.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/expos"
              className="px-8 py-3.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-sm font-bold rounded-full shadow-lg shadow-[#A4512D]/20 transition flex items-center space-x-2"
            >
              <span>Explore Expos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white hover:bg-[#EFE7DC] text-[#221A15] border border-[#D8C9BB] text-sm font-bold rounded-full transition"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image composition */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#E8DFD5] bg-[#E8DFD5] aspect-[4/3] relative">
              <img
                src={terracottaTexture}
                alt="Exhibition Hall"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#221A15]/40 via-transparent to-transparent" />
            </div>
            {/* Overlapping badge — qualitative tagline, no fake stats */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:-right-6 bg-[#221A15] text-[#FAF7F2] p-6 rounded-2xl shadow-xl max-w-xs border border-[#3A2D25] hidden sm:block">
              <span className="text-2xl font-serif font-bold italic text-[#DDB892]">Curated.</span>
              <p className="text-xs text-[#AFA49C] mt-1 font-medium leading-relaxed">
                International trade expos delivered with precision and luxury editorial standards.
              </p>
            </div>
          </div>

          {/* Story Narrative */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A4512D]">
              Our Foundation & Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#221A15] leading-tight">
              Crafting environments where <span className="italic font-normal">breakthrough deals</span> happen naturally.
            </h2>
            <p className="text-sm sm:text-base text-[#6E5D50] leading-relaxed">
              Founded by exhibition curators and technological innovators, EventSphere was born out of 
              a dissatisfaction with disorganized trade shows and outdated booth booking methods. We believed 
              large-scale summits should exude the same elegance and clarity as a gallery opening.
            </p>
            <p className="text-sm sm:text-base text-[#6E5D50] leading-relaxed">
              Today, EventSphere serves as the central hub for industry-defining expos across Dubai, Karachi, 
              Riyadh, and beyond. We provide exhibitors with real-time floor plan visualization, instant digital pass 
              distribution, and automated networking directories.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-[#221A15]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>Curated Industry Leaders</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>Instant Digital Passes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>Interactive Floor Plans</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
                <span>Verified Buyer Crowds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars (Screen 6 from design) */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5EFEB] border-y border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A4512D]">
              Our Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#221A15]">
              The Three Pillars of EventSphere
            </h2>
            <p className="text-sm text-[#6E5D50]">
              Every event we organize and every line of code in our platform is anchored in these guiding values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-[#E4D8CB] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#A4512D]/10 text-[#A4512D] flex items-center justify-center group-hover:bg-[#A4512D] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B]">
                        {pillar.tagline}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#221A15] mt-1">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6E5D50] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-[#F0E6DB] mt-6 flex items-center text-xs font-bold text-[#A4512D] group-hover:translate-x-1 transition-transform">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Mission Banner */}
      <section className="relative py-24 px-4 sm:px-8 bg-[#18120E] text-white overflow-hidden">
        {/* Background texture overlay (uses the project's olive texture image) */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src={oliveTexture}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DDB892]">
            Our Mission Statement
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight max-w-4xl mx-auto">
            “To empower visionary enterprises with stages worthy of their breakthroughs, cultivating commerce and human progress.”
          </h2>
          <div className="w-16 h-1 bg-[#A4512D] mx-auto rounded-full" />

          {/* Mission statement — no fabricated metrics (the original 4-stat
              block cited unverifiable "120K+/2,500+/50+/98.4%" numbers; removed). */}
          <div className="pt-4 text-sm text-[#AFA49C] max-w-2xl mx-auto leading-relaxed">
            We measure our impact by the strength of the partnerships formed on this platform, not by inflated metrics. Every expo listed is a real, scheduled event sourced from our database.
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A4512D]">
            Chronology
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#221A15]">
            Our Journey Over Time
          </h2>
        </div>

        <div className="relative border-l-2 border-[#D8C9BB] ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-10">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-4 h-4 rounded-full bg-[#FAF7F2] border-4 border-[#A4512D] group-hover:scale-125 transition-transform" />
              <div className="sm:absolute sm:-left-32 sm:top-0 text-left sm:text-right w-24">
                <span className="font-serif text-lg font-bold text-[#A4512D]">{item.year}</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-sm max-w-xl">
                <h3 className="font-serif text-lg font-bold text-[#221A15]">{item.title}</h3>
                <p className="text-xs text-[#6E5D50] mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team CTA — replaces the fake "Leadership" team showcase. The
          previous section rendered 3 fake executives with Unsplash portraits
          and fictional bios; those have been removed and the section turned
          into a recruiting / partnership CTA instead. */}
      <section className="py-20 px-4 sm:px-8 bg-[#F5EFEB] border-t border-[#E8DFD5]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A4512D]">
            Built By Practitioners
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#221A15]">
            A Platform Built For The Industry
          </h2>
          <p className="text-sm text-[#6E5D50] max-w-2xl mx-auto leading-relaxed">
            EventSphere is shaped by hospitality leaders, software engineers, and exhibition curators working alongside real organizers and exhibitors. The platform reflects the needs voiced by the people who actually run and visit expos.
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-full shadow-md shadow-[#A4512D]/20 transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-8 bg-[#FAF7F2] border-t border-[#E8DFD5]">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#221A15] to-[#34261E] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Be Part of Our Next World-Class Exhibition
          </h2>
          <p className="text-sm text-[#D3C6BC] max-w-2xl mx-auto leading-relaxed">
            Whether you want to exhibit your brand before thousands of verified buyers or secure your pass 
            to keynote sessions, your journey starts here.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-[#A4512D]/30 transition"
            >
              Register as Attendee
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-full transition"
            >
              Register as Exhibitor
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutUs;

import React, { useState } from 'react';
import { Layers, CheckCircle2, Clock, XCircle, Building2, User, Tag } from 'lucide-react';

export const FloorPlanView = ({
  booths = [],
  selectedBoothNumber,
  onSelectBooth,
  interactive = true,
  currentExpoTitle = 'Current Expo',
}) => {
  const [activeHall, setActiveHall] = useState('Hall A');
  const [hoveredBooth, setHoveredBooth] = useState(null);

  // Generate standardized 36 booths across 3 halls
  // Hall A: A-01 to A-12 (Tech & AI)
  // Hall B: B-01 to B-12 (Software & Cloud)
  // Hall C: C-01 to C-12 (Innovation & Hardware)
  const hallConfigs = {
    'Hall A': { prefix: 'A', category: 'Tech & AI', color: 'indigo' },
    'Hall B': { prefix: 'B', category: 'Software & Cloud', color: 'blue' },
    'Hall C': { prefix: 'C', category: 'Innovation & Hardware', color: 'purple' },
  };

  const getBoothStatus = (boothNum) => {
    // Normalize matching e.g. "A-12" or "A12"
    const match = booths.find((b) => {
      const bNum = (b.boothNumber || '').replace('-', '').toUpperCase();
      const target = (boothNum || '').replace('-', '').toUpperCase();
      return bNum === target;
    });

    if (!match) return { status: 'Available', data: null };
    return { status: match.status || 'Pending', data: match };
  };

  const activePrefix = hallConfigs[activeHall]?.prefix || 'A';
  const hallBooths = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const formatted = `${activePrefix}-${num < 10 ? '0' + num : num}`;
    const { status, data } = getBoothStatus(formatted);
    return {
      boothNumber: formatted,
      status,
      data,
      category: data?.category || hallConfigs[activeHall].category,
    };
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E8DFD5] shadow-sm">
      {/* Header & Hall Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD5]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#F9ECE4] text-[#A4512D]">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold font-serif text-[#221A15]">Interactive Expo Floor Plan</h2>
          </div>
          <p className="text-xs text-[#7D6B5E] mt-1">
            {currentExpoTitle} • Select a booth to view details or apply
          </p>
        </div>

        {/* Hall Tabs */}
        <div className="flex bg-[#F5EFEB] p-1 rounded-xl">
          {Object.keys(hallConfigs).map((hall) => (
            <button
              key={hall}
              type="button"
              onClick={() => setActiveHall(hall)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeHall === hall
                  ? 'bg-white text-[#A4512D] shadow-sm font-bold'
                  : 'text-[#7D6B5E] hover:text-[#221A15]'
              }`}
            >
              {hall}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 py-4 px-2 text-xs text-[#5A4B40] border-b border-[#E8DFD5] mb-6">
        <span className="font-semibold text-[#221A15]">Legend:</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-500"></span>
          <span>Pending Request</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-500"></span>
          <span>Occupied (Approved)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-[#A4512D] ring-2 ring-[#E5B79F]"></span>
          <span>Selected</span>
        </div>
      </div>

      {/* Main Floor Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booth Floor Grid */}
        <div className="lg:col-span-2 bg-slate-50/60 p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              North Entrance / Stage Area
            </span>
            <span className="text-xs font-medium text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-md">
              {activeHall} ({hallConfigs[activeHall].category})
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
            {hallBooths.map((booth) => {
              const isSelected = selectedBoothNumber === booth.boothNumber;
              const isAvailable = booth.status === 'Available';
              const isApproved = booth.status === 'Approved';
              const isPending = booth.status === 'Pending';

              let bgClasses = 'bg-emerald-500/10 border-emerald-500 text-emerald-800 hover:bg-emerald-500/20';
              if (isApproved) {
                bgClasses = 'bg-rose-500/10 border-rose-400 text-rose-800 cursor-not-allowed opacity-90';
              } else if (isPending) {
                bgClasses = 'bg-amber-500/10 border-amber-400 text-amber-800 hover:bg-amber-500/20';
              }

              if (isSelected) {
                bgClasses = 'bg-[#A4512D] border-[#A4512D] text-white shadow-lg ring-4 ring-[#F2D7C8]';
              }

              return (
                <button
                  key={booth.boothNumber}
                  type="button"
                  disabled={!interactive || isApproved}
                  onClick={() => onSelectBooth && onSelectBooth(booth)}
                  onMouseEnter={() => setHoveredBooth(booth)}
                  className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col justify-between p-3 text-left transition-all relative group ${bgClasses}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {booth.boothNumber}
                    </span>
                    {isApproved && <XCircle className="w-4 h-4 text-rose-500" />}
                    {isPending && <Clock className="w-4 h-4 text-amber-500" />}
                    {isAvailable && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>

                  <div>
                    <p className={`text-[11px] font-semibold truncate ${isSelected ? 'text-terracotta-100' : 'text-slate-600'}`}>
                      {isApproved
                        ? booth.data?.exhibitor?.name || 'Reserved'
                        : isPending
                        ? 'Pending Review'
                        : 'Available Space'}
                    </p>
                    <span className={`text-[10px] block truncate ${isSelected ? 'text-terracotta-200' : 'text-slate-400'}`}>
                      {booth.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-400 px-1">
            <span>South Exit & Restrooms</span>
            <span>Emergency Aisle</span>
          </div>
        </div>

        {/* Booth Detail Inspector Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
              Booth Inspector
            </h4>

            {(() => {
              const activeInspected =
                hallBooths.find((b) => b.boothNumber === selectedBoothNumber) ||
                hoveredBooth ||
                hallBooths[0];

              if (!activeInspected) {
                return <p className="text-xs text-slate-500">Hover or click a booth to inspect.</p>;
              }

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">
                      {activeInspected.boothNumber}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        activeInspected.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-700'
                          : activeInspected.status === 'Approved'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {activeInspected.status}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-start space-x-2.5">
                      <Tag className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block">Category:</span>
                        <span className="font-semibold text-slate-800">
                          {activeInspected.category || 'General Expo'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block">Zone:</span>
                        <span className="font-semibold text-slate-800">
                          {activeHall} - Standard 3x3m Booth
                        </span>
                      </div>
                    </div>

                    {activeInspected.data?.exhibitor && (
                      <div className="flex items-start space-x-2.5">
                        <User className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-500 block">Exhibitor:</span>
                          <span className="font-semibold text-slate-800">
                            {activeInspected.data.exhibitor.name} ({activeInspected.data.exhibitor.email})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-6 border-t border-slate-200 mt-6">
            <p className="text-[11px] text-slate-500 italic">
              Floor plan syncs in real-time across all user dashboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanView;

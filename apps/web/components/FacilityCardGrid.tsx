"use client";

import React, { useState } from 'react';
import { Building2, Phone, AlertTriangle, Navigation, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface Facility {
  id: string;
  name: string;
  type: 'sub_centre' | 'phc' | 'rural_hospital' | 'district_hospital';
  village: string;
  taluka: string;
  district: string;
  address: string;
  phone: string;
  emergency_contact: string;
  distance_approx_km: number;
  services_offered: string[];
  is_active?: boolean;
}

interface FacilityCardGridProps {
  facilities: Facility[];
  onSelectFacility?: (facility: Facility) => void;
  selectedId?: string;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

export default function FacilityCardGrid({
  facilities,
  onSelectFacility,
  selectedId,
  showFilters = true,
  title = "Public Healthcare Facility Network",
  subtitle = "Maharashtra District Health Infrastructure Directory (Non-Map Grid View)"
}: FacilityCardGridProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFacilities = facilities.filter(f => {
    const matchesType = selectedType === "all" || f.type === selectedType;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.taluka.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sub_centre':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">Sub-Centre</span>;
      case 'phc':
        return <span className="bg-brand-100 text-brand-800 border border-brand-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">Primary Health Centre (PHC)</span>;
      case 'rural_hospital':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">Rural Hospital</span>;
      case 'district_hospital':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">District Hospital (Specialist)</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Facility</span>;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-brand-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search facility name, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Filter Category Chips */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Filter Level:</span>
          {[
            { key: "all", label: "All Facilities" },
            { key: "sub_centre", label: "Sub-Centres" },
            { key: "phc", label: "PHCs" },
            { key: "rural_hospital", label: "Rural Hospitals" },
            { key: "district_hospital", label: "District Hospitals" }
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setSelectedType(btn.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedType === btn.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-brand-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Facility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.map((facility) => {
          const isSelected = selectedId === facility.id;
          return (
            <div
              key={facility.id}
              className={`bg-white rounded-2xl p-5 border transition shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-brand-600 ring-2 ring-brand-500/20 bg-brand-50/20'
                  : 'border-slate-200 hover:border-brand-300'
              }`}
            >
              <div className="space-y-3">
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-tight">
                      {facility.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                      <span>{facility.village}, Taluka {facility.taluka}</span>
                    </p>
                  </div>
                  {getTypeBadge(facility.type)}
                </div>

                {/* Distance and Address */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 font-semibold text-brand-700">
                      <Navigation className="w-3.5 h-3.5" />
                      Approx. {facility.distance_approx_km} km away
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Operational
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{facility.address}</p>
                </div>

                {/* Phone Contacts */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    {facility.phone}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-rose-700">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Emergency: {facility.emergency_contact}
                  </span>
                </div>

                {/* Services Chips */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Services Provided:</span>
                  <div className="flex flex-wrap gap-1">
                    {facility.services_offered.map((srv, idx) => (
                      <span key={idx} className="bg-brand-50 text-brand-800 text-[11px] font-medium px-2 py-0.5 rounded-md border border-brand-100">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action */}
              {onSelectFacility && (
                <button
                  onClick={() => onSelectFacility(facility)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-900 text-white hover:bg-brand-600'
                  }`}
                >
                  {isSelected ? 'Facility Selected' : 'Select Facility'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No health facilities found</p>
          <p className="text-xs text-slate-500 mt-0.5">Try clearing filters or adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}

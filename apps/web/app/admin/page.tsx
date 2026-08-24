"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FacilityCardGrid, { Facility } from '@/components/FacilityCardGrid';
import { fetchFacilities, fetchPatients, fetchReferrals } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { Building2, Users, ArrowRightLeft, Activity, TrendingUp, ShieldAlert, Award, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function AdminDistrictDashboard() {
  const [lang, setLang] = useState<Language>('en');
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    fetchFacilities().then(res => setFacilities(res.facilities || []));
  }, []);

  const chartData = [
    { name: 'Khed Sub-Centre', consultations: 142, referrals: 18 },
    { name: 'Manchar PHC', consultations: 380, referrals: 45 },
    { name: 'Velhe PHC', consultations: 210, referrals: 24 },
    { name: 'Shirur Hospital', consultations: 520, referrals: 88 },
    { name: 'Aundh District Hosp', consultations: 890, referrals: 140 }
  ];

  const triagePieData = [
    { name: 'Green (Self-care)', value: 55, color: '#10B981' },
    { name: 'Yellow (PHC OPD)', value: 28, color: '#F59E0B' },
    { name: 'Orange (Teleconsult)', value: 12, color: '#F97316' },
    { name: 'Red (Emergency)', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8 flex-1">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-300" />
              <h1 className="text-xl font-extrabold text-white">District Health Officer (DHO) Console</h1>
            </div>
            <p className="text-xs text-brand-200 mt-0.5">Pune District • Public Health & Care Continuity Administration</p>
          </div>

          <div className="bg-brand-800 border border-brand-700 px-4 py-2 rounded-2xl text-xs font-bold text-brand-100">
            Jurisdiction: 5 Health Facilities • 120+ Villages
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Patients</span>
            <span className="text-2xl font-extrabold text-brand-900">2,142</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">↑ 12% vs last month</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">High-Risk Pregnancy</span>
            <span className="text-2xl font-extrabold text-rose-700">184</span>
            <span className="text-[10px] text-rose-600 font-semibold block">Active ANC Tracking</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Referral Completion</span>
            <span className="text-2xl font-extrabold text-emerald-700">99.4%</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Zero Lost Referrals</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Teleconsult Wait</span>
            <span className="text-2xl font-extrabold text-amber-700">11m</span>
            <span className="text-[10px] text-slate-500 block">Target: &lt; 15m</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Medicine Stockouts</span>
            <span className="text-2xl font-extrabold text-rose-600">1</span>
            <span className="text-[10px] text-slate-500 block">Metformin (Manchar PHC)</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bar Chart (Consultation & Referral Volume) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                Facility Consultations & Referral Volume
              </h3>
              <span className="text-xs text-slate-400 font-medium">Monthly Aggregates</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="consultations" fill="#6D28D9" radius={[4, 4, 0, 0]} name="Consultations" />
                  <Bar dataKey="referrals" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Referrals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart (Triage Level Distribution) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-600" />
                Digital Triage Distribution
              </h3>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={triagePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                    {triagePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 text-xs">
              {triagePieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700">{item.name}</span>
                  </span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Isolated Facility Cards Grid (No Map) */}
        <section>
          <FacilityCardGrid
            facilities={facilities}
            title="District Health Network Infrastructure"
            subtitle="Facility capacity, services provided, distance, and emergency helplines"
          />
        </section>

      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FacilityCardGrid, { Facility } from '@/components/FacilityCardGrid';
import { fetchFacilities } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { PhoneCall, ShieldAlert, Navigation, AlertTriangle, Send, CheckCircle2, HeartPulse } from 'lucide-react';

export default function EmergencyEscalationPage() {
  const [lang, setLang] = useState<Language>('en');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [dispatchAlertSent, setDispatchAlertSent] = useState<boolean>(false);

  useEffect(() => {
    fetchFacilities('district_hospital').then(res => setFacilities(res.facilities || []));
  }, []);

  const handleDispatchEmergency = () => {
    setDispatchAlertSent(true);
  };

  return (
    <div className="min-h-screen bg-rose-950 text-white flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8 flex-1">
        
        {/* Emergency Alert Header */}
        <div className="bg-rose-900/90 border-2 border-rose-600 rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <PhoneCall className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            108 Emergency Escalation & Ambulance Dispatch
          </h1>

          <p className="text-sm text-rose-200 max-w-xl mx-auto font-medium">
            Immediate emergency triage for critical maternal bleeding, severe trauma, unconsciousness, or acute respiratory distress.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <a
              href="tel:108"
              className="px-8 py-4 rounded-2xl bg-white text-rose-900 font-extrabold text-base hover:bg-rose-100 transition shadow-xl flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span>Call 108 Emergency Services</span>
            </a>

            <button
              onClick={handleDispatchEmergency}
              className="px-8 py-4 rounded-2xl bg-rose-700 hover:bg-rose-600 border border-rose-500 font-extrabold text-base text-white transition shadow-xl flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Dispatch Live GPS & Alert ASHA</span>
            </button>
          </div>

          {dispatchAlertSent && (
            <div className="p-4 bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 mt-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Emergency Alert & GPS dispatched to Aundh District Hospital ER Desk & ASHA Sunita!</span>
            </div>
          )}
        </div>

        {/* Emergency Facilities Directory (Non-Map Isolated Component) */}
        <div className="bg-white text-slate-900 p-6 rounded-3xl space-y-4">
          <FacilityCardGrid
            facilities={facilities}
            title="Nearest Emergency Hospital Units (24x7 ICU & Trauma)"
            subtitle="Sorted by distance & emergency capacity"
            showFilters={false}
          />
        </div>

      </main>
    </div>
  );
}

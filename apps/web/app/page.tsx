"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FacilityCardGrid, { Facility } from '@/components/FacilityCardGrid';
import { translations, Language } from '@/lib/i18n';
import { fetchFacilities } from '@/lib/api';
import { Activity, ShieldCheck, Stethoscope, Users, Building2, PhoneCall, ArrowRight, HeartPulse, CheckCircle2, Award } from 'lucide-react';

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('en');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const t = translations[lang];

  useEffect(() => {
    fetchFacilities().then(res => {
      if (res && res.facilities) setFacilities(res.facilities);
    });
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-brand-900 text-white py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/30 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-700/80 border border-brand-500/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-brand-200 backdrop-blur-sm">
            <Award className="w-4 h-4 text-amber-400" />
            Government of Maharashtra Innovation Society Initiative
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto font-normal">
            {t.hero.subtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="/patient"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2"
            >
              <HeartPulse className="w-5 h-5" />
              <span>{t.hero.triageBtn}</span>
            </Link>

            <Link
              href="/asha"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm border border-brand-400/40 shadow-lg shadow-brand-950/40 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-brand-200" />
              <span>{t.asha.title}</span>
            </Link>

            <Link
              href="/emergency"
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5 animate-pulse text-white" />
              <span>{t.hero.emergencyBtn}</span>
            </Link>
          </div>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-brand-700/50">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <span className="block text-2xl font-bold text-white">500+</span>
              <span className="text-xs text-brand-200 font-medium">Sub-Centres Connected</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <span className="block text-2xl font-bold text-emerald-400">99.4%</span>
              <span className="text-xs text-brand-200 font-medium">Referral Loop Tracking</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <span className="block text-2xl font-bold text-amber-400">&lt; 15 min</span>
              <span className="text-xs text-brand-200 font-medium">Avg Teleconsult Wait</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <span className="block text-2xl font-bold text-brand-300">100%</span>
              <span className="text-xs text-brand-200 font-medium">Offline Field Resilient</span>
            </div>
          </div>
        </div>
      </section>

      {/* How MedEase Works Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-900">How MedEase Connects Rural Care</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Strengthening existing PHCs, Sub-centres, and District Hospitals without replacing frontline health workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900">Community Triage & Screening</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients or ASHA workers run digital triage surveys on low-connectivity devices. Risk levels (Green, Yellow, Orange, Red) are assigned automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900">PHC Consultation & Teleconsult</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical Officers consult in-person or connect via managed WebRTC teleconsultation with specialists at District Hospitals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900">Referral Audit & Follow-Up</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-risk pregnancy and chronic care referrals are tracked end-to-end with immutable status change logs so no patient drops off.
            </p>
          </div>
        </div>
      </section>

      {/* Facility Grid Directory Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <FacilityCardGrid facilities={facilities} />
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-200 text-xs py-8 px-4 border-t border-brand-800 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-bold text-white text-sm">MedEase Platform</span>
            <p className="text-brand-300 mt-0.5">Built for Department of Skills, Employment, Entrepreneurship & Innovation, Government of Maharashtra.</p>
          </div>
          <div className="flex space-x-4 text-brand-300 font-medium">
            <span>ABHA ABDM Compatible</span>
            <span>•</span>
            <span>HL7 FHIR R4 Standardized</span>
            <span>•</span>
            <span>Offline-First Field Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

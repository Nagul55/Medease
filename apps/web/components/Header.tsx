"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Globe, Activity, Stethoscope, User, Pill, Building2, PhoneCall, Wifi, WifiOff } from 'lucide-react';
import { translations, Language } from '@/lib/i18n';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline?: boolean;
}

export default function Header({ currentLang, onLanguageChange, isOnline = true }: HeaderProps) {
  const t = translations[currentLang];
  const [selectedRole, setSelectedRole] = useState<string>("patient");

  return (
    <header className="w-full bg-white border-b border-brand-100 shadow-sm sticky top-0 z-50">
      {/* Govt Maharashtra Top Bar */}
      <div className="bg-brand-900 text-white text-xs py-1 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold tracking-wide">महाराष्ट्र शासन | Government of Maharashtra</span>
          <span className="opacity-40">|</span>
          <span className="hidden md:inline text-brand-200">Dept. of Public Health & Skill Innovation</span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Online/Offline indicator */}
          <div className="flex items-center space-x-1 bg-brand-800 px-2 py-0.5 rounded text-[11px]">
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-medium">Offline (Sync Ready)</span>
              </>
            )}
          </div>
          
          {/* Language Picker */}
          <div className="flex items-center space-x-1 bg-brand-800/80 px-2 py-0.5 rounded">
            <Globe className="w-3 h-3 text-brand-300" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${currentLang === 'en' ? 'bg-brand-600 text-white' : 'text-brand-200 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${currentLang === 'mr' ? 'bg-brand-600 text-white' : 'text-brand-200 hover:text-white'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${currentLang === 'hi' ? 'bg-brand-600 text-white' : 'text-brand-200 hover:text-white'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-brand-900 tracking-tight">{t.appName}</span>
              <span className="text-[10px] bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full border border-brand-200">
                FHIR Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.tagline}</p>
          </div>
        </Link>

        {/* User Experience Navigation Links */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1">
          <Link href="/patient" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition flex items-center space-x-1.5">
            <User className="w-4 h-4 text-brand-600" />
            <span>Patient</span>
          </Link>

          <Link href="/asha" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>ASHA Field App</span>
          </Link>

          <Link href="/doctor" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition flex items-center space-x-1.5">
            <Stethoscope className="w-4 h-4 text-brand-600" />
            <span>Doctor PHC</span>
          </Link>

          <Link href="/referrals" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition">
            Referrals
          </Link>

          <Link href="/pharmacist" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition flex items-center space-x-1.5">
            <Pill className="w-4 h-4 text-brand-600" />
            <span>Pharmacy</span>
          </Link>

          <Link href="/admin" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Admin</span>
          </Link>

          <Link href="/emergency" className="px-3 py-1.5 rounded-lg text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center space-x-1">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>108 Emergency</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

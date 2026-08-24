"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { Shield, User, Stethoscope, Pill, Building2, Phone, Key, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('en');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'asha' | 'doctor' | 'pharmacist' | 'admin'>('patient');
  const [phone, setPhone] = useState<string>("+91-9811100001");
  const [otp, setOtp] = useState<string>("123456");
  const [email, setEmail] = useState<string>("doctor.patil@mahaphc.gov.in");
  const [password, setPassword] = useState<string>("••••••••");
  const [step, setStep] = useState<'input' | 'otp'>('input');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'patient' || selectedRole === 'asha') {
      if (step === 'input') {
        setStep('otp');
        return;
      }
    }

    // Direct routing based on selected role
    switch (selectedRole) {
      case 'patient':
        router.push('/patient');
        break;
      case 'asha':
        router.push('/asha');
        break;
      case 'doctor':
        router.push('/doctor');
        break;
      case 'pharmacist':
        router.push('/pharmacist');
        break;
      case 'admin':
        router.push('/admin');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-brand-900">Select Your Role to Access MedEase</h2>
            <p className="text-xs text-slate-500 font-medium">Government of Maharashtra Public Healthcare Gateway</p>
          </div>

          {/* Role selector tiles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'patient', label: 'Patient / Citizen', icon: User, desc: 'Triage & Appointments' },
              { id: 'asha', label: 'ASHA Worker', icon: Shield, desc: 'Offline Field Screening' },
              { id: 'doctor', label: 'PHC Doctor', icon: Stethoscope, desc: 'Consultation & Teleconsult' },
              { id: 'pharmacist', label: 'Pharmacist', icon: Pill, desc: 'Medicine Stock' },
              { id: 'admin', label: 'District Admin', icon: Building2, desc: 'Analytics & Network' },
            ].map((r) => {
              const IconComponent = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRole(r.id as any);
                    setStep('input');
                  }}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-brand-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{r.label}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight">{r.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4 pt-4 border-t border-slate-100">
            {(selectedRole === 'patient' || selectedRole === 'asha') ? (
              <>
                {step === 'input' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (Phone OTP Auth)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit Verification OTP</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Govt Email ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm rounded-xl transition shadow-md shadow-brand-900/20 flex items-center justify-center gap-2"
            >
              <span>{step === 'input' && (selectedRole === 'patient' || selectedRole === 'asha') ? 'Send OTP' : `Access ${selectedRole.toUpperCase()} Dashboard`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}

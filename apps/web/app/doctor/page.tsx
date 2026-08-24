"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchQueue, fetchPatients } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { Stethoscope, Video, FileText, Pill, Send, AlertTriangle, CheckCircle2, User, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function DoctorDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('en');
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedQueueItem, setSelectedQueueItem] = useState<any>(null);
  
  // Clinical Notes & Prescription Form
  const [clinicalNotes, setClinicalNotes] = useState<string>("Patient presents with elevated blood pressure and headache in 3rd trimester.");
  const [diagnosis, setDiagnosis] = useState<string>("Pre-eclampsia Screening Required");
  const [medicine, setMedicine] = useState<string>("Iron & Folic Acid 100mg");
  const [dosage, setDosage] = useState<string>("1 tab daily after meals");
  const [duration, setDuration] = useState<number>(30);
  const [referralUrgency, setReferralUrgency] = useState<string>("high");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchQueue().then(res => {
      if (res && res.queue) {
        setQueue(res.queue);
        if (res.queue.length > 0) setSelectedQueueItem(res.queue[0]);
      }
    });
  }, []);

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        
        {/* Doctor Header Banner */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-300" />
              <h1 className="text-xl font-extrabold text-white">Dr. Rajesh Patil (Medical Officer)</h1>
            </div>
            <p className="text-xs text-brand-200 mt-0.5">Manchar Primary Health Centre (Ambegaon, Pune)</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/teleconsult?room=room-patil-101')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Launch Teleconsultation Room</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Priority Queue Column */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Live Patient Queue ({queue.length})
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Priority Order</span>
            </div>

            <div className="space-y-3">
              {queue.map((item) => {
                const isSelected = selectedQueueItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedQueueItem(item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-brand-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Token #{item.token_number}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.priority === 'emergency'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.priority === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <p className="font-bold text-xs text-brand-900">{item.patient_name}</p>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Status: {item.status}</span>
                      <span>Wait: {item.estimated_wait_min}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Consultation & EHR Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Patient Demographics Card */}
            {selectedQueueItem && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedQueueItem.patient_name}</h2>
                    <p className="text-xs text-slate-500">Female, 31 Years • ABHA: 91-4432-1200-9003 • Village: Manchar</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
                      High Risk: Pregnancy (32 Weeks)
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                      Hypertension
                    </span>
                  </div>
                </div>

                {/* Vitals Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Blood Pressure</span>
                    <span className="font-bold text-slate-900 text-sm">154 / 102 mmHg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Pulse Rate</span>
                    <span className="font-bold text-slate-900 text-sm">94 bpm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">SpO2 Oxygen</span>
                    <span className="font-bold text-slate-900 text-sm">98%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Temperature</span>
                    <span className="font-bold text-slate-900 text-sm">98.7 °F</span>
                  </div>
                </div>

                {/* Consultation Form */}
                <form onSubmit={handleSaveConsultation} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Assessment & Observations</label>
                    <textarea
                      rows={3}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Diagnosis Code / Text</label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Prescribe Medicine</label>
                      <input
                        type="text"
                        value={medicine}
                        onChange={(e) => setMedicine(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Complete Consultation & Issue Rx</span>
                    </button>

                    <Link
                      href="/referrals"
                      className="px-4 py-2.5 bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <span>Refer to District Hospital</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {savedSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Consultation record & prescription successfully saved and transmitted to Pharmacy & EHR!</span>
                    </div>
                  )}
                </form>

              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}

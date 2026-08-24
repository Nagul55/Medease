"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FacilityCardGrid, { Facility } from '@/components/FacilityCardGrid';
import { postTriageEvaluation, fetchFacilities, fetchQueue, fetchReferrals } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { HeartPulse, Activity, Calendar, Clock, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, PhoneCall } from 'lucide-react';

export default function PatientDashboard() {
  const [lang, setLang] = useState<Language>('en');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  // Triage Form State
  const [systolic, setSystolic] = useState<number>(128);
  const [diastolic, setDiastolic] = useState<number>(84);
  const [pulse, setPulse] = useState<number>(78);
  const [temp, setTemp] = useState<number>(98.6);
  const [spo2, setSpo2] = useState<number>(99);
  const [isPregnant, setIsPregnant] = useState<boolean>(true);
  const [symptomsInput, setSymptomsInput] = useState<string>("Mild headache, pedal swelling");
  const [triageResult, setTriageResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  useEffect(() => {
    fetchFacilities().then(res => setFacilities(res.facilities || []));
  }, []);

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    const symptomsList = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const res = await postTriageEvaluation({
        bp_systolic: Number(systolic),
        bp_diastolic: Number(diastolic),
        pulse_rate: Number(pulse),
        temperature_f: Number(temp),
        spo2_percent: Number(spo2),
        is_pregnant: isPregnant,
        symptoms: symptomsList
      });
      setTriageResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-8 flex-1">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">Patient Portal</span>
            <h1 className="text-2xl font-extrabold text-white">Namaste, Pooja Ganpat More</h1>
            <p className="text-xs text-brand-100 flex items-center gap-2">
              <span>ABHA ID: 91-4432-1200-9001</span>
              <span>•</span>
              <span>Village: Khed Shivapur (Pune)</span>
            </p>
          </div>

          <div className="bg-brand-800/80 border border-brand-700 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-brand-200 block">Next ANC Follow-up</span>
              <span className="text-sm font-bold text-white">28th August (In 4 Days)</span>
            </div>
          </div>
        </div>

        {/* Live Token Queue & Status Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Queue Position</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Realtime</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-brand-900">#102</span>
              <span className="text-xs text-slate-500 font-medium">Manchar PHC OPD</span>
            </div>

            <div className="bg-brand-50 p-3 rounded-xl flex items-center gap-2 text-xs text-brand-800 font-semibold border border-brand-100">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Est. Wait Time: ~10 Minutes</span>
            </div>
          </div>

          {/* Referral Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Referral Status</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Acknowledged</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">Pre-eclampsia OB/GYN Review</h4>
              <p className="text-xs text-slate-500 mt-0.5">Referred to: Aundh District Hospital</p>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
              Doctor Acknowledged • Appointment Scheduled for Specialist Desk
            </div>
          </div>

          {/* Medicine Pickup Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prescription Pickup</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Ready</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">Iron & Folic Acid (IFA) Tablets</h4>
              <p className="text-xs text-slate-500 mt-0.5">Pharmacy: Manchar PHC Counter 2</p>
            </div>

            <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 font-medium">
              Stock Reserved • Free Govt Supply
            </div>
          </div>

        </div>

        {/* Digital Triage Section */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-brand-600" />
                Digital Symptom & Triage Evaluator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">AI Triage decision support engine for early health warning detection.</p>
            </div>
          </div>

          <form onSubmit={handleTriageSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pulse Rate (bpm)</label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SpO2 Oxygen (%)</label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="pregnant"
                checked={isPregnant}
                onChange={(e) => setIsPregnant(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <label htmlFor="pregnant" className="text-xs font-semibold text-slate-800">
                Is Patient Currently Pregnant?
              </label>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Symptoms (comma separated)</label>
              <input
                type="text"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. headache, fever, dizziness"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                disabled={evaluating}
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm rounded-xl transition shadow-md shadow-brand-900/20 flex items-center justify-center gap-2"
              >
                <span>{evaluating ? "Analyzing Vitals..." : "Evaluate Triage & Get Guidance"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Result Card */}
          {triageResult && (
            <div className={`p-5 rounded-2xl border space-y-3 transition ${
              triageResult.color === 'red'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : triageResult.color === 'orange'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : triageResult.color === 'yellow'
                ? 'bg-yellow-50 border-yellow-300 text-yellow-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base">{triageResult.label}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border">
                  Urgency: {triageResult.urgency_level}
                </span>
              </div>

              <p className="text-sm font-semibold">{triageResult.recommendation}</p>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider block">Recommended Actions:</span>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {triageResult.action_items.map((act: string, idx: number) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Facility Card Grid (No-Map Isolated Component) */}
        <section>
          <FacilityCardGrid facilities={facilities} title="Nearby Health Facilities Directory" />
        </section>
      </main>
    </div>
  );
}

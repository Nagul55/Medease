"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { offlineDB, LocalPatient } from '@/lib/offline/db';
import { syncOfflineData } from '@/lib/offline/sync';
import { useLiveQuery } from 'dexie-react-hooks';
import { Language } from '@/lib/i18n';
import { Shield, Wifi, WifiOff, RefreshCw, UserPlus, HeartPulse, Send, CheckCircle2, AlertTriangle, Phone, FileText } from 'lucide-react';

export default function AshaFieldApp() {
  const [lang, setLang] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>("");

  // Form State
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<string>("female");
  const [village, setVillage] = useState<string>("Khed Shivapur");
  const [isPregnant, setIsPregnant] = useState<boolean>(true);
  const [isHypertensive, setIsHypertensive] = useState<boolean>(false);
  const [isDiabetic, setIsDiabetic] = useState<boolean>(false);
  const [systolic, setSystolic] = useState<number>(130);
  const [diastolic, setDiastolic] = useState<number>(85);

  // Live Query from IndexedDB
  const localPatients = useLiveQuery(() => offlineDB.patients.toArray(), []);
  const pendingSyncQueue = useLiveQuery(() => offlineDB.syncQueue.toArray(), []);

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const flags: string[] = [];
    if (isPregnant) flags.push('pregnancy');
    if (isHypertensive) flags.push('hypertension');
    if (isDiabetic) flags.push('diabetes');

    const newPatient: LocalPatient = {
      full_name: name || "Sita Ramesh Pawar",
      phone: phone || "+91-9823410099",
      age: Number(age),
      gender: gender,
      village: village,
      high_risk_flags: flags,
      synced: 0,
      created_at: new Date().toISOString()
    };

    // Save to IndexedDB
    const patientId = await offlineDB.patients.add(newPatient);
    await offlineDB.syncQueue.add({
      entity_type: 'patient',
      payload: { ...newPatient, local_id: patientId },
      created_at: new Date().toISOString()
    });

    // Reset Form
    setName("");
    setPhone("");
    setSyncStatusMsg("New patient record saved locally to IndexedDB store!");
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      setSyncStatusMsg("Cannot sync: Dev toggle set to Offline Mode.");
      return;
    }
    setIsSyncing(true);
    setSyncStatusMsg("Pushing batch to FastAPI backend sync endpoint...");
    const res = await syncOfflineData();
    setIsSyncing(false);
    if (res.status === 'success') {
      setSyncStatusMsg(`Successfully synced ${res.synced_count} items with server!`);
    } else {
      setSyncStatusMsg(`Sync result: ${res.message || res.status}`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} isOnline={isOnline} />

      <main className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        
        {/* ASHA Header & Connectivity Toggle */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-extrabold text-brand-900">ASHA Sunita Sunasara (Field Console)</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Assigned Village: Khed Shivapur (Pune District)</p>
          </div>

          {/* Dev Connectivity Toggle */}
          <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Network Simulator:</span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isOnline
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-amber-600 text-white shadow-sm animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>OFFLINE MODE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="bg-brand-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-800 flex items-center justify-center font-bold text-brand-200">
              {pendingSyncQueue?.length || 0}
            </div>
            <div>
              <span className="text-sm font-bold block">Offline Records Pending Sync</span>
              <span className="text-xs text-brand-200">
                {pendingSyncQueue?.length === 0
                  ? "All local field records are fully synchronized with server."
                  : `${pendingSyncQueue?.length} items queued in local IndexedDB storage.`}
              </span>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing || pendingSyncQueue?.length === 0}
            className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 border border-brand-500/30"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Pending Items Now'}</span>
          </button>
        </div>

        {syncStatusMsg && (
          <div className="p-3 bg-brand-50 border border-brand-200 text-brand-900 text-xs font-semibold rounded-xl text-center">
            {syncStatusMsg}
          </div>
        )}

        {/* Patient Registration & Vitals Form */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-600" />
              Offline Field Patient Registration & High-Risk Triage
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Works 100% offline. Automatically syncs when internet returns.</p>
          </div>

          <form onSubmit={handleRegisterPatient} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sita Ramesh Pawar"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-9823410099"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village Name</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

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

            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">High Risk Flags:</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-800">
                  <input type="checkbox" checked={isPregnant} onChange={(e) => setIsPregnant(e.target.checked)} className="rounded text-brand-600" />
                  <span>Maternal / Pregnancy (ANC)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-800">
                  <input type="checkbox" checked={isHypertensive} onChange={(e) => setIsHypertensive(e.target.checked)} className="rounded text-brand-600" />
                  <span>Hypertension Flag</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-800">
                  <input type="checkbox" checked={isDiabetic} onChange={(e) => setIsDiabetic(e.target.checked)} className="rounded text-brand-600" />
                  <span>Diabetes Flag</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm rounded-xl transition shadow-md shadow-brand-900/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Save Record to Offline Store</span>
              </button>
            </div>
          </form>
        </section>

        {/* Local IndexedDB Patients Table */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Locally Saved Patients ({localPatients?.length || 0})</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Village</th>
                  <th className="py-2.5 px-3">Risk Flags</th>
                  <th className="py-2.5 px-3">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localPatients?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{p.full_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.phone}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.village}</td>
                    <td className="py-2.5 px-3">
                      {p.high_risk_flags.map((flg, fIdx) => (
                        <span key={fIdx} className="bg-rose-100 text-rose-800 text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1">
                          {flg}
                        </span>
                      ))}
                    </td>
                    <td className="py-2.5 px-3">
                      {p.synced === 1 ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Offline Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { fetchReferrals, updateReferralStatus } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { ArrowRightLeft, Clock, CheckCircle2, ShieldAlert, FileText, ChevronRight, RefreshCw, UserCheck } from 'lucide-react';

export default function ReferralManagementModule() {
  const [lang, setLang] = useState<Language>('en');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string>("");

  const loadData = () => {
    fetchReferrals().then(res => {
      if (res && res.referrals) {
        setReferrals(res.referrals);
        if (res.referrals.length > 0) setSelectedReferral(res.referrals[0]);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedReferral) return;
    setUpdatingId(selectedReferral.id);
    await updateReferralStatus(selectedReferral.id, newStatus, "Dr. Priya Deshmukh (Aundh District Hospital)");
    setUpdatingId("");
    loadData();
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        
        {/* Module Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-brand-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-brand-600" />
              Cross-Facility Referral Lifecycle & Audit Trail
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Guarantees zero dropped referrals. Every status change is logged with timestamp & actor ID.
            </p>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Referral List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Active Referrals</h3>
            
            <div className="space-y-3">
              {referrals.map((ref) => {
                const isSelected = selectedReferral?.id === ref.id;
                return (
                  <div
                    key={ref.id}
                    onClick={() => setSelectedReferral(ref)}
                    className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-brand-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ref.urgency === 'high' || ref.urgency === 'emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Urgency: {ref.urgency}
                      </span>

                      <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                        {ref.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{ref.reason}</h4>
                    <p className="text-xs text-slate-500">Referring Dr: {ref.referring_provider_name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral Detail & Immutable Audit Log */}
          {selectedReferral && (
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Referral Record #{selectedReferral.id}</span>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedReferral.reason}</h2>
                    <p className="text-xs text-slate-500 mt-1">Clinical Summary: {selectedReferral.clinical_summary}</p>
                  </div>

                  <span className="bg-brand-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-full uppercase">
                    Status: {selectedReferral.status}
                  </span>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Update Referral Lifecycle Status:</span>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'acknowledged', 'scheduled', 'completed', 'no_show'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        disabled={updatingId === selectedReferral.id}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                          selectedReferral.status === st
                            ? 'bg-brand-700 text-white shadow-sm'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-brand-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Immutable Audit Trail Log Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    Immutable Status Audit History ({selectedReferral.audit_history?.length || 0} events)
                  </h4>

                  <div className="space-y-2 relative border-l-2 border-brand-200 ml-3 pl-4">
                    {selectedReferral.audit_history?.map((audit: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 relative">
                        <div className="w-3 h-3 rounded-full bg-brand-600 absolute -left-[23px] top-3.5 border-2 border-white"></div>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>
                            Transition: {audit.from_status || 'CREATED'} → {audit.to_status}
                          </span>
                          <span className="text-slate-400 font-normal">{new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-600 font-medium">Actor: {audit.updated_by}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

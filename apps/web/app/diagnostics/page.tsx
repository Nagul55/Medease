"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { fetchDiagnostics } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { FileText, CheckCircle2, Clock, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DiagnosticCoordinationModule() {
  const [lang, setLang] = useState<Language>('en');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDiagnostics().then(res => {
      if (res && res.orders) setOrders(res.orders);
    });
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-brand-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Diagnostic Coordination & Lab Orders
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Lifecycle status tracking: Ordered → Sample Collected → Result Ready → Delivered
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active Lab Orders & Diagnostic Reports</h3>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{ord.test_name}</h4>
                    <p className="text-xs text-slate-500">Patient: {ord.patient_name} • Category: {ord.category}</p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    ord.status === 'result_ready'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {ord.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold block mb-1">Result Summary:</span>
                  <p className="font-medium text-slate-600">{ord.result_summary || 'Order dispatched to laboratory. Results pending.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

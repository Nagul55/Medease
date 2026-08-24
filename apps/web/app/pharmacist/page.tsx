"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { fetchInventory } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { Pill, AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert, Plus, Edit2 } from 'lucide-react';

export default function PharmacistInventoryModule() {
  const [lang, setLang] = useState<Language>('en');
  const [inventory, setInventory] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  const loadInventory = () => {
    fetchInventory().then(res => {
      if (res && res.inventory) setInventory(res.inventory);
    });
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateStock = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/medicines/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(editQty) })
      });
      if (res.ok) {
        setEditingId(null);
        loadInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        
        {/* Module Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-brand-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-brand-600" />
              Pharmacist Stock & Inventory Console (Manchar PHC)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Realtime stock tracking feeds into patient and ASHA medicine availability views.
            </p>
          </div>

          <button
            onClick={loadInventory}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Inventory</span>
          </button>
        </div>

        {/* Stock Alerts Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              {inventory.filter(i => i.status === 'available').length}
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Adequate Stock</span>
              <span className="text-[11px] text-emerald-700">Above safety threshold</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              {inventory.filter(i => i.status === 'low').length}
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block">Low Stock Alert</span>
              <span className="text-[11px] text-amber-700">Re-order required</span>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              {inventory.filter(i => i.status === 'out_of_stock').length}
            </div>
            <div>
              <span className="text-xs font-bold text-rose-900 block">Out of Stock Alert</span>
              <span className="text-[11px] text-rose-700">Emergency dispatch needed</span>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Facility Essential Medicine Store</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Medicine Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Threshold</th>
                  <th className="py-3 px-3">Availability Status</th>
                  <th className="py-3 px-3">Quick Stock Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.medicine_name}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{item.category}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 text-sm">{item.quantity} units</td>
                    <td className="py-3 px-3 text-slate-500">{item.threshold} units</td>
                    <td className="py-3 px-3">
                      {item.status === 'available' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Available
                        </span>
                      )}
                      {item.status === 'low' && (
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      )}
                      {item.status === 'out_of_stock' && (
                        <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 w-max">
                          <ShieldAlert className="w-3 h-3 text-rose-600" /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {editingId === item.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-xs"
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id)}
                            className="px-2.5 py-1 bg-brand-700 text-white rounded-lg font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditQty(item.quantity);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

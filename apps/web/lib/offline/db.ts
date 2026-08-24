/**
 * MedEase ASHA Offline Storage Engine
 * Uses IndexedDB (Dexie) to store patients, observations, and sync queue locally.
 */

import Dexie, { Table } from 'dexie';

export interface LocalPatient {
  id?: string;
  full_name: string;
  phone: string;
  age: number;
  gender: string;
  village: string;
  high_risk_flags: string[];
  abha_id?: string;
  synced: number; // 0 = false, 1 = true
  created_at: string;
}

export interface LocalSyncItem {
  id?: number;
  entity_type: 'patient' | 'observation' | 'referral';
  payload: any;
  created_at: string;
}

export class MedEaseOfflineDB extends Dexie {
  patients!: Table<LocalPatient>;
  syncQueue!: Table<LocalSyncItem>;

  constructor() {
    super('MedEaseOfflineDB');
    this.version(1).stores({
      patients: '++id, full_name, phone, village, synced',
      syncQueue: '++id, entity_type, created_at'
    });
  }
}

export const offlineDB = new MedEaseOfflineDB();

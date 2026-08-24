/**
 * MedEase ASHA Sync Manager
 * Pushes pending local IndexedDB queue items to FastAPI endpoint when online connectivity returns.
 */

import { offlineDB } from './db';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function syncOfflineData(ashaWorkerId: string = "p1000000-0000-0000-0000-000000000001") {
  try {
    const queueItems = await offlineDB.syncQueue.toArray();
    if (queueItems.length === 0) {
      return { status: "clean", synced_count: 0 };
    }

    const payloadItems = queueItems.map(item => ({
      id: item.id?.toString() || "1",
      asha_worker_id: ashaWorkerId,
      entity_type: item.entity_type,
      payload: item.payload,
      version_vector: "1.0",
      client_timestamp: item.created_at
    }));

    const res = await fetch(`${API_BASE}/sync/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asha_worker_id: ashaWorkerId,
        items: payloadItems
      })
    });

    if (res.ok) {
      // Clear processed queue
      await offlineDB.syncQueue.clear();
      // Mark patients synced
      await offlineDB.patients.toCollection().modify({ synced: 1 });
      return { status: "success", synced_count: queueItems.length };
    } else {
      return { status: "error", message: "Server sync rejected batch" };
    }
  } catch (err) {
    console.error("Sync push failed (Network unavailable):", err);
    return { status: "offline", message: "Network unavailable" };
  }
}

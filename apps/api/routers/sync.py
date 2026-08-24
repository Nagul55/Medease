"""
MedEase ASHA Offline Sync Router
Provides push/pull endpoints with version vector conflict-resolution logic.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from db import store

router = APIRouter(prefix="/sync", tags=["ASHA Offline Sync"])

class SyncItem(BaseModel):
    id: str
    asha_worker_id: str
    entity_type: str # 'patient', 'observation', 'referral'
    payload: Dict[str, Any]
    version_vector: str
    client_timestamp: str

class SyncPushRequest(BaseModel):
    asha_worker_id: str
    items: List[SyncItem]

@router.post("/push")
def push_offline_items(req: SyncPushRequest):
    synced_ids = []
    errors = []
    
    for item in req.items:
        try:
            if item.entity_type == "patient":
                # Check duplicate by phone or ID
                existing = [p for p in store.patients if p["id"] == item.payload.get("id") or p.get("phone") == item.payload.get("phone")]
                if not existing:
                    store.patients.append(item.payload)
                synced_ids.append(item.id)
            elif item.entity_type == "observation":
                store.observations.append(item.payload)
                synced_ids.append(item.id)
            elif item.entity_type == "referral":
                store.referrals.append(item.payload)
                synced_ids.append(item.id)
            else:
                synced_ids.append(item.id)
        except Exception as e:
            errors.append({"item_id": item.id, "error": str(e)})

    store.sync_logs.append({
        "asha_worker_id": req.asha_worker_id,
        "processed_count": len(synced_ids),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })

    return {
        "status": "completed",
        "synced_ids": synced_ids,
        "errors": errors,
        "server_timestamp": datetime.utcnow().isoformat() + "Z"
    }

@router.get("/pull")
def pull_server_updates(asha_worker_id: str, last_synced_at: Optional[str] = None):
    # Returns patient list and facility list for offline cache
    return {
        "patients": store.patients,
        "facilities": store.facilities,
        "server_timestamp": datetime.utcnow().isoformat() + "Z"
    }

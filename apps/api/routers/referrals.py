"""
MedEase Referral Router
Enforces cross-facility referral state transitions and audit trails.
Referral statuses: pending -> acknowledged -> scheduled -> completed / no_show.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
from datetime import datetime
from db import store

router = APIRouter(prefix="/referrals", tags=["Referrals"])

class ReferralCreate(BaseModel):
    patient_id: str
    referring_facility_id: str
    receiving_facility_id: str
    referring_provider_name: str
    urgency: str = "medium" # low, medium, high, emergency
    reason: str
    clinical_summary: str

class StatusUpdate(BaseModel):
    status: str # pending, acknowledged, scheduled, completed, no_show
    updated_by_name: str
    notes: Optional[str] = None

@router.get("/")
def list_referrals(
    referring_facility_id: Optional[str] = None,
    receiving_facility_id: Optional[str] = None,
    status: Optional[str] = None
):
    results = store.referrals
    if referring_facility_id:
        results = [r for r in results if r.get("referring_facility_id") == referring_facility_id]
    if receiving_facility_id:
        results = [r for r in results if r.get("receiving_facility_id") == receiving_facility_id]
    if status:
        results = [r for r in results if r.get("status") == status]
    return {"referrals": results, "count": len(results)}

@router.post("/")
def create_referral(req: ReferralCreate):
    ref_id = f"r{uuid.uuid4().hex[:30]}"
    now_iso = datetime.utcnow().isoformat() + "Z"
    new_ref = {
        "id": ref_id,
        "patient_id": req.patient_id,
        "referring_facility_id": req.referring_facility_id,
        "receiving_facility_id": req.receiving_facility_id,
        "referring_provider_name": req.referring_provider_name,
        "urgency": req.urgency,
        "reason": req.reason,
        "clinical_summary": req.clinical_summary,
        "status": "pending",
        "audit_history": [
            {
                "from_status": None,
                "to_status": "pending",
                "timestamp": now_iso,
                "updated_by": req.referring_provider_name
            }
        ],
        "created_at": now_iso,
        "updated_at": now_iso
    }
    store.referrals.append(new_ref)
    return {"status": "success", "referral": new_ref}

@router.put("/{referral_id}/status")
def update_referral_status(referral_id: str, req: StatusUpdate):
    for r in store.referrals:
        if r["id"] == referral_id:
            old_status = r["status"]
            if old_status == req.status:
                return {"status": "no_change", "referral": r}
            
            now_iso = datetime.utcnow().isoformat() + "Z"
            r["status"] = req.status
            r["updated_at"] = now_iso
            if "audit_history" not in r:
                r["audit_history"] = []
            
            r["audit_history"].append({
                "from_status": old_status,
                "to_status": req.status,
                "timestamp": now_iso,
                "updated_by": req.updated_by_name,
                "notes": req.notes
            })
            return {"status": "updated", "referral": r}
            
    raise HTTPException(status_code=404, detail="Referral record not found")

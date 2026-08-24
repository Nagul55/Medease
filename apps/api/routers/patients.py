"""
MedEase Patients Router
Handles patient registration, ABHA linking, village filter, high-risk flags, and search.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
from db import store

router = APIRouter(prefix="/patients", tags=["Patients"])

class PatientCreate(BaseModel):
    full_name: str
    phone: str
    age: int
    gender: str
    blood_group: Optional[str] = "O+"
    village: str
    taluka: str = "Haveli"
    district: str = "Pune"
    abha_id: Optional[str] = None
    emergency_contact: Optional[str] = None
    high_risk_flags: List[str] = []
    asha_worker_id: Optional[str] = None

@router.get("/")
def get_patients(
    village: Optional[str] = None,
    high_risk_only: bool = False,
    query: Optional[str] = None
):
    results = store.patients
    if village:
        results = [p for p in results if p.get("village", "").lower() == village.lower()]
    if high_risk_only:
        results = [p for p in results if len(p.get("high_risk_flags", [])) > 0]
    if query:
        q = query.lower()
        results = [p for p in results if q in p.get("full_name", "").lower() or q in p.get("phone", "") or q in p.get("abha_id", "").lower()]
    return {"patients": results, "count": len(results)}

@router.post("/")
def create_patient(patient: PatientCreate):
    new_id = f"pa{uuid.uuid4().hex[:30]}"
    p_dict = patient.dict()
    p_dict["id"] = new_id
    p_dict["created_at"] = "2026-08-24T12:00:00Z"
    if not p_dict.get("abha_id"):
        p_dict["abha_id"] = f"91-4432-{uuid.uuid4().hex[:4]}-9090"
    store.patients.append(p_dict)
    return {"status": "success", "patient": p_dict}

@router.get("/{patient_id}")
def get_patient_detail(patient_id: str):
    for p in store.patients:
        if p["id"] == patient_id:
            return p
    raise HTTPException(status_code=404, detail="Patient record not found")

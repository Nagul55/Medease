"""
MedEase Appointments & Queue Router
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
from db import store

router = APIRouter(prefix="/appointments", tags=["Appointments & Queue"])

class AppointmentBook(BaseModel):
    patient_id: str
    facility_id: str
    priority: str = "normal" # normal, high, emergency

@router.get("/")
def get_queue(facility_id: Optional[str] = None):
    results = store.appointments
    if facility_id:
        results = [a for a in results if a.get("facility_id") == facility_id]
    return {"queue": results, "count": len(results)}

@router.post("/book")
def book_appointment(req: AppointmentBook):
    next_token = len(store.appointments) + 101
    p_name = "Patient"
    for p in store.patients:
        if p["id"] == req.patient_id:
            p_name = p["full_name"]
            break
            
    wait_time = 5 if req.priority == "emergency" else (15 if req.priority == "high" else 30)
    
    app_record = {
        "id": f"app-{uuid.uuid4().hex[:6]}",
        "patient_id": req.patient_id,
        "patient_name": p_name,
        "facility_id": req.facility_id,
        "token_number": next_token,
        "priority": req.priority,
        "status": "queued",
        "estimated_wait_min": wait_time
    }
    store.appointments.append(app_record)
    return {"status": "success", "appointment": app_record}

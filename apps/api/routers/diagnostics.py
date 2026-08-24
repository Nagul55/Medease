"""
MedEase Diagnostics Router
Lab Order Lifecycle: Ordered -> Sample Collected -> Result Ready -> Delivered
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import uuid
from db import store

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics & Lab Orders"])

class OrderCreate(BaseModel):
    patient_id: str
    test_name: str
    category: str = "Lab Test"
    facility_id: str
    ordered_by_name: str

class StatusUpdate(BaseModel):
    status: str # ordered, sample_collected, result_ready, delivered
    result_summary: Optional[str] = None

INITIAL_DIAGNOSTICS = [
    {
        "id": "diag-101",
        "patient_id": "pa100000-0000-0000-0000-000000000001",
        "patient_name": "Pooja Ganpat More",
        "test_name": "Complete Blood Count (CBC) & Hemoglobin",
        "category": "Haematology",
        "status": "result_ready",
        "result_summary": "Hb: 11.2 g/dL (Slightly low, continue IFA supplement). Platelets: 240,000.",
        "facility_name": "Manchar PHC",
        "ordered_at": "2026-08-22T10:00:00Z"
    },
    {
        "id": "diag-102",
        "patient_id": "pa300000-0000-0000-0000-000000000003",
        "patient_name": "Sharda Baburao Kamble",
        "test_name": "Urine Protein & Kidney Function Panel",
        "category": "Biochemistry",
        "status": "ordered",
        "result_summary": "Sample dispatched to District Hospital lab.",
        "facility_name": "Aundh District Hospital",
        "ordered_at": "2026-08-24T09:30:00Z"
    }
]

diagnostics_store = list(INITIAL_DIAGNOSTICS)

@router.get("/")
def list_orders(patient_id: Optional[str] = None):
    results = diagnostics_store
    if patient_id:
        results = [d for d in results if d.get("patient_id") == patient_id]
    return {"orders": results, "count": len(results)}

@router.post("/")
def create_order(req: OrderCreate):
    new_id = f"diag-{uuid.uuid4().hex[:6]}"
    p_name = "Patient"
    for p in store.patients:
        if p["id"] == req.patient_id:
            p_name = p["full_name"]
            break
    order = {
        "id": new_id,
        "patient_id": req.patient_id,
        "patient_name": p_name,
        "test_name": req.test_name,
        "category": req.category,
        "status": "ordered",
        "result_summary": None,
        "facility_name": "Manchar PHC",
        "ordered_at": "2026-08-24T12:00:00Z"
    }
    diagnostics_store.append(order)
    return {"status": "success", "order": order}

@router.put("/{order_id}/status")
def update_status(order_id: str, req: StatusUpdate):
    for d in diagnostics_store:
        if d["id"] == order_id:
            d["status"] = req.status
            if req.result_summary:
                d["result_summary"] = req.result_summary
            return {"status": "updated", "order": d}
    raise HTTPException(status_code=404, detail="Order not found")

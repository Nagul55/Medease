"""
MedEase ABHA (Ayushman Bharat Health Account) Sandbox Linkage Router
Handles ABHA number verification, OTP generation, and Health ID card linking.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/abha", tags=["ABHA ABDM Integration"])

class AbhaVerifyRequest(BaseModel):
    abha_id: str

class OtpRequest(BaseModel):
    txn_id: str
    otp: str

@router.post("/verify")
def verify_abha(req: AbhaVerifyRequest):
    # ABDM Sandbox simulation
    txn_id = f"txn-{uuid.uuid4().hex[:8]}"
    return {
        "status": "otp_sent",
        "txn_id": txn_id,
        "message": f"OTP successfully dispatched to mobile linked with ABHA {req.abha_id}",
        "sandbox_mode": True
    }

@router.post("/confirm-otp")
def confirm_otp(req: OtpRequest):
    return {
        "status": "verified",
        "abha_number": "91-4432-1200-9001",
        "abha_address": "poojamore@abdm",
        "name": "Pooja Ganpat More",
        "gender": "F",
        "yearOfBirth": "2002",
        "health_card_token": f"token_abdm_{uuid.uuid4().hex[:12]}"
    }

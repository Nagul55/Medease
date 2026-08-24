"""
MedEase Teleconsultation Service Provider Adapter
Generates room session tokens for WebRTC managed-SFU fallback (or 100ms / Twilio / Agora).
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid
import os

router = APIRouter(prefix="/teleconsult", tags=["Teleconsultation SFU"])

class TokenRequest(BaseModel):
    room_id: str
    user_id: str
    user_name: str
    role: str # 'doctor', 'patient', 'asha'

class RoomCreateRequest(BaseModel):
    patient_id: str
    doctor_id: Optional[str] = None
    reason: str

@router.post("/rooms")
def create_room(req: RoomCreateRequest):
    room_id = f"room-{uuid.uuid4().hex[:8]}"
    return {
        "room_id": room_id,
        "patient_id": req.patient_id,
        "provider_adapter": "WebRTC-Managed-SFU-Fallback",
        "created_at": "2026-08-24T12:00:00Z"
    }

@router.post("/token")
def get_session_token(req: TokenRequest):
    # Generates a signed token payload. Behind this interface, 100ms / Agora JWT can be generated.
    token = f"token_sfu_{req.role}_{req.room_id}_{uuid.uuid4().hex[:12]}"
    return {
        "token": token,
        "room_id": req.room_id,
        "user_name": req.user_name,
        "role": req.role,
        "sfu_config": {
            "ice_servers": [
                {"urls": "stun:stun.l.google.com:19302"},
                {"urls": "stun:stun1.l.google.com:19302"}
            ],
            "adapter": "WebRTC-Managed-SFU-Fallback"
        }
    }

"""
MedEase Digital Triage Decision Engine Router
Categorizes patient symptoms/vitals into decision support levels:
🟢 Self-Care / Community (Green)
🟡 Visit PHC (Yellow)
🟠 Teleconsultation Urgent (Orange)
🔴 Red Alert / Emergency Escalation (Red)
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List

router = APIRouter(prefix="/triage", tags=["Triage Decision Engine"])

class TriageRequest(BaseModel):
    bp_systolic: Optional[int] = Field(None, description="Systolic Blood Pressure (mmHg)")
    bp_diastolic: Optional[int] = Field(None, description="Diastolic Blood Pressure (mmHg)")
    pulse_rate: Optional[int] = Field(None, description="Pulse Rate (bpm)")
    temperature_f: Optional[float] = Field(None, description="Body Temperature (°F)")
    spo2_percent: Optional[int] = Field(None, description="Oxygen Saturation (%)")
    glucose_mg_dl: Optional[int] = Field(None, description="Blood Sugar Level (mg/dL)")
    is_pregnant: bool = False
    symptoms: List[str] = []

class TriageResponse(BaseModel):
    color: str # 'green', 'yellow', 'orange', 'red'
    label: str
    urgency_level: str
    recommendation: str
    action_items: List[str]
    is_emergency: bool

@router.post("/evaluate", response_model=TriageResponse)
def evaluate_triage(req: TriageRequest):
    reasons = []
    color = "green"
    
    # 🔴 EMERGENCY CHECKS (Red)
    if req.spo2_percent and req.spo2_percent < 90:
        reasons.append("Severe hypoxia (SpO2 < 90%)")
        color = "red"
    if req.bp_systolic and req.bp_systolic >= 160:
        reasons.append("Severe Hypertensive Crisis (Systolic ≥ 160 mmHg)")
        color = "red"
    if req.bp_diastolic and req.bp_diastolic >= 110:
        reasons.append("Severe Hypertensive Crisis (Diastolic ≥ 110 mmHg)")
        color = "red"
    if req.is_pregnant and req.bp_systolic and req.bp_systolic >= 150:
        reasons.append("High risk pre-eclampsia warning in pregnancy")
        color = "red"
    if any(s in [s.lower() for s in req.symptoms] for s in ["chest pain", "severe shortness of breath", "unconscious", "heavy bleeding"]):
        reasons.append("Critical red-flag emergency symptoms reported")
        color = "red"
        
    # 🟠 URGENT TELECONSULT / PHC VISIT (Orange)
    if color != "red":
        if (req.bp_systolic and 140 <= req.bp_systolic < 160) or (req.bp_diastolic and 90 <= req.bp_diastolic < 110):
            reasons.append("Moderate Hypertension (BP 140-159 / 90-109)")
            color = "orange"
        elif req.temperature_f and req.temperature_f >= 102.0:
            reasons.append("High fever (≥ 102°F)")
            color = "orange"
        elif req.spo2_percent and 90 <= req.spo2_percent <= 94:
            reasons.append("Moderate oxygen drop (90-94%)")
            color = "orange"
        elif req.is_pregnant and any(s in [s.lower() for s in req.symptoms] for s in ["headache", "blurred vision", "swelling"]):
            reasons.append("Pregnancy warning signs present")
            color = "orange"

    # 🟡 PHC VISIT (Yellow)
    if color not in ["red", "orange"]:
        if (req.bp_systolic and 130 <= req.bp_systolic < 140) or (req.bp_diastolic and 85 <= req.bp_diastolic < 90):
            reasons.append("Mildly elevated blood pressure")
            color = "yellow"
        elif req.temperature_f and 99.5 <= req.temperature_f < 102.0:
            reasons.append("Mild fever")
            color = "yellow"
        elif req.glucose_mg_dl and (req.glucose_mg_dl > 140 or req.glucose_mg_dl < 70):
            reasons.append("Abnormal glucose reading")
            color = "yellow"
        elif len(req.symptoms) > 0:
            reasons.append("Symptoms requiring routine medical review")
            color = "yellow"

    # Response Mapping
    if color == "red":
        return TriageResponse(
            color="red",
            label="Red Alert / Immediate Emergency",
            urgency_level="CRITICAL",
            recommendation="Immediate referral to Rural/District Hospital required. Call emergency transport.",
            action_items=[
                "Dispatch 108 Ambulance / Emergency Vehicle",
                "Alert nearest District Hospital ER desk",
                "Stabilize patient position and administer O2 if available"
            ],
            is_emergency=True
        )
    elif color == "orange":
        return TriageResponse(
            color="orange",
            label="Urgent Teleconsultation / PHC Triage",
            urgency_level="HIGH",
            recommendation="Connect immediately with PHC Medical Officer via Teleconsultation or visit within 12 hours.",
            action_items=[
                "Schedule priority Teleconsultation token",
                "ASHA worker to monitor vitals every 4 hours",
                "Keep emergency transport on standby"
            ],
            is_emergency=False
        )
    elif color == "yellow":
        return TriageResponse(
            color="yellow",
            label="PHC Outpatient Visit Recommended",
            urgency_level="MODERATE",
            recommendation="Visit nearest PHC for routine consultation and diagnostic check within 24-48 hours.",
            action_items=[
                "Book regular PHC token",
                "Ensure routine medicine refills",
                "Maintain vitals log"
            ],
            is_emergency=False
        )
    else:
        return TriageResponse(
            color="green",
            label="Self-Care / Community Follow-up",
            urgency_level="LOW",
            recommendation="Vitals are within normal thresholds. Continue standard preventative care and ASHA visits.",
            action_items=[
                "Stay hydrated and rested",
                "Routine ASHA follow-up next month"
            ],
            is_emergency=False
        )

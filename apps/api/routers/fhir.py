"""
MedEase FHIR R4 Mapping Adapter Router
Proxies and translates MedEase clinical entities to standardized HL7 FHIR R4 JSON resources.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from db import store

router = APIRouter(prefix="/fhir", tags=["FHIR Interoperability Adapter"])

@router.get("/Patient/{patient_id}")
def get_fhir_patient(patient_id: str) -> Dict[str, Any]:
    patient = None
    for p in store.patients:
        if p["id"] == patient_id:
            patient = p
            break
    if not patient:
        raise HTTPException(status_code=404, detail="Patient FHIR resource not found")
        
    return {
        "resourceType": "Patient",
        "id": patient["id"],
        "identifier": [
            {
                "system": "https://abha.abdm.gov.in",
                "value": patient.get("abha_id", "")
            }
        ],
        "name": [
            {
                "text": patient.get("full_name"),
                "use": "official"
            }
        ],
        "gender": patient.get("gender"),
        "telecom": [
            {
                "system": "phone",
                "value": patient.get("phone")
            }
        ],
        "address": [
            {
                "city": patient.get("village"),
                "district": patient.get("district"),
                "state": "Maharashtra",
                "country": "IN"
            }
        ]
    }

"""
MedEase Facilities Router
Returns healthcare facilities (Sub-centres, PHCs, Rural Hospitals, District Hospitals) with non-map details.
"""

from fastapi import APIRouter
from typing import Optional
from db import store

router = APIRouter(prefix="/facilities", tags=["Facilities Directory"])

@router.get("/")
def get_facilities(type: Optional[str] = None, district: Optional[str] = None):
    results = store.facilities
    if type:
        results = [f for f in results if f.get("type") == type]
    if district:
        results = [f for f in results if f.get("district", "").lower() == district.lower()]
    return {"facilities": results, "count": len(results)}

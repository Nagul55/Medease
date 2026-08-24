"""
MedEase Database Access Layer
Supports Supabase Python SDK integration with fallback mock store pre-seeded with Maharashtra health data.
"""

import os
from typing import Dict, List, Any, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# In-Memory Seed State for Instant Out-of-the-Box Local Execution
INITIAL_FACILITIES = [
    {
        "id": "f1000000-0000-0000-0000-000000000001",
        "name": "Khed Sub-Centre",
        "type": "sub_centre",
        "village": "Khed Shivapur",
        "taluka": "Haveli",
        "district": "Pune",
        "address": "Sub-Centre Bldg, Main Road, Khed Shivapur",
        "phone": "+91-20-24310001",
        "emergency_contact": "+91-9822000001",
        "distance_approx_km": 3.2,
        "services_offered": ["Maternal Screening", "Basic Triage", "Immunization", "First Aid"],
        "is_active": True
    },
    {
        "id": "f2000000-0000-0000-0000-000000000002",
        "name": "Manchar Primary Health Centre (PHC)",
        "type": "phc",
        "village": "Manchar",
        "taluka": "Ambegaon",
        "district": "Pune",
        "address": "PHC Campus, Near Bus Stand, Manchar",
        "phone": "+91-2133-220012",
        "emergency_contact": "+91-9822000002",
        "distance_approx_km": 8.5,
        "services_offered": ["General Outpatient", "Teleconsultation", "Essential Medicines", "ANC Care", "Lab Diagnostics"],
        "is_active": True
    },
    {
        "id": "f3000000-0000-0000-0000-000000000003",
        "name": "Velhe Primary Health Centre (PHC)",
        "type": "phc",
        "village": "Velhe",
        "taluka": "Velhe",
        "district": "Pune",
        "address": "Fort Road, Near Tehsildar Office, Velhe",
        "phone": "+91-2130-232110",
        "emergency_contact": "+91-9822000003",
        "distance_approx_km": 12.1,
        "services_offered": ["General Outpatient", "Teleconsultation", "Emergency Stabilization", "Maternity"],
        "is_active": True
    },
    {
        "id": "f4000000-0000-0000-0000-000000000004",
        "name": "Shirur Rural Hospital",
        "type": "rural_hospital",
        "village": "Shirur",
        "taluka": "Shirur",
        "district": "Pune",
        "address": "Nagar Road, Hospital Campus, Shirur",
        "phone": "+91-2138-222045",
        "emergency_contact": "+91-9822000004",
        "distance_approx_km": 24.0,
        "services_offered": ["Inpatient Wards", "Minor Surgery", "Specialist Teleconsult", "Advanced Diagnostics", "24x7 Emergency"],
        "is_active": True
    },
    {
        "id": "f5000000-0000-0000-0000-000000000005",
        "name": "Aundh District Hospital",
        "type": "district_hospital",
        "village": "Aundh",
        "taluka": "Haveli",
        "district": "Pune",
        "address": "Aundh Chest Hospital Campus, Pune",
        "phone": "+91-20-27290000",
        "emergency_contact": "+91-9822000005",
        "distance_approx_km": 45.0,
        "services_offered": ["Multi-specialty Care", "ICU", "High-Risk Obstetrics", "Surgical Suites", "Central Blood Bank", "CT/MRI Diagnostics"],
        "is_active": True
    }
]

INITIAL_PATIENTS = [
    {
        "id": "pa100000-0000-0000-0000-000000000001",
        "full_name": "Pooja Ganpat More",
        "phone": "+91-9765432101",
        "abha_id": "91-4432-1200-9001",
        "age": 24,
        "gender": "female",
        "blood_group": "O+",
        "village": "Khed Shivapur",
        "taluka": "Haveli",
        "district": "Pune",
        "emergency_contact": "+91-9765432100",
        "high_risk_flags": ["pregnancy"],
        "asha_worker_id": "p1000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "pa200000-0000-0000-0000-000000000002",
        "full_name": "Eknath Tukaram Jadhav",
        "phone": "+91-9765432102",
        "abha_id": "91-4432-1200-9002",
        "age": 58,
        "gender": "male",
        "blood_group": "B+",
        "village": "Khed Shivapur",
        "taluka": "Haveli",
        "district": "Pune",
        "emergency_contact": "+91-9765432199",
        "high_risk_flags": ["hypertension", "diabetes"],
        "asha_worker_id": "p1000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-21T11:30:00Z"
    },
    {
        "id": "pa300000-0000-0000-0000-000000000003",
        "full_name": "Sharda Baburao Kamble",
        "phone": "+91-9765432103",
        "abha_id": "91-4432-1200-9003",
        "age": 31,
        "gender": "female",
        "blood_group": "A+",
        "village": "Manchar",
        "taluka": "Ambegaon",
        "district": "Pune",
        "emergency_contact": "+91-9765432198",
        "high_risk_flags": ["pregnancy", "hypertension"],
        "asha_worker_id": "p1000000-0000-0000-0000-000000000001",
        "created_at": "2026-08-22T09:15:00Z"
    }
]

INITIAL_REFERRALS = [
    {
        "id": "r1000000-0000-0000-0000-000000000001",
        "patient_id": "pa300000-0000-0000-0000-000000000003",
        "referring_facility_id": "f2000000-0000-0000-0000-000000000002",
        "receiving_facility_id": "f5000000-0000-0000-0000-000000000005",
        "referring_provider_name": "Dr. Rajesh Patil",
        "urgency": "high",
        "reason": "Pre-eclampsia evaluation in 32-week ANC patient",
        "clinical_summary": "Patient presenting with persistent headache and BP 154/102. Urgent OB/GYN specialist evaluation required.",
        "status": "acknowledged",
        "audit_history": [
            {"from_status": "pending", "to_status": "acknowledged", "timestamp": "2026-08-24T14:30:00Z", "updated_by": "Dr. Priya Deshmukh"}
        ],
        "created_at": "2026-08-24T14:00:00Z",
        "updated_at": "2026-08-24T14:30:00Z"
    }
]

INITIAL_INVENTORY = [
    {
        "id": "inv-01",
        "facility_id": "f2000000-0000-0000-0000-000000000002",
        "medicine_name": "Iron & Folic Acid Tablets (IFA)",
        "category": "Maternal Health",
        "quantity": 450,
        "threshold": 100,
        "status": "available"
    },
    {
        "id": "inv-02",
        "facility_id": "f2000000-0000-0000-0000-000000000002",
        "medicine_name": "Telmisartan 40mg",
        "category": "Chronic Disease",
        "quantity": 15,
        "threshold": 30,
        "status": "low"
    },
    {
        "id": "inv-03",
        "facility_id": "f2000000-0000-0000-0000-000000000002",
        "medicine_name": "Metformin 500mg",
        "category": "Chronic Disease",
        "quantity": 0,
        "threshold": 40,
        "status": "out_of_stock"
    }
]

class MemoryStore:
    def __init__(self):
        self.facilities = list(INITIAL_FACILITIES)
        self.patients = list(INITIAL_PATIENTS)
        self.referrals = list(INITIAL_REFERRALS)
        self.inventories = list(INITIAL_INVENTORY)
        self.encounters = []
        self.observations = []
        self.appointments = [
            {
                "id": "app-101",
                "patient_id": "pa300000-0000-0000-0000-000000000003",
                "patient_name": "Sharda Baburao Kamble",
                "facility_id": "f2000000-0000-0000-0000-000000000002",
                "token_number": 101,
                "priority": "emergency",
                "status": "in_consultation",
                "estimated_wait_min": 0
            },
            {
                "id": "app-102",
                "patient_id": "pa100000-0000-0000-0000-000000000001",
                "patient_name": "Pooja Ganpat More",
                "facility_id": "f2000000-0000-0000-0000-000000000002",
                "token_number": 102,
                "priority": "high",
                "status": "queued",
                "estimated_wait_min": 10
            }
        ]
        self.sync_logs = []

store = MemoryStore()

-- MedEase Database Schema (FHIR-Shaped PostgreSQL / Supabase)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Facilities
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('sub_centre', 'phc', 'rural_hospital', 'district_hospital')),
    village VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL DEFAULT 'Pune',
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    distance_approx_km NUMERIC(5,2) DEFAULT 0.0,
    services_offered TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Role-based application users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'asha', 'doctor', 'pharmacist', 'admin')),
    abha_id VARCHAR(50),
    facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    village VARCHAR(100),
    language_pref VARCHAR(10) DEFAULT 'mr' CHECK (language_pref IN ('en', 'mr', 'hi')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Patients (Demographics & FHIR Patient resource mirror)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    abha_id VARCHAR(50) UNIQUE,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    village VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL DEFAULT 'Pune',
    emergency_contact VARCHAR(20),
    high_risk_flags TEXT[] DEFAULT '{}', -- e.g. ['pregnancy', 'hypertension', 'diabetes', 'child']
    asha_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Encounters (FHIR Encounter resource mirror)
CREATE TABLE IF NOT EXISTS public.encounters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    encounter_type VARCHAR(50) NOT NULL CHECK (encounter_type IN ('in_person', 'teleconsult', 'field_asha')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    reason TEXT NOT NULL,
    clinical_notes TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Observations (FHIR Observation vitals resource mirror)
CREATE TABLE IF NOT EXISTS public.observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encounter_id UUID REFERENCES public.encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    bp_systolic INT,
    bp_diastolic INT,
    pulse_rate INT,
    temperature_f NUMERIC(4,1),
    spo2_percent INT,
    weight_kg NUMERIC(5,2),
    glucose_mg_dl INT,
    triage_color VARCHAR(20) CHECK (triage_color IN ('green', 'yellow', 'orange', 'red')),
    triage_recommendation TEXT,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Conditions (FHIR Condition resource mirror)
CREATE TABLE IF NOT EXISTS public.conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES public.encounters(id) ON DELETE SET NULL,
    code VARCHAR(50),
    display_name VARCHAR(255) NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('mild', 'moderate', 'severe')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'chronic')),
    is_high_risk BOOLEAN DEFAULT FALSE,
    diagnosed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MedicationRequests (FHIR MedicationRequest resource mirror)
CREATE TABLE IF NOT EXISTS public.medication_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encounter_id UUID REFERENCES public.encounters(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL DEFAULT 5,
    instructions TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dispensed', 'cancelled')),
    prescribed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    prescribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DiagnosticReports (FHIR DiagnosticReport resource mirror)
CREATE TABLE IF NOT EXISTS public.diagnostic_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encounter_id UUID REFERENCES public.encounters(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Lab Test',
    status VARCHAR(50) NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'sample_collected', 'result_ready', 'delivered')),
    result_summary TEXT,
    file_url TEXT,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    ordered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ordered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Referrals (Cross-facility Referral lifecycle with mandatory audit trail)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    referring_facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    receiving_facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    referring_provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    urgency VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
    reason TEXT NOT NULL,
    clinical_summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'scheduled', 'completed', 'no_show')),
    audit_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CarePlans / Followups
CREATE TABLE IF NOT EXISTS public.care_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    follow_up_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'missed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MedicineInventory
CREATE TABLE IF NOT EXISTS public.medicine_inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Essential Medicine',
    quantity INT NOT NULL DEFAULT 0,
    threshold INT NOT NULL DEFAULT 20,
    status VARCHAR(50) GENERATED ALWAYS AS (
        CASE 
            WHEN quantity = 0 THEN 'out_of_stock'
            WHEN quantity <= threshold THEN 'low'
            ELSE 'available'
        END
    ) STORED,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(facility_id, medicine_name)
);

-- 12. Appointments & Live Queue
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    token_number INT NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'emergency')),
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'in_consultation', 'completed', 'skipped')),
    estimated_wait_min INT DEFAULT 15,
    appointment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SyncQueue (ASHA Offline Sync)
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asha_worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'patient', 'observation', 'referral'
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'error')),
    version_vector VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- 14. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'alert', 'referral', 'followup', 'inventory'
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MedEase Seed Data for Maharashtra Public Healthcare Infrastructure

-- Clear existing sample data safely
TRUNCATE public.notifications, public.sync_queue, public.appointments, public.medicine_inventories, 
         public.care_plans, public.referrals, public.diagnostic_reports, public.medication_requests, 
         public.conditions, public.observations, public.encounters, public.patients, 
         public.profiles, public.facilities RESTART IDENTITY CASCADE;

-- 1. Seed Facilities
INSERT INTO public.facilities (id, name, type, village, taluka, district, address, phone, emergency_contact, distance_approx_km, services_offered) VALUES
('f1000000-0000-0000-0000-000000000001', 'Khed Sub-Centre', 'sub_centre', 'Khed Shivapur', 'Haveli', 'Pune', 'Sub-Centre Bldg, Main Road, Khed Shivapur', '+91-20-24310001', '+91-9822000001', 3.2, ARRAY['Maternal Screening', 'Basic Triage', 'Immunization', 'First Aid']),
('f2000000-0000-0000-0000-000000000002', 'Manchar Primary Health Centre (PHC)', 'phc', 'Manchar', 'Ambegaon', 'Pune', 'PHC Campus, Near Bus Stand, Manchar', '+91-2133-220012', '+91-9822000002', 8.5, ARRAY['General Outpatient', 'Teleconsultation', 'Essential Medicines', 'ANC Care', 'Lab Diagnostics']),
('f3000000-0000-0000-0000-000000000003', 'Velhe Primary Health Centre (PHC)', 'phc', 'Velhe', 'Velhe', 'Pune', 'Fort Road, Near Tehsildar Office, Velhe', '+91-2130-232110', '+91-9822000003', 12.1, ARRAY['General Outpatient', 'Teleconsultation', 'Emergency Stabilization', 'Maternity']),
('f4000000-0000-0000-0000-000000000004', 'Shirur Rural Hospital', 'rural_hospital', 'Shirur', 'Shirur', 'Pune', 'Nagar Road, Hospital Campus, Shirur', '+91-2138-222045', '+91-9822000004', 24.0, ARRAY['Inpatient Wards', 'Minor Surgery', 'Specialist Teleconsult', 'Advanced Diagnostics', '24x7 Emergency']),
('f5000000-0000-0000-0000-000000000005', 'Aundh District Hospital', 'district_hospital', 'Aundh', 'Haveli', 'Pune', 'Aundh Chest Hospital Campus, Pune', '+91-20-27290000', '+91-9822000005', 45.0, ARRAY['Multi-specialty Care', 'ICU', 'High-Risk Obstetrics', 'Surgical Suites', 'Central Blood Bank', 'CT/MRI Diagnostics']);

-- 2. Seed User Profiles
INSERT INTO public.profiles (id, full_name, phone, role, abha_id, facility_id, village, language_pref) VALUES
('p1000000-0000-0000-0000-000000000001', 'Sunita Sunasara (ASHA)', '+91-9811100001', 'asha', '91-1029-4820-1101', 'f1000000-0000-0000-0000-000000000001', 'Khed Shivapur', 'mr'),
('p2000000-0000-0000-0000-000000000002', 'Dr. Rajesh Patil', '+91-9811100002', 'doctor', '91-5541-2091-2202', 'f2000000-0000-0000-0000-000000000002', 'Manchar', 'mr'),
('p3000000-0000-0000-0000-000000000003', 'Dr. Priya Deshmukh (Obstetrician)', '+91-9811100003', 'doctor', '91-8832-1102-3303', 'f5000000-0000-0000-0000-000000000005', 'Aundh', 'en'),
('p4000000-0000-0000-0000-000000000004', 'Ramesh Shinde (Pharmacist)', '+91-9811100004', 'pharmacist', '91-7721-4401-4404', 'f2000000-0000-0000-0000-000000000002', 'Manchar', 'mr'),
('p5000000-0000-0000-0000-000000000005', 'District Officer Vikram Pawar', '+91-9811100005', 'admin', '91-9900-3321-5505', 'f5000000-0000-0000-0000-000000000005', 'Pune', 'en');

-- 3. Seed Patients
INSERT INTO public.patients (id, profile_id, full_name, phone, abha_id, age, gender, blood_group, village, taluka, district, emergency_contact, high_risk_flags, asha_worker_id) VALUES
('pa100000-0000-0000-0000-000000000001', NULL, 'Pooja Ganpat More', '+91-9765432101', '91-4432-1200-9001', 24, 'female', 'O+', 'Khed Shivapur', 'Haveli', 'Pune', '+91-9765432100', ARRAY['pregnancy'], 'p1000000-0000-0000-0000-000000000001'),
('pa200000-0000-0000-0000-000000000002', NULL, 'Eknath Tukaram Jadhav', '+91-9765432102', '91-4432-1200-9002', 58, 'male', 'B+', 'Khed Shivapur', 'Haveli', 'Pune', '+91-9765432199', ARRAY['hypertension', 'diabetes'], 'p1000000-0000-0000-0000-000000000001'),
('pa300000-0000-0000-0000-000000000003', NULL, 'Sharda Baburao Kamble', '+91-9765432103', '91-4432-1200-9003', 31, 'female', 'A+', 'Manchar', 'Ambegaon', 'Pune', '+91-9765432198', ARRAY['pregnancy', 'hypertension'], 'p1000000-0000-0000-0000-000000000001'),
('pa400000-0000-0000-0000-000000000004', NULL, 'Aarav Sachin Gaikwad', '+91-9765432104', '91-4432-1200-9004', 4, 'male', 'AB+', 'Velhe', 'Velhe', 'Pune', '+91-9765432197', ARRAY['pediatric'], 'p1000000-0000-0000-0000-000000000001'),
('pa500000-0000-0000-0000-000000000005', NULL, 'Maruti Dnyanoba Bhosale', '+91-9765432105', '91-4432-1200-9005', 65, 'male', 'O-', 'Shirur', 'Shirur', 'Pune', '+91-9765432196', ARRAY['diabetes'], NULL);

-- 4. Seed Encounters
INSERT INTO public.encounters (id, patient_id, provider_id, facility_id, encounter_type, status, reason, clinical_notes, started_at) VALUES
('e1000000-0000-0000-0000-000000000001', 'pa100000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000002', 'in_person', 'completed', '2nd Trimester ANC Checkup & BP screening', 'Patient reports slight pedal edema. Fetal heart rate normal (142 bpm). BP mildly elevated.', NOW() - INTERVAL '2 days'),
('e2000000-0000-0000-0000-000000000002', 'pa200000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000002', 'teleconsult', 'completed', 'Follow-up on blood pressure and Metformin dosage', 'BP stabilized under Telmisartan 40mg. Fasting blood sugar 138 mg/dL. Continue current meds.', NOW() - INTERVAL '1 day'),
('e3000000-0000-0000-0000-000000000003', 'pa300000-0000-0000-0000-000000000003', 'p2000000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000002', 'in_person', 'in_progress', 'High BP in 3rd trimester pregnancy - Urgent ANC Triage', 'BP 150/98 mmHg. Requires district hospital specialist referral for pre-eclampsia evaluation.', NOW());

-- 5. Seed Observations (Vitals)
INSERT INTO public.observations (encounter_id, patient_id, bp_systolic, bp_diastolic, pulse_rate, temperature_f, spo2_percent, weight_kg, glucose_mg_dl, triage_color, triage_recommendation, recorded_by) VALUES
('e1000000-0000-0000-0000-000000000001', 'pa100000-0000-0000-0000-000000000001', 128, 84, 78, 98.4, 99, 58.5, 95, 'yellow', 'Routine ANC care + iron folic acid supplements.', 'p1000000-0000-0000-0000-000000000001'),
('e2000000-0000-0000-0000-000000000002', 'pa200000-0000-0000-0000-000000000002', 138, 88, 82, 98.6, 97, 72.0, 142, 'yellow', 'Monitor BP weekly via ASHA worker.', 'p2000000-0000-0000-0000-000000000002'),
('e3000000-0000-0000-0000-000000000003', 'pa300000-0000-0000-0000-000000000003', 154, 102, 94, 98.7, 98, 64.0, 110, 'orange', 'Immediate referral to Aundh District Hospital for specialist OB/GYN.', 'p2000000-0000-0000-0000-000000000002');

-- 6. Seed Conditions
INSERT INTO public.conditions (patient_id, encounter_id, code, display_name, severity, status, is_high_risk) VALUES
('pa100000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'O09.2', 'High Risk Pregnancy (2nd Trimester)', 'moderate', 'active', TRUE),
('pa200000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000002', 'I10', 'Essential Primary Hypertension', 'moderate', 'chronic', TRUE),
('pa300000-0000-0000-0000-000000000003', 'e3000000-0000-0000-0000-000000000003', 'O14.0', 'Mild Pre-eclampsia in Pregnancy', 'severe', 'active', TRUE);

-- 7. Seed Prescriptions
INSERT INTO public.medication_requests (encounter_id, patient_id, medicine_name, dosage, frequency, duration_days, instructions, status, prescribed_by) VALUES
('e1000000-0000-0000-0000-000000000001', 'pa100000-0000-0000-0000-000000000001', 'Iron & Folic Acid Tablets (IFA)', '100mg Iron + 500mcg FA', 'Once daily after meals', 30, 'Take with water or citrus juice', 'active', 'p2000000-0000-0000-0000-000000000002'),
('e1000000-0000-0000-0000-000000000001', 'pa100000-0000-0000-0000-000000000001', 'Calcium Carbonate', '500mg', 'Twice daily', 30, 'Avoid taking simultaneously with IFA', 'active', 'p2000000-0000-0000-0000-000000000002'),
('e2000000-0000-0000-0000-000000000002', 'pa200000-0000-0000-0000-000000000002', 'Telmisartan Tablets', '40mg', 'Once daily (morning)', 30, 'Monitor BP twice weekly', 'active', 'p2000000-0000-0000-0000-000000000002');

-- 8. Seed Diagnostic Reports
INSERT INTO public.diagnostic_reports (encounter_id, patient_id, test_name, category, status, result_summary, facility_id, ordered_by) VALUES
('e1000000-0000-0000-0000-000000000001', 'pa100000-0000-0000-0000-000000000001', 'Complete Blood Count (CBC) & Hemoglobin', 'Haematology', 'result_ready', 'Hb: 11.2 g/dL (Slightly low, continue IFA supplement). Platelets: 240,000.', 'f2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002'),
('e3000000-0000-0000-0000-000000000003', 'pa300000-0000-0000-0000-000000000003', 'Urine Protein & Kidney Function Panel', 'Biochemistry', 'ordered', 'Sample dispatched to District Hospital lab.', 'f5000000-0000-0000-0000-000000000005', 'p2000000-0000-0000-0000-000000000002');

-- 9. Seed Referrals with Audit Trail
INSERT INTO public.referrals (id, patient_id, referring_facility_id, receiving_facility_id, referring_provider_id, urgency, reason, clinical_summary, status, audit_history) VALUES
('r1000000-0000-0000-0000-000000000001', 'pa300000-0000-0000-0000-000000000003', 'f2000000-0000-0000-0000-000000000002', 'f5000000-0000-0000-0000-000000000005', 'p2000000-0000-0000-0000-000000000002', 'high', 'Pre-eclampsia evaluation in 32-week ANC patient', 'Patient presenting with persistent headache and BP 154/102. Urgent OB/GYN specialist evaluation required.', 'acknowledged', '[{"from_status": "pending", "to_status": "acknowledged", "timestamp": "2026-08-24T14:30:00Z", "updated_by": "Dr. Priya Deshmukh"}]'::jsonb),
('r2000000-0000-0000-0000-000000000002', 'pa200000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'medium', 'Hypertension medication adjustment', 'ASHA worker detected blood pressure 148/92 during home visit.', 'completed', '[{"from_status": "pending", "to_status": "scheduled", "timestamp": "2026-08-20T10:00:00Z", "updated_by": "PHC Desk"}, {"from_status": "scheduled", "to_status": "completed", "timestamp": "2026-08-23T11:15:00Z", "updated_by": "Dr. Rajesh Patil"}]'::jsonb);

-- 10. Seed Care Plans / Follow-ups
INSERT INTO public.care_plans (patient_id, doctor_id, reason, follow_up_date, status, notes) VALUES
('pa100000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000002', 'Routine 3rd Trimester ANC Check', CURRENT_DATE + INTERVAL '7 days', 'pending', 'ASHA Sunita to check home BP 2 days prior'),
('pa300000-0000-0000-0000-000000000003', 'p3000000-0000-0000-0000-000000000003', 'Specialist OB/GYN Review at Aundh Hospital', CURRENT_DATE + INTERVAL '2 days', 'pending', 'Bring all recent ultrasound & blood report copies');

-- 11. Seed Medicine Inventory (Manchar PHC & District Hospital)
INSERT INTO public.medicine_inventories (facility_id, medicine_name, category, quantity, threshold) VALUES
('f2000000-0000-0000-0000-000000000002', 'Iron & Folic Acid Tablets (IFA)', 'Maternal Health', 450, 100),
('f2000000-0000-0000-0000-000000000002', 'Calcium Carbonate 500mg', 'Maternal Health', 120, 50),
('f2000000-0000-0000-0000-000000000002', 'Telmisartan 40mg', 'Chronic Disease', 15, 30), -- LOW STOCK!
('f2000000-0000-0000-0000-000000000002', 'Metformin 500mg', 'Chronic Disease', 0, 40),   -- OUT OF STOCK!
('f2000000-0000-0000-0000-000000000002', 'Paracetamol 500mg', 'General Analgesic', 800, 150),
('f5000000-0000-0000-0000-000000000005', 'Magnesium Sulfate Injection', 'Emergency OB', 60, 20),
('f5000000-0000-0000-0000-000000000005', 'Oxytocin 10 IU', 'Maternal Health', 200, 50),
('f5000000-0000-0000-0000-000000000005', 'Telmisartan 40mg', 'Chronic Disease', 500, 100);

-- 12. Seed Appointments & Queue
INSERT INTO public.appointments (patient_id, facility_id, doctor_id, token_number, priority, status, estimated_wait_min) VALUES
('pa300000-0000-0000-0000-000000000003', 'f2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', 101, 'emergency', 'in_consultation', 0),
('pa100000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', 102, 'high', 'queued', 10),
('pa200000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', 103, 'normal', 'queued', 25);

-- 13. Seed Notifications
INSERT INTO public.notifications (user_id, title, message, type) VALUES
('p2000000-0000-0000-0000-000000000002', 'High-Risk Referral Acknowledged', 'Specialist Dr. Priya Deshmukh acknowledged patient Sharda Kamble referral.', 'referral'),
('p4000000-0000-0000-0000-000000000004', 'Low Stock Warning: Telmisartan 40mg', 'Current quantity (15) is below safety threshold (30).', 'inventory'),
('p1000000-0000-0000-0000-000000000001', 'ANC Follow-Up Scheduled', 'Pooja Ganpat More follow-up check scheduled for next week.', 'followup');

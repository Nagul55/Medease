-- MedEase Row Level Security & Audit Triggers

-- Enable RLS on all main tables
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Permissive RLS for demo/sandbox mode & service role access
CREATE POLICY "Public Read Facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public All Patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Public All Encounters" ON public.encounters FOR ALL USING (true);
CREATE POLICY "Public All Observations" ON public.observations FOR ALL USING (true);
CREATE POLICY "Public All Conditions" ON public.conditions FOR ALL USING (true);
CREATE POLICY "Public All Medications" ON public.medication_requests FOR ALL USING (true);
CREATE POLICY "Public All Diagnostics" ON public.diagnostic_reports FOR ALL USING (true);
CREATE POLICY "Public All Referrals" ON public.referrals FOR ALL USING (true);
CREATE POLICY "Public All CarePlans" ON public.care_plans FOR ALL USING (true);
CREATE POLICY "Public All Inventories" ON public.medicine_inventories FOR ALL USING (true);
CREATE POLICY "Public All Appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Public All SyncQueue" ON public.sync_queue FOR ALL USING (true);
CREATE POLICY "Public All Notifications" ON public.notifications FOR ALL USING (true);

-- Function & Trigger to append referral audit log on status change
CREATE OR REPLACE FUNCTION public.audit_referral_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.audit_history = COALESCE(OLD.audit_history, '[]'::jsonb) || jsonb_build_object(
            'from_status', OLD.status,
            'to_status', NEW.status,
            'timestamp', NOW(),
            'updated_by', current_user
        );
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_referral_audit ON public.referrals;
CREATE TRIGGER trigger_referral_audit
    BEFORE UPDATE ON public.referrals
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_referral_status_change();

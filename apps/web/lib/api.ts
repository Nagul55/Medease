/**
 * MedEase Frontend API Client
 * Connects Next.js UI to FastAPI Backend endpoints
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch healthcare facilities
 */
export async function fetchFacilities(type?: string) {
  try {
    const url = type
      ? `${API_BASE}/facilities/?type=${encodeURIComponent(type)}`
      : `${API_BASE}/facilities/`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch facilities");
    }

    return await res.json();
  } catch (err) {
    console.warn("Using fallback facilities data", err);

    return {
      facilities: [
        {
          id: "f1000000-0000-0000-0000-000000000001",
          name: "Khed Sub-Centre",
          type: "sub_centre",
          village: "Khed Shivapur",
          taluka: "Haveli",
          district: "Pune",
          address: "Sub-Centre Bldg, Main Road, Khed Shivapur",
          phone: "+91-20-24310001",
          emergency_contact: "+91-9822000005",
          distance_approx_km: 3.2,
          services_offered: [
            "Maternal Screening",
            "Basic Triage",
            "Immunization",
            "First Aid",
          ],
        },
        {
          id: "f2000000-0000-0000-0000-000000000002",
          name: "Manchar Primary Health Centre (PHC)",
          type: "phc",
          village: "Manchar",
          taluka: "Ambegaon",
          district: "Pune",
          address: "PHC Campus, Near Bus Stand, Manchar",
          phone: "+91-2133-220012",
          emergency_contact: "+91-9822000002",
          distance_approx_km: 8.5,
          services_offered: [
            "General Outpatient",
            "Teleconsultation",
            "Essential Medicines",
            "ANC Care",
          ],
        },
        {
          id: "f5000000-0000-0000-0000-000000000005",
          name: "Aundh District Hospital",
          type: "district_hospital",
          village: "Aundh",
          taluka: "Haveli",
          district: "Pune",
          address: "Aundh Chest Hospital Campus, Pune",
          phone: "+91-20-27290000",
          emergency_contact: "+91-9822000005",
          distance_approx_km: 45.0,
          services_offered: [
            "Multi-specialty Care",
            "ICU",
            "High-Risk Obstetrics",
            "24x7 Emergency",
          ],
        },
      ],
    };
  }
}

/**
 * Submit digital triage evaluation
 */
export async function postTriageEvaluation(data: any) {
  const res = await fetch(`${API_BASE}/triage/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to evaluate triage");
  }

  return await res.json();
}

/**
 * Fetch patients
 */
export async function fetchPatients(
  query?: string,
  highRiskOnly?: boolean
) {
  try {
    let url = `${API_BASE}/patients/`;

    const params = new URLSearchParams();

    if (query) {
      params.append("query", query);
    }

    if (highRiskOnly) {
      params.append("high_risk_only", "true");
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch patients");
    }

    return await res.json();
  } catch (err) {
    console.warn("Unable to fetch patients", err);

    return {
      patients: [],
    };
  }
}

/**
 * Fetch referrals
 */
export async function fetchReferrals() {
  try {
    const res = await fetch(`${API_BASE}/referrals/`);

    if (!res.ok) {
      throw new Error("Failed to fetch referrals");
    }

    return await res.json();
  } catch (err) {
    console.warn("Unable to fetch referrals", err);

    return {
      referrals: [],
    };
  }
}

/**
 * Update referral status
 */
export async function updateReferralStatus(
  referralId: string,
  status: string,
  updatedByName: string
) {
  const res = await fetch(
    `${API_BASE}/referrals/${referralId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        updated_by_name: updatedByName,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update referral status");
  }

  return await res.json();
}

/**
 * Fetch medicine inventory
 */
export async function fetchInventory() {
  try {
    const res = await fetch(
      `${API_BASE}/medicines/inventory`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch inventory");
    }

    return await res.json();
  } catch (err) {
    console.warn("Unable to fetch inventory", err);

    return {
      inventory: [],
    };
  }
}

/**
 * Fetch appointment queue
 */
export async function fetchQueue() {
  try {
    const res = await fetch(`${API_BASE}/appointments/`);

    if (!res.ok) {
      throw new Error("Failed to fetch queue");
    }

    return await res.json();
  } catch (err) {
    console.warn("Unable to fetch queue", err);

    return {
      queue: [],
    };
  }
}

/**
 * Fetch diagnostic orders
 */
export async function fetchDiagnostics() {
  try {
    const res = await fetch(`${API_BASE}/diagnostics/`);

    if (!res.ok) {
      throw new Error("Failed to fetch diagnostics");
    }

    return await res.json();
  } catch (err) {
    console.warn("Unable to fetch diagnostics", err);

    return {
      orders: [],
    };
  }
}
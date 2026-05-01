// Hand-authored seed for the UI prototype, not real-world data.
// `level` matches the four-step risk scale from DESIGN.md §2 exactly.

export const alerts = [
  {
    id: "alert-1",
    districtId: "dhaka",
    level: "Calm",
    headline: "All clear — Mirpur",
    body: "No active flood risk in your area. Conditions are stable across Buriganga sensors.",
    issuedAt: "2026-04-30T08:00:00Z",
  },
  {
    id: "alert-2",
    districtId: "khulna",
    level: "Watch",
    headline: "Heavier rainfall expected — Khulna",
    body: "Forecast indicates 60–80mm rainfall over the next 24h. Monitor Rupsha and Bhairab levels.",
    issuedAt: "2026-04-30T14:30:00Z",
  },
  {
    id: "alert-3",
    districtId: "chattogram",
    level: "Warning",
    headline: "Karnaphuli rising — prepare to evacuate",
    body: "Karnaphuli has crossed the warning threshold near Patenga. Pack essentials and identify your nearest shelter.",
    issuedAt: "2026-05-01T03:15:00Z",
  },
  {
    id: "alert-4",
    districtId: "sylhet",
    level: "Severe",
    headline: "Evacuate now — Surma flooding",
    body: "Surma has overtopped embankments in central Sylhet. Move to the nearest verified shelter immediately.",
    issuedAt: "2026-05-01T05:45:00Z",
  },
];

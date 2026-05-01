// Hand-authored seed for the UI prototype, not real-world data.
// `id` uses a mono-friendly short code for operator-mode display.
// `baselineLevel` is the typical river level in metres used by the simulation.

export const sensors = [
  // Dhaka — Buriganga & Turag
  { id: "BG-01", districtId: "dhaka", riverName: "Buriganga", lat: 23.7104, lng: 90.4074, baselineLevel: 4.0 },
  { id: "BG-02", districtId: "dhaka", riverName: "Buriganga", lat: 23.7250, lng: 90.4188, baselineLevel: 4.1 },
  { id: "TG-01", districtId: "dhaka", riverName: "Turag", lat: 23.8500, lng: 90.3800, baselineLevel: 3.6 },
  { id: "TG-02", districtId: "dhaka", riverName: "Turag", lat: 23.8800, lng: 90.3700, baselineLevel: 3.5 },

  // Sylhet — Surma & Kushiyara
  { id: "SU-01", districtId: "sylhet", riverName: "Surma", lat: 24.9020, lng: 91.8550, baselineLevel: 5.2 },
  { id: "SU-02", districtId: "sylhet", riverName: "Surma", lat: 24.8800, lng: 91.8800, baselineLevel: 5.1 },
  { id: "KU-01", districtId: "sylhet", riverName: "Kushiyara", lat: 24.7500, lng: 91.9500, baselineLevel: 4.8 },

  // Chattogram — Karnaphuli & Halda
  { id: "KP-01", districtId: "chattogram", riverName: "Karnaphuli", lat: 22.3300, lng: 91.8200, baselineLevel: 3.2 },
  { id: "KP-02", districtId: "chattogram", riverName: "Karnaphuli", lat: 22.3700, lng: 91.7900, baselineLevel: 3.4 },
  { id: "HL-01", districtId: "chattogram", riverName: "Halda", lat: 22.5200, lng: 91.8400, baselineLevel: 2.9 },

  // Khulna — Rupsha & Bhairab
  { id: "RP-01", districtId: "khulna", riverName: "Rupsha", lat: 22.8200, lng: 89.5600, baselineLevel: 3.0 },
  { id: "RP-02", districtId: "khulna", riverName: "Rupsha", lat: 22.8700, lng: 89.5300, baselineLevel: 3.1 },
  { id: "BH-01", districtId: "khulna", riverName: "Bhairab", lat: 22.9200, lng: 89.5100, baselineLevel: 2.8 },
];

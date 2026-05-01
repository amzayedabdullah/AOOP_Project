// Hand-authored, indicative shapes for the prototype — not real GIS boundaries.
// Polygons are 4–6 vertex arrays of [lat, lng] pairs roughly placed inside each
// district's bounding box. Zone names are real neighborhoods/areas; the shapes
// are suggestive only. Replace with real GeoJSON in a future change if needed.

export const zones = [
  // Dhaka — exercises all four risk levels for the demo.
  {
    id: "dhaka-mirpur",
    districtId: "dhaka",
    name: "Mirpur",
    level: "Watch",
    polygon: [
      [23.83, 90.34],
      [23.84, 90.38],
      [23.81, 90.39],
      [23.79, 90.36],
      [23.80, 90.34],
    ],
  },
  {
    id: "dhaka-old-dhaka",
    districtId: "dhaka",
    name: "Old Dhaka",
    level: "Severe",
    polygon: [
      [23.72, 90.40],
      [23.73, 90.43],
      [23.71, 90.44],
      [23.70, 90.42],
      [23.71, 90.40],
    ],
  },
  {
    id: "dhaka-gulshan",
    districtId: "dhaka",
    name: "Gulshan",
    level: "Calm",
    polygon: [
      [23.79, 90.41],
      [23.81, 90.43],
      [23.80, 90.45],
      [23.78, 90.44],
      [23.78, 90.42],
    ],
  },
  {
    id: "dhaka-jatrabari",
    districtId: "dhaka",
    name: "Jatrabari",
    level: "Warning",
    polygon: [
      [23.71, 90.43],
      [23.72, 90.46],
      [23.70, 90.47],
      [23.69, 90.45],
      [23.70, 90.43],
    ],
  },
  {
    id: "dhaka-uttara",
    districtId: "dhaka",
    name: "Uttara",
    level: "Calm",
    polygon: [
      [23.86, 90.39],
      [23.88, 90.41],
      [23.87, 90.43],
      [23.85, 90.42],
      [23.85, 90.40],
    ],
  },
  {
    // A narrow corridor zone between Gulshan (start area) and Uttara (goal)
    // so the "safest" route detours by ~1 grid column while "fastest" cuts
    // straight through. Tejgaon is a real Dhaka neighborhood; the polygon
    // is hand-tightened to a single-column corridor on the demo grid.
    id: "dhaka-tejgaon",
    districtId: "dhaka",
    name: "Tejgaon",
    level: "Warning",
    polygon: [
      [23.842, 90.409],
      [23.842, 90.413],
      [23.813, 90.413],
      [23.813, 90.409],
    ],
  },

  // Sylhet
  {
    id: "sylhet-central",
    districtId: "sylhet",
    name: "Sylhet Central",
    level: "Watch",
    polygon: [
      [24.90, 91.85],
      [24.92, 91.88],
      [24.90, 91.90],
      [24.88, 91.88],
      [24.88, 91.86],
    ],
  },
  {
    id: "sylhet-south",
    districtId: "sylhet",
    name: "Sylhet South",
    level: "Calm",
    polygon: [
      [24.78, 91.92],
      [24.80, 91.95],
      [24.78, 91.97],
      [24.76, 91.95],
      [24.76, 91.93],
    ],
  },

  // Chattogram
  {
    id: "chattogram-port",
    districtId: "chattogram",
    name: "Chattogram Port",
    level: "Watch",
    polygon: [
      [22.34, 91.80],
      [22.36, 91.82],
      [22.34, 91.84],
      [22.32, 91.82],
      [22.32, 91.81],
    ],
  },
  {
    id: "chattogram-halda",
    districtId: "chattogram",
    name: "Halda Valley",
    level: "Calm",
    polygon: [
      [22.50, 91.83],
      [22.53, 91.85],
      [22.52, 91.87],
      [22.50, 91.86],
      [22.49, 91.84],
    ],
  },

  // Khulna
  {
    id: "khulna-central",
    districtId: "khulna",
    name: "Khulna Central",
    level: "Calm",
    polygon: [
      [22.83, 89.55],
      [22.85, 89.57],
      [22.84, 89.59],
      [22.82, 89.58],
      [22.82, 89.56],
    ],
  },
  {
    id: "khulna-rupsha",
    districtId: "khulna",
    name: "Rupsha",
    level: "Calm",
    polygon: [
      [22.86, 89.52],
      [22.88, 89.54],
      [22.87, 89.55],
      [22.85, 89.54],
      [22.85, 89.53],
    ],
  },
];

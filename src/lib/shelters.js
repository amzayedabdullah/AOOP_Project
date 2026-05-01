// Pure helpers — no library, no module-level state, no React/SVG imports.

import { shelters } from "@/data/shelters";

const EARTH_RADIUS_KM = 6371;

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

// Great-circle distance in kilometers between two [lat, lng] points.
export function haversineDistance([lat1, lng1], [lat2, lng2]) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
}

export function nearestShelters(
  districtId,
  fromLatLng,
  n = 5,
  options = { verifiedOnly: true },
) {
  const verifiedOnly = options?.verifiedOnly ?? true;
  return shelters
    .filter(
      (s) =>
        s.districtId === districtId && (!verifiedOnly || s.verified === true),
    )
    .map((shelter) => ({
      shelter,
      distanceKm: haversineDistance(fromLatLng, [shelter.lat, shelter.lng]),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, n);
}

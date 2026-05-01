// Linear lat/lng → SVG (x, y) projection.
//
// At district scale (~30 km across) the curvature error of a linear
// projection is negligible and easy to verify by eye. The future
// operator-mode "all districts" map zooms out to ~13° of Bangladesh; that
// is still small enough for a UI demo, but if it visibly skews we can
// swap this for a Mercator helper at that point.

export function projectLatLngToSvg(lat, lng, bbox, viewBox) {
  const lngRange = bbox.maxLng - bbox.minLng || 1;
  const latRange = bbox.maxLat - bbox.minLat || 1;

  const x = ((lng - bbox.minLng) / lngRange) * viewBox.width;
  // Invert Y because SVG y grows downward.
  const y = ((bbox.maxLat - lat) / latRange) * viewBox.height;

  return { x, y };
}

export function bboxFromPolygons(polygons) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const polygon of polygons) {
    for (const [lat, lng] of polygon) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
  }

  return { minLat, maxLat, minLng, maxLng };
}

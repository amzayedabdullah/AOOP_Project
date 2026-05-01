// Project-specific routing layer that wraps the textbook A* in `astar.js`.
//
// Cost model per cell:
//   cost = 1 (base)
//        + riskWeight        * riskCostFor(zoneLevelContainingCell)
//        + congestionWeight  * congestionFor(col, row)
//
// `congestionFor` is honestly fake — a deterministic noise function so the
// "least-congested" variant produces a route that visibly differs from the
// other two. A real product would back this with traffic data; this is a
// frontend-only UI demo.

import { findPath } from "./astar.js";
import { bboxFromPolygons } from "./projection.js";
import { nearestShelters } from "./shelters.js";
import { districts } from "@/data/districts";
import { zones as allZones } from "@/data/zones";

const COLS = 30;
const ROWS = 20;

const RISK_COST = {
  Calm: 0,
  Watch: 2,
  Warning: 5,
  Severe: 10,
};

const VARIANT_OPTIONS = {
  safest: { riskWeight: 1, congestionWeight: 0 },
  fastest: { riskWeight: 0, congestionWeight: 0 },
  "least-congested": { riskWeight: 0.5, congestionWeight: 1 },
};

export function riskCostFor(level) {
  return RISK_COST[level] ?? 0;
}

export function congestionFor(col, row) {
  return (col * 7 + row * 13) % 5;
}

// Standard ray-casting (W. Randolph Franklin). Polygon vertices are [lat, lng].
export function pointInPolygon([lat, lng], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const intersects =
      latI > lat !== latJ > lat &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Cell <-> lat/lng converters. The cell-coordinate system has (0,0) at the
// top-left of the bbox (max lat, min lng) and grows down/right.
export function latLngToCell(lat, lng, bbox, cols, rows) {
  const cellWidthLng = (bbox.maxLng - bbox.minLng) / cols;
  const cellHeightLat = (bbox.maxLat - bbox.minLat) / rows;
  const col = Math.floor((lng - bbox.minLng) / cellWidthLng);
  const row = Math.floor((bbox.maxLat - lat) / cellHeightLat);
  return [
    Math.max(0, Math.min(cols - 1, col)),
    Math.max(0, Math.min(rows - 1, row)),
  ];
}

export function cellToLatLng(col, row, bbox, cols, rows) {
  const cellWidthLng = (bbox.maxLng - bbox.minLng) / cols;
  const cellHeightLat = (bbox.maxLat - bbox.minLat) / rows;
  const lng = bbox.minLng + (col + 0.5) * cellWidthLng;
  const lat = bbox.maxLat - (row + 0.5) * cellHeightLat;
  return [lat, lng];
}

export function buildDistrictGrid(
  districtId,
  options = { riskWeight: 1, congestionWeight: 0 },
) {
  const districtZones = allZones.filter((z) => z.districtId === districtId);
  const bbox = bboxFromPolygons(districtZones.map((z) => z.polygon));

  const costs = new Array(COLS * ROWS);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const center = cellToLatLng(col, row, bbox, COLS, ROWS);
      const containing = districtZones.find((z) =>
        pointInPolygon(center, z.polygon),
      );
      const riskCost = containing ? riskCostFor(containing.level) : 0;
      const congestion = congestionFor(col, row);
      costs[col + row * COLS] =
        1 +
        options.riskWeight * riskCost +
        options.congestionWeight * congestion;
    }
  }

  return { cols: COLS, rows: ROWS, costs, bbox };
}

export function computeRoute(districtId, variant, goalLatLng) {
  const district = districts.find((d) => d.id === districtId);
  if (!district) return null;

  // Default goal: the nearest verified shelter for this district.
  let resolvedGoal = goalLatLng;
  if (!resolvedGoal) {
    const nearest = nearestShelters(
      districtId,
      [district.center.lat, district.center.lng],
      1,
      { verifiedOnly: true },
    );
    if (nearest.length === 0) return null;
    resolvedGoal = [nearest[0].shelter.lat, nearest[0].shelter.lng];
  }

  const options = VARIANT_OPTIONS[variant] ?? VARIANT_OPTIONS.safest;
  const grid = buildDistrictGrid(districtId, options);

  const startCell = latLngToCell(
    district.center.lat,
    district.center.lng,
    grid.bbox,
    grid.cols,
    grid.rows,
  );
  const goalCell = latLngToCell(
    resolvedGoal[0],
    resolvedGoal[1],
    grid.bbox,
    grid.cols,
    grid.rows,
  );

  const result = findPath(grid, startCell, goalCell);
  if (!result) return null;

  const path = result.path.map(([col, row]) =>
    cellToLatLng(col, row, grid.bbox, grid.cols, grid.rows),
  );

  return { path, cost: result.cost, variant };
}

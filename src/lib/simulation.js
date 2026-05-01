// What-if simulation layer — pure helpers that compose with risk.js without
// replacing it. Existing helpers (`currentLevelFor`, `districtRiskScore`)
// keep their behavior; new helpers add user-controlled offsets on top.
//
// Slider weights are HAND-TUNED for the demo:
//   - 200 mm/h rainfall → +1.0 m river level (linear scaling)
//   - +1 m river offset → +1 m level
//   - +1 m tide offset → +0.5 m level (uniformly applied; a real product
//     would weight per sensor by distance to coast)
// A hydrologist would frown — we're showing the input → recomputed risk
// pattern, not modeling the Buriganga.

import { sensors } from "@/data/sensors";
import { currentLevelFor } from "./risk.js";

export const RAINFALL_PER_MM = 0.005;
export const RIVER_WEIGHT = 1.0;
export const TIDE_WEIGHT = 0.5;

const DELTA_TO_FULL_SCORE = 2.5; // mirrors risk.js — 2.5m delta = score 100

export const DEFAULT_OFFSETS = { rainfallMm: 0, riverM: 0, tideM: 0 };

export function applyOffsets(level, offsets) {
  return (
    level +
    offsets.rainfallMm * RAINFALL_PER_MM +
    offsets.riverM * RIVER_WEIGHT +
    offsets.tideM * TIDE_WEIGHT
  );
}

export function simulatedLevelFor(sensorId, tick, offsets) {
  const base = currentLevelFor(sensorId, tick);
  if (base === null) return null;
  return applyOffsets(base, offsets);
}

export function simulatedDistrictScore(districtId, tick, offsets) {
  const districtSensors = sensors.filter((s) => s.districtId === districtId);
  if (districtSensors.length === 0) return 0;

  let totalScore = 0;
  for (const sensor of districtSensors) {
    const current = simulatedLevelFor(sensor.id, tick, offsets);
    if (current === null) continue;
    const delta = current - sensor.baselineLevel;
    totalScore += (delta / DELTA_TO_FULL_SCORE) * 100;
  }

  const average = totalScore / districtSensors.length;
  const clamped = Math.max(0, Math.min(100, average));
  return Math.round(clamped);
}

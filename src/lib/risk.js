// Single source of truth for risk computation.
//
// Components MUST consume risk-scale colors only via the RiskPill component
// or the RiskSummaryCard's top stripe — not by referencing risk-* color
// tokens directly. This keeps the four-level vocabulary tightly bound to
// one place in the codebase.

import { historicalReadings } from "@/data/historicalReadings";
import { sensors } from "@/data/sensors";

// Score thresholds — see DESIGN.md §2 risk scale.
export const CALM_MAX = 24;
export const WATCH_MAX = 49;
export const WARNING_MAX = 74;
// Severe is anything ≥ 75.

// A 2.5m delta from baseline corresponds to a maxed-out (100) score.
const DELTA_TO_FULL_SCORE = 2.5;

// Most recent reading per sensor, slightly jittered by `tick` so the hero
// number visibly moves. Amplitude is small enough never to cross a level.
export function currentLevelFor(sensorId, tick = 0) {
  const samples = historicalReadings.filter((r) => r.sensorId === sensorId);
  if (samples.length === 0) return null;

  const latest = samples[samples.length - 1];
  const sensorIndex = sensors.findIndex((s) => s.id === sensorId);
  const jitter = Math.sin(tick * 0.1 + sensorIndex) * 0.05;
  return latest.level + jitter;
}

export function districtRiskScore(districtId, tick = 0) {
  const districtSensors = sensors.filter((s) => s.districtId === districtId);
  if (districtSensors.length === 0) return 0;

  let totalScore = 0;
  for (const sensor of districtSensors) {
    const current = currentLevelFor(sensor.id, tick);
    if (current === null) continue;
    const delta = current - sensor.baselineLevel;
    totalScore += (delta / DELTA_TO_FULL_SCORE) * 100;
  }

  const average = totalScore / districtSensors.length;
  const clamped = Math.max(0, Math.min(100, average));
  return Math.round(clamped);
}

export function riskLevelFor(score) {
  if (score <= CALM_MAX) return "Calm";
  if (score <= WATCH_MAX) return "Watch";
  if (score <= WARNING_MAX) return "Warning";
  return "Severe";
}

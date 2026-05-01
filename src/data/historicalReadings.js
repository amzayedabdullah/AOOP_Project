// Hand-authored seed for the UI prototype, not real-world data.
// Generates 24 hourly samples per sensor by jittering the sensor's baselineLevel.
// Deterministic (no Math.random) so the chart is stable across renders and reloads.

import { sensors } from "./sensors.js";

const SAMPLE_COUNT = 24;
// 2026-05-01T00:00:00Z — anchor end-of-window for predictable demo output.
const ANCHOR_END = new Date("2026-05-01T00:00:00Z").getTime();
const HOUR_MS = 60 * 60 * 1000;

// Small deterministic wave so each sensor has a slightly different curve.
function actualOffset(hour, sensorIndex) {
  const phase = sensorIndex * 0.7;
  return Math.sin((hour / 6) + phase) * 0.25;
}

function predictedOffset(hour, sensorIndex) {
  // Predicted line is the actual curve nudged by ~0.05–0.15m to look believable.
  return actualOffset(hour, sensorIndex) + 0.08;
}

function buildSamplesForSensor(sensor, sensorIndex) {
  const samples = [];
  for (let i = SAMPLE_COUNT - 1; i >= 0; i--) {
    const hour = SAMPLE_COUNT - 1 - i;
    const timestamp = new Date(ANCHOR_END - i * HOUR_MS).toISOString();
    samples.push({
      sensorId: sensor.id,
      timestamp,
      level: round2(sensor.baselineLevel + actualOffset(hour, sensorIndex)),
      predictedLevel: round2(
        sensor.baselineLevel + predictedOffset(hour, sensorIndex),
      ),
    });
  }
  return samples;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export const historicalReadings = sensors.flatMap((sensor, index) =>
  buildSamplesForSensor(sensor, index),
);

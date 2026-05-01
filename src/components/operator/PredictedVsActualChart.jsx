// Hand-rolled SVG line chart — two polylines (actual + predicted) with
// axis labels and a small legend. No charting library. Y-axis auto-scales
// per selected sensor so different rivers (Karnaphuli at 3.2m vs Surma at
// 5.2m) all read clearly.

import { sensors } from "@/data/sensors";
import { historicalReadings } from "@/data/historicalReadings";
import { riskLevelFor } from "@/lib/risk";
import RiskPill from "@/components/ui/RiskPill";

const VIEW_W = 600;
const VIEW_H = 240;
const LEFT_GUTTER = 44;
const BOTTOM_GUTTER = 28;
const TOP_PAD = 12;
const RIGHT_PAD = 12;

function deltaToScore(delta) {
  return Math.max(0, Math.min(100, Math.round((delta / 2.5) * 100)));
}

export default function PredictedVsActualChart({ selectedSensorId }) {
  const sensor = sensors.find((s) => s.id === selectedSensorId);
  if (!sensor) {
    return (
      <div className="bg-surface-1 border border-hairline rounded-card p-6 text-ink-muted">
        Select a sensor to see its history.
      </div>
    );
  }

  const samples = historicalReadings
    .filter((r) => r.sensorId === sensor.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (samples.length < 2) {
    return (
      <div className="bg-surface-1 border border-hairline rounded-card p-6 text-ink-muted">
        Not enough history for this sensor.
      </div>
    );
  }

  const allValues = samples.flatMap((s) => [s.level, s.predictedLevel]);
  const yMin = Math.floor((Math.min(...allValues) - 0.3) * 10) / 10;
  const yMax = Math.ceil((Math.max(...allValues) + 0.3) * 10) / 10;
  const yRange = yMax - yMin || 1;

  const usableW = VIEW_W - LEFT_GUTTER - RIGHT_PAD;
  const usableH = VIEW_H - TOP_PAD - BOTTOM_GUTTER;

  function projectY(value) {
    return TOP_PAD + (1 - (value - yMin) / yRange) * usableH;
  }

  function projectX(index) {
    return LEFT_GUTTER + (index / (samples.length - 1)) * usableW;
  }

  const actualPoints = samples
    .map((s, i) => `${projectX(i).toFixed(2)},${projectY(s.level).toFixed(2)}`)
    .join(" ");
  const predictedPoints = samples
    .map(
      (s, i) =>
        `${projectX(i).toFixed(2)},${projectY(s.predictedLevel).toFixed(2)}`,
    )
    .join(" ");

  const yTicks = [0, 1, 2, 3].map((i) => yMin + (i / 3) * yRange);
  const xTicks = [
    { hour: 0, x: projectX(0) },
    { hour: 12, x: projectX(Math.floor(samples.length / 2)) },
    { hour: 24, x: projectX(samples.length - 1) },
  ];

  // Risk pill reflects the sensor's most recent reading vs baseline.
  const lastSample = samples[samples.length - 1];
  const score = deltaToScore(lastSample.level - sensor.baselineLevel);
  const level = riskLevelFor(score);

  return (
    <div className="bg-surface-1 border border-hairline rounded-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
            History
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
            <span className="font-mono">{sensor.id}</span>
            <span className="text-ink-muted"> · {sensor.riverName}</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-3 text-xs text-ink-muted">
            <li className="flex items-center gap-2">
              <span className="inline-block w-6 h-0.5 bg-route-primary" />
              Actual
            </li>
            <li className="flex items-center gap-2">
              <span
                className="inline-block w-6 h-0 border-t-2 border-dashed border-route-alternate"
                aria-hidden="true"
              />
              Predicted
            </li>
          </ul>
          <RiskPill level={level} />
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="w-full h-auto block"
        role="img"
        aria-label={`Predicted vs actual river level for sensor ${sensor.id}`}
      >
        {/* Faint horizontal grid */}
        {yTicks.map((value, i) => {
          const y = projectY(value);
          return (
            <line
              key={i}
              x1={LEFT_GUTTER}
              x2={VIEW_W - RIGHT_PAD}
              y1={y}
              y2={y}
              className="stroke-hairline"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {yTicks.map((value, i) => {
          const y = projectY(value);
          return (
            <text
              key={i}
              x={LEFT_GUTTER - 8}
              y={y + 4}
              className="fill-ink-subtle tnum"
              fontSize="11"
              textAnchor="end"
            >
              {value.toFixed(1)}
            </text>
          );
        })}

        {/* X-axis labels */}
        {xTicks.map((tick, i) => (
          <text
            key={i}
            x={tick.x}
            y={VIEW_H - 8}
            className="fill-ink-subtle tnum"
            fontSize="11"
            textAnchor="middle"
          >
            {tick.hour}h
          </text>
        ))}

        {/* Predicted polyline (dashed) */}
        <polyline
          points={predictedPoints}
          className="stroke-route-alternate fill-none"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Actual polyline */}
        <polyline
          points={actualPoints}
          className="stroke-route-primary fill-none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

"use client";

// Controlled-input wrapper. State lives in the parent (LiveOperatorDashboard);
// this component just renders three sliders and a Reset button.

import { applyOffsets, DEFAULT_OFFSETS } from "@/lib/simulation";

const RAINFALL_RANGE = { min: 0, max: 200, step: 5 };
const RIVER_RANGE = { min: -1, max: 3, step: 0.1 };
const TIDE_RANGE = { min: -1, max: 1, step: 0.1 };

function formatSigned(value, decimals = 1) {
  if (value === 0) return `0${".0".slice(0, decimals + 1)} m`;
  const abs = Math.abs(value).toFixed(decimals);
  const sign = value > 0 ? "+" : "-";
  return `${sign}${abs} m`;
}

function formatDelta(value) {
  // For the caption: leading +/- on non-zero, two decimals.
  if (Math.abs(value) < 0.005) return "0.00";
  const sign = value > 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(2)}`;
}

export default function SimulationPanel({ offsets, onChange }) {
  const isActive =
    offsets.rainfallMm !== 0 || offsets.riverM !== 0 || offsets.tideM !== 0;
  const delta = applyOffsets(0, offsets);

  function update(key, value) {
    onChange({ ...offsets, [key]: value });
  }

  return (
    <div
      className={
        "rounded-card p-6 bg-surface-1 border " +
        (isActive ? "border-tide" : "border-hairline")
      }
    >
      <div className="flex items-start justify-between gap-4 mb-5 max-md:flex-col max-md:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
            Scenario
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
            What-if simulation
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_OFFSETS)}
          className={
            "rounded-button px-3 py-2 text-sm font-medium transition-colors " +
            (isActive
              ? "bg-surface-2 text-ink hover:bg-surface-3 border border-hairline"
              : "bg-surface-2 text-ink-subtle border border-hairline opacity-60")
          }
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        <SliderRow
          label="Rainfall"
          unit="mm/h"
          value={offsets.rainfallMm}
          range={RAINFALL_RANGE}
          format={(v) => `${v} mm/h`}
          onChange={(v) => update("rainfallMm", v)}
        />
        <SliderRow
          label="River level"
          unit="m"
          value={offsets.riverM}
          range={RIVER_RANGE}
          format={(v) => formatSigned(v)}
          onChange={(v) => update("riverM", v)}
        />
        <SliderRow
          label="Tide"
          unit="m"
          value={offsets.tideM}
          range={TIDE_RANGE}
          format={(v) => formatSigned(v)}
          onChange={(v) => update("tideM", v)}
        />
      </div>

      <p className="mt-5 text-sm text-ink-subtle" aria-live="polite">
        {isActive ? (
          <>
            Simulating Δ <span className="tnum text-ink">{formatDelta(delta)}</span>
            {" m above baseline"}
          </>
        ) : (
          "No simulation active — showing live readings."
        )}
      </p>
    </div>
  );
}

function SliderRow({ label, value, range, format, onChange }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-ink-muted">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-ink-muted">{label}</span>
        <span className="tnum text-ink font-medium">{format(value)}</span>
      </span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-tide"
      />
    </label>
  );
}

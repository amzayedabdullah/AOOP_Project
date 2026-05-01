"use client";

// Dense dark-mode table of every sensor. Live "Current" and "Δ" columns
// recompute on each tick from the parent's useTick. Risk is communicated
// via <RiskPill>, not a hand-styled chip.

import { sensors } from "@/data/sensors";
import { riskLevelFor } from "@/lib/risk";
import { simulatedLevelFor } from "@/lib/simulation";
import RiskPill from "@/components/ui/RiskPill";

const HEAD_CLASS =
  "text-left px-3 py-2 text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle";

function deltaToScore(delta) {
  return Math.max(0, Math.min(100, Math.round((delta / 2.5) * 100)));
}

function formatDelta(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

export default function SensorTable({
  tick,
  offsets,
  focusedDistrictId,
  selectedSensorId,
  onSelectSensor,
}) {
  const visible = focusedDistrictId
    ? sensors.filter((s) => s.districtId === focusedDistrictId)
    : sensors;

  return (
    <div className="bg-surface-1 border border-hairline rounded-card p-4">
      <div className="px-2 pt-2 pb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
          Sensors {focusedDistrictId ? `· ${focusedDistrictId}` : "· all districts"}
        </p>
        <p className="text-xs text-ink-subtle tnum">
          {visible.length} rows
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className={HEAD_CLASS}>ID</th>
              <th className={HEAD_CLASS}>District</th>
              <th className={HEAD_CLASS}>River</th>
              <th className={HEAD_CLASS}>Coords</th>
              <th className={HEAD_CLASS + " text-right"}>Baseline</th>
              <th className={HEAD_CLASS + " text-right"}>Current</th>
              <th className={HEAD_CLASS + " text-right"}>Δ</th>
              <th className={HEAD_CLASS}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((sensor) => {
              const current = simulatedLevelFor(sensor.id, tick, offsets) ?? sensor.baselineLevel;
              const delta = current - sensor.baselineLevel;
              const score = deltaToScore(delta);
              const level = riskLevelFor(score);
              const isSelected = sensor.id === selectedSensorId;

              return (
                <tr
                  key={sensor.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectSensor(sensor.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectSensor(sensor.id);
                    }
                  }}
                  className={
                    "border-b border-hairline cursor-pointer " +
                    (isSelected
                      ? "bg-surface-2"
                      : "hover:bg-surface-2/50")
                  }
                >
                  <td className="px-3 py-3 font-mono text-ink-muted">
                    {sensor.id}
                  </td>
                  <td className="px-3 py-3 text-ink capitalize">
                    {sensor.districtId}
                  </td>
                  <td className="px-3 py-3 text-ink">{sensor.riverName}</td>
                  <td className="px-3 py-3 font-mono text-ink-subtle text-xs">
                    {sensor.lat.toFixed(4)}, {sensor.lng.toFixed(4)}
                  </td>
                  <td className="px-3 py-3 tnum text-right text-ink">
                    {sensor.baselineLevel.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 tnum text-right text-ink font-semibold">
                    {current.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 tnum text-right text-ink-muted">
                    {formatDelta(delta)}
                  </td>
                  <td className="px-3 py-3">
                    <RiskPill level={level} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

// Side-list of districts shown next to the overview map. The risk level for
// each district lives in a <RiskPill>, which is the only canonical surface
// for risk-scale colors on the operator side. Click a row to focus that
// district's sensors in the table below; click again to clear focus.

import { districts } from "@/data/districts";
import { sensors } from "@/data/sensors";
import { riskLevelFor } from "@/lib/risk";
import { simulatedDistrictScore } from "@/lib/simulation";
import RiskPill from "@/components/ui/RiskPill";

export default function OperatorDistrictList({
  tick,
  offsets,
  focusedDistrictId,
  onFocusDistrict,
}) {
  return (
    <div className="bg-surface-1 border border-hairline rounded-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle px-2 pt-2">
        Districts
      </p>
      <ul className="mt-3 flex flex-col">
        {districts.map((district) => {
          const score = simulatedDistrictScore(district.id, tick, offsets);
          const level = riskLevelFor(score);
          const sensorCount = sensors.filter(
            (s) => s.districtId === district.id,
          ).length;
          const isSelected = focusedDistrictId === district.id;

          return (
            <li key={district.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  onFocusDistrict(isSelected ? null : district.id)
                }
                className={
                  "w-full flex items-center justify-between gap-3 px-3 py-3 border-l-4 text-left transition-colors " +
                  (isSelected
                    ? "border-tide bg-surface-2"
                    : "border-transparent hover:bg-surface-2/60")
                }
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">
                    {district.name}
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {sensorCount} sensors
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="tnum text-sm text-ink-muted">
                    {score}%
                  </span>
                  <RiskPill level={level} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

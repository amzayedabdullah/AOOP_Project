"use client";

// Country-scale dashboard map. Bbox is fixed at lat 21.5–26.5, lng 88–93 so
// the map always feels like Bangladesh, not "four data points". District
// markers stay neutral — risk levels are conveyed via RiskPill in the side
// list (see OperatorDistrictList), keeping the canonical-consumer count for
// risk-scale color tokens at four files.

import { districts } from "@/data/districts";
import { sensors } from "@/data/sensors";
import { simulatedDistrictScore } from "@/lib/simulation";
import { projectLatLngToSvg } from "@/lib/projection";

const BANGLADESH_BBOX = {
  minLat: 21.5,
  maxLat: 26.5,
  minLng: 88,
  maxLng: 93,
};
const VIEWBOX = { width: 600, height: 400 };

function radiusForScore(score) {
  if (score >= 75) return 20;
  if (score >= 50) return 16;
  if (score >= 25) return 12;
  return 8;
}

export default function OperatorOverviewMap({
  tick,
  offsets,
  focusedDistrictId,
  onFocusDistrict,
}) {
  return (
    <div className="bg-surface-1 border border-hairline rounded-card p-6">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
          Overview
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
          Bangladesh
        </h2>
      </div>

      <div className="rounded-lg overflow-hidden border border-hairline bg-surface-2">
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto block"
          role="img"
          aria-label="All-districts overview map"
        >
          {/* Faint country canvas */}
          <rect
            x="0"
            y="0"
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            className="fill-surface-2"
          />

          {/* Sensor pins (smaller, neutral) */}
          {sensors.map((sensor) => {
            const { x, y } = projectLatLngToSvg(
              sensor.lat,
              sensor.lng,
              BANGLADESH_BBOX,
              VIEWBOX,
            );
            return (
              <circle
                key={sensor.id}
                cx={x}
                cy={y}
                r="3"
                className="fill-marker-sensor"
                fillOpacity="0.7"
              />
            );
          })}

          {/* District markers — neutral fill, size scales with risk score */}
          {districts.map((district) => {
            const { x, y } = projectLatLngToSvg(
              district.center.lat,
              district.center.lng,
              BANGLADESH_BBOX,
              VIEWBOX,
            );
            const score = simulatedDistrictScore(district.id, tick, offsets);
            const r = radiusForScore(score);
            const isFocused = focusedDistrictId === district.id;
            return (
              <g key={district.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={r + 4}
                  className="fill-surface-3"
                  fillOpacity="0.5"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  className={
                    isFocused
                      ? "fill-tide stroke-ink"
                      : "fill-tide stroke-hairline-strong"
                  }
                  strokeWidth={isFocused ? 2 : 1}
                  tabIndex={0}
                  role="button"
                  aria-label={`${district.name} — risk ${score}%`}
                  onClick={() => onFocusDistrict(district.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onFocusDistrict(district.id);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={x + r + 8}
                  y={y + 4}
                  className="fill-ink-muted"
                  fontSize="13"
                >
                  {district.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

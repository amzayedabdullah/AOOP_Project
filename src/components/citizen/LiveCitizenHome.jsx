"use client";

// Client wrapper around the three regions of the citizen home.
// Owns the useTick interval; the page itself stays a Server Component.
//
// Hydration note: relative-time strings depend on Date.now(), which differs
// between SSR and the first client render. We initialise `now` to 0 and let
// AlertCard render an em-dash on the first paint; the first tick then fills
// in the real "Nm ago" value. This avoids React hydration mismatch warnings.

import { useState } from "react";
import dynamic from "next/dynamic";
import useTick from "@/lib/useTick";
import { districtRiskScore, riskLevelFor } from "@/lib/risk";
import { computeRoute } from "@/lib/routing";
import { nearestShelters } from "@/lib/shelters";
import { districts } from "@/data/districts";
import { historicalReadings } from "@/data/historicalReadings";
import { sensors } from "@/data/sensors";
import { shelters } from "@/data/shelters";
import MetricTile from "@/components/ui/MetricTile";

// Leaflet imports `window` at module top-level, so RiskZoneMap is a
// client-only chunk. The skeleton matches the loaded map's dimensions
// (rounded card, surface-mist fill, 3:2 aspect) so the layout doesn't jump.
const RiskZoneMap = dynamic(() => import("@/components/ui/RiskZoneMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 shadow-card">
      <div className="aspect-[3/2] w-full rounded-lg bg-surface-mist border border-hairline-citizen" />
    </div>
  ),
});
import RiskSummaryCard from "./RiskSummaryCard";
import RoutePicker from "./RoutePicker";
import ShelterList from "./ShelterList";
import AlertFeed from "./AlertFeed";
import CommunityReportPanel from "./CommunityReportPanel";

const VARIANTS = ["safest", "fastest", "least-congested"];

function buildTrendForDistrict(districtId) {
  const districtSensorIds = sensors
    .filter((s) => s.districtId === districtId)
    .map((s) => s.id);

  // Group readings by timestamp, average the level across district sensors.
  const byTimestamp = new Map();
  for (const reading of historicalReadings) {
    if (!districtSensorIds.includes(reading.sensorId)) continue;
    const existing = byTimestamp.get(reading.timestamp) ?? { sum: 0, count: 0 };
    existing.sum += reading.level;
    existing.count += 1;
    byTimestamp.set(reading.timestamp, existing);
  }

  return Array.from(byTimestamp.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, agg]) => agg.sum / agg.count);
}

export default function LiveCitizenHome({ districtId, districtName }) {
  const { tick, now } = useTick(5000);
  const [selectedVariant, setSelectedVariant] = useState("safest");

  const district = districts.find((d) => d.id === districtId);
  const fromLatLng = [district.center.lat, district.center.lng];

  // Default selection = nearest verified shelter for this district.
  const defaultShelterId =
    nearestShelters(districtId, fromLatLng, 1, { verifiedOnly: true })[0]
      ?.shelter.id ?? null;
  const [selectedShelterId, setSelectedShelterId] = useState(defaultShelterId);

  const selectedShelter = shelters.find((s) => s.id === selectedShelterId);
  const goalLatLng = selectedShelter
    ? [selectedShelter.lat, selectedShelter.lng]
    : undefined;

  const score = districtRiskScore(districtId, tick);
  const level = riskLevelFor(score);
  const trend = buildTrendForDistrict(districtId);

  // Routes are computed from static seed data + the selected shelter — they
  // do NOT depend on `tick`, so the polylines stay stable while the hero
  // number jitters. They DO recompute when the user picks a new shelter.
  const routes = VARIANTS.map((variant) => {
    const result = computeRoute(districtId, variant, goalLatLng);
    if (!result) return null;
    return {
      variant,
      path: result.path,
      cost: result.cost,
      isSelected: variant === selectedVariant,
    };
  }).filter(Boolean);

  // Build the shelter overlay prop for the map.
  const shelterMarkers = nearestShelters(districtId, fromLatLng, 5, {
    verifiedOnly: true,
  }).map(({ shelter }) => ({
    shelter,
    isSelected: shelter.id === selectedShelterId,
  }));

  // SSR/hydration safety: emit `now=0` on the very first render, then real
  // timestamps once the client has hydrated. AlertCard treats 0 as "—".
  const safeNow = tick === 0 ? 0 : now;

  return (
    <section className="grid grid-cols-12 gap-6 max-md:grid-cols-1 max-md:gap-4">
      <div className="col-span-7 max-md:col-span-1">
        <MetricTile
          label={`${districtName} — current risk`}
          value={score}
          unit="%"
          riskLevel={level}
          trend={trend}
        />
      </div>
      <div className="col-span-5 max-md:col-span-1">
        <RiskSummaryCard level={level} />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <RiskZoneMap
          districtId={districtId}
          routes={routes}
          shelters={shelterMarkers}
          header={
            <RoutePicker
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />
          }
        />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <ShelterList
          districtId={districtId}
          fromLatLng={fromLatLng}
          selectedShelterId={selectedShelterId}
          onSelect={setSelectedShelterId}
        />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <AlertFeed districtId={districtId} now={safeNow} />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <CommunityReportPanel currentDistrictId={districtId} />
      </div>
    </section>
  );
}

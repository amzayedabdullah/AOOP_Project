"use client";

// Renders the nearest verified shelters with capacity + an "Evacuate here"
// button. Capacity bar uses Tide Cyan; risk-scale colors are intentionally
// not consumed here (capacity is not risk).

import { nearestShelters } from "@/lib/shelters";

const TYPE_LABEL = {
  school: "School",
  "community-center": "Community center",
  religious: "Religious site",
  embankment: "Embankment shelter",
  stadium: "Stadium",
};

export default function ShelterList({
  districtId,
  fromLatLng,
  selectedShelterId,
  onSelect,
}) {
  const rows = nearestShelters(districtId, fromLatLng, 5, {
    verifiedOnly: true,
  });

  if (rows.length === 0) {
    return (
      <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 text-body">
        No verified shelters found for this district.
      </div>
    );
  }

  return (
    <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 shadow-card">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-muted">
          Where to go
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-heading">
          Nearest shelters
        </h2>
      </div>

      <ul className="flex flex-col gap-3">
        {rows.map(({ shelter, distanceKm }) => {
          const atCapacity = shelter.currentOccupancy >= shelter.capacity;
          const isSelected = shelter.id === selectedShelterId;
          const fillPct = Math.min(
            100,
            Math.round((shelter.currentOccupancy / shelter.capacity) * 100),
          );

          return (
            <li
              key={shelter.id}
              className={
                "flex items-center justify-between gap-4 pl-4 pr-4 py-3 border-l-4 rounded-md " +
                (isSelected
                  ? "border-tide bg-tide-subtle/40"
                  : "border-transparent")
              }
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-heading truncate">
                    {shelter.name}
                  </span>
                  <span
                    className={
                      "inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-medium " +
                      (shelter.verified
                        ? "bg-tide-subtle text-tide-pressed"
                        : "bg-surface-mist text-muted")
                    }
                  >
                    {shelter.verified ? "Verified" : "Community-reported"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {TYPE_LABEL[shelter.type] ?? shelter.type}
                  {" · "}
                  <span className="tnum">{distanceKm.toFixed(1)}</span>{" "}
                  km away
                </p>
                <div className="mt-2">
                  {atCapacity ? (
                    <span className="inline-flex items-center bg-surface-mist text-muted text-xs px-2 py-0.5 rounded-pill">
                      At capacity
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 rounded-pill bg-hairline-citizen overflow-hidden">
                        <div
                          className="h-full bg-tide"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className="tnum text-xs text-muted whitespace-nowrap">
                        {shelter.currentOccupancy} / {shelter.capacity}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelect(shelter.id)}
                disabled={atCapacity}
                aria-disabled={atCapacity}
                className={
                  "shrink-0 rounded-button px-3 py-2 text-sm font-medium transition-colors " +
                  (atCapacity
                    ? "bg-surface-mist text-muted opacity-50 cursor-not-allowed"
                    : isSelected
                      ? "bg-tide-pressed text-white"
                      : "bg-tide hover:bg-tide-hover text-white")
                }
              >
                {isSelected ? "Selected" : "Evacuate here"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useCommunityReports } from "@/lib/communityReports";
import { formatRelativeFromNow } from "@/lib/relativeTime";
import useTick from "@/lib/useTick";
import { REPORT_TYPES } from "./CommunityReportForm";

const TYPE_LABEL = Object.fromEntries(
  REPORT_TYPES.map((t) => [t.value, t.label]),
);

const FEED_CAP = 20;

export default function CommunityReportFeed({ currentDistrictId }) {
  const { reports } = useCommunityReports();

  // Hydration-safe relative-time: useTick returns tick=0 on first render
  // (so the SSR pass and the first client paint both show "—"); the first
  // tick swaps in real Date.now() for the relative-time strings.
  const { tick, now: liveNow } = useTick(30_000);
  const now = tick === 0 ? 0 : liveNow;

  const visible = reports
    .filter((r) => r.districtId === currentDistrictId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, FEED_CAP);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-heading">Recent sightings</h3>
        <p className="mt-1 text-xs text-muted">
          Newest first · capped at {FEED_CAP}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted py-3">
          No reports yet — be the first to share what you see.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((report) => (
            <li
              key={report.id}
              className="border border-hairline-citizen rounded-card p-3 bg-surface-citizen"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center bg-surface-mist text-body text-xs px-2 py-0.5 rounded-pill">
                  {TYPE_LABEL[report.type] ?? report.type}
                </span>
                <span className="text-xs text-muted">
                  {now > 0 ? formatRelativeFromNow(report.submittedAt, now) : "—"}
                </span>
              </div>
              <p className="mt-2 text-sm text-body">{report.description}</p>
              <p className="mt-1 text-xs text-muted">
                {report.reporterName?.trim() || "Anonymous"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

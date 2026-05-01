"use client";

// Citizen alert feed — first cross-mode read in the project.
// Merges two sources at render time:
//   1) the static seed in src/data/alerts.js
//   2) operator-broadcast entries from the localStorage-backed outbox
// Neither source is mutated; the merge is purely a render-time view. The
// citizen sees one consistent AlertCard per entry — source attribution is
// intentionally invisible. SSR shows the seed only (useSyncExternalStore's
// stable empty server snapshot); operator entries appear after hydration.

import AlertCard from "./AlertCard";
import { alerts } from "@/data/alerts";
import { useAlertOutbox } from "@/lib/alertOutbox";

const FEED_CAP = 20;

export default function AlertFeed({ districtId, now }) {
  const { entries: outboxEntries } = useAlertOutbox();

  const outboxAsAlerts = outboxEntries.map((entry) => ({
    id: entry.id,
    districtId: entry.districtId,
    level: entry.level,
    headline: entry.headline,
    body: entry.body,
    issuedAt: entry.sentAt,
  }));

  const districtAlerts = [...alerts, ...outboxAsAlerts]
    .filter((alert) => alert.districtId === districtId)
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
    .slice(0, FEED_CAP);

  if (districtAlerts.length === 0) {
    return (
      <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 text-body">
        No active alerts for your district.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {districtAlerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} now={now} />
      ))}
    </ul>
  );
}
